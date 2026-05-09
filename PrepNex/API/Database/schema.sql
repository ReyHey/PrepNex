-- =============================================================
-- PrepNex Database Schema
-- Target: SQL Server 2019+ / Azure SQL
-- =============================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'PrepNex')
BEGIN
    CREATE DATABASE PrepNex;
    PRINT 'Database PrepNex created.';
END
GO

USE PrepNex;
GO

-- -------------------------------------------------------
-- Questions
-- -------------------------------------------------------
CREATE TABLE Questions (
    Id          INT             NOT NULL IDENTITY(1,1),
    Title       NVARCHAR(500)   NOT NULL,
    Description NVARCHAR(MAX)   NOT NULL,
    Difficulty  NVARCHAR(20)    NOT NULL
                    CONSTRAINT CK_Questions_Difficulty
                    CHECK (Difficulty IN ('Easy', 'Medium', 'Hard')),
    Category    NVARCHAR(50)    NOT NULL
                    CONSTRAINT CK_Questions_Category
                    CHECK (Category IN ('multiple-choice', 'code-only', 'code-and-explain', 'explain')),
    Topic       NVARCHAR(100)   NULL,   -- e.g. 'C#', 'OOP', 'REST API'
    Language    NVARCHAR(50)    NULL,   -- Monaco/compiler identifier: 'csharp', 'javascript'
    StarterCode NVARCHAR(MAX)   NULL,
    CreatedAt   DATETIME2       NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT PK_Questions PRIMARY KEY (Id)
);

-- -------------------------------------------------------
-- Multiple-choice options
-- IsCorrect is server-side only — never returned to the client
-- in GET /api/questions responses.
-- -------------------------------------------------------
CREATE TABLE QuestionOptions (
    Id          INT             NOT NULL IDENTITY(1,1),
    QuestionId  INT             NOT NULL,
    Text        NVARCHAR(1000)  NOT NULL,
    IsCorrect   BIT             NOT NULL DEFAULT 0,
    SortOrder   INT             NOT NULL DEFAULT 0,

    CONSTRAINT PK_QuestionOptions PRIMARY KEY (Id),
    CONSTRAINT FK_QuestionOptions_Question
        FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- Hints  (ordered list per question)
-- -------------------------------------------------------
CREATE TABLE QuestionHints (
    Id          INT             NOT NULL IDENTITY(1,1),
    QuestionId  INT             NOT NULL,
    Text        NVARCHAR(MAX)   NOT NULL,
    SortOrder   INT             NOT NULL DEFAULT 0,

    CONSTRAINT PK_QuestionHints PRIMARY KEY (Id),
    CONSTRAINT FK_QuestionHints_Question
        FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- Examples  (input/output pairs shown in the question panel)
-- -------------------------------------------------------
CREATE TABLE QuestionExamples (
    Id          INT             NOT NULL IDENTITY(1,1),
    QuestionId  INT             NOT NULL,
    Input       NVARCHAR(MAX)   NOT NULL,
    Output      NVARCHAR(MAX)   NOT NULL,
    Explanation NVARCHAR(MAX)   NULL,
    SortOrder   INT             NOT NULL DEFAULT 0,

    CONSTRAINT PK_QuestionExamples PRIMARY KEY (Id),
    CONSTRAINT FK_QuestionExamples_Question
        FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- Constraints  (algorithmic bounds shown in the question panel)
-- -------------------------------------------------------
CREATE TABLE QuestionConstraints (
    Id          INT             NOT NULL IDENTITY(1,1),
    QuestionId  INT             NOT NULL,
    Text        NVARCHAR(500)   NOT NULL,
    SortOrder   INT             NOT NULL DEFAULT 0,

    CONSTRAINT PK_QuestionConstraints PRIMARY KEY (Id),
    CONSTRAINT FK_QuestionConstraints_Question
        FOREIGN KEY (QuestionId) REFERENCES Questions(Id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- Sessions  (one interview session per user attempt)
-- -------------------------------------------------------
CREATE TABLE Sessions (
    Id          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    Position    NVARCHAR(200)    NOT NULL,   -- e.g. 'Senior Developer'
    Status      NVARCHAR(20)     NOT NULL DEFAULT 'active'
                    CONSTRAINT CK_Sessions_Status
                    CHECK (Status IN ('active', 'submitted')),
    CreatedAt   DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    SubmittedAt DATETIME2        NULL,

    CONSTRAINT PK_Sessions PRIMARY KEY (Id)
);

-- -------------------------------------------------------
-- Session skills  (the optional skills the user selected)
-- -------------------------------------------------------
CREATE TABLE SessionSkills (
    SessionId   UNIQUEIDENTIFIER NOT NULL,
    Skill       NVARCHAR(100)    NOT NULL,

    CONSTRAINT PK_SessionSkills PRIMARY KEY (SessionId, Skill),
    CONSTRAINT FK_SessionSkills_Session
        FOREIGN KEY (SessionId) REFERENCES Sessions(Id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- Session questions  (ordered list of questions for a session)
-- -------------------------------------------------------
CREATE TABLE SessionQuestions (
    SessionId   UNIQUEIDENTIFIER NOT NULL,
    QuestionId  INT              NOT NULL,
    SortOrder   INT              NOT NULL DEFAULT 0,

    CONSTRAINT PK_SessionQuestions PRIMARY KEY (SessionId, QuestionId),
    CONSTRAINT FK_SessionQuestions_Session
        FOREIGN KEY (SessionId) REFERENCES Sessions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_SessionQuestions_Question
        FOREIGN KEY (QuestionId) REFERENCES Questions(Id)
);

-- -------------------------------------------------------
-- Answers  (one row per question per session)
-- -------------------------------------------------------
CREATE TABLE Answers (
    Id               INT              NOT NULL IDENTITY(1,1),
    SessionId        UNIQUEIDENTIFIER NOT NULL,
    QuestionId       INT              NOT NULL,
    Code             NVARCHAR(MAX)    NULL,   -- for code-only / code-and-explain
    Explanation      NVARCHAR(MAX)    NULL,   -- for explain / code-and-explain
    SelectedOptionId INT              NULL,   -- for multiple-choice
    AnsweredAt       DATETIME2        NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT PK_Answers PRIMARY KEY (Id),
    CONSTRAINT UQ_Answers_Session_Question UNIQUE (SessionId, QuestionId),
    CONSTRAINT FK_Answers_Session
        FOREIGN KEY (SessionId) REFERENCES Sessions(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Answers_Question
        FOREIGN KEY (QuestionId) REFERENCES Questions(Id),
    CONSTRAINT FK_Answers_SelectedOption
        FOREIGN KEY (SelectedOptionId) REFERENCES QuestionOptions(Id)
);

-- -------------------------------------------------------
-- Session feedback  (one row per submitted session — the
--                    overall AI-generated analysis)
-- -------------------------------------------------------
CREATE TABLE SessionFeedback (
    Id           INT              NOT NULL IDENTITY(1,1),
    SessionId    UNIQUEIDENTIFIER NOT NULL,
    OverallScore INT              NOT NULL
                     CONSTRAINT CK_SessionFeedback_Score
                     CHECK (OverallScore BETWEEN 0 AND 10),
    Summary      NVARCHAR(MAX)    NOT NULL,
    CreatedAt    DATETIME2        NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT PK_SessionFeedback PRIMARY KEY (Id),
    CONSTRAINT UQ_SessionFeedback_Session UNIQUE (SessionId),
    CONSTRAINT FK_SessionFeedback_Session
        FOREIGN KEY (SessionId) REFERENCES Sessions(Id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- Question feedback  (one row per question within a session
--                     feedback report)
-- -------------------------------------------------------
CREATE TABLE QuestionFeedback (
    Id                INT NOT NULL IDENTITY(1,1),
    SessionFeedbackId INT NOT NULL,
    QuestionId        INT NOT NULL,
    Score             INT NULL
                          CONSTRAINT CK_QuestionFeedback_Score
                          CHECK (Score BETWEEN 0 AND 10),  -- NULL for multiple-choice
    IsCorrect         BIT NULL,                             -- NULL for non-MC questions
    Feedback          NVARCHAR(MAX) NOT NULL,

    CONSTRAINT PK_QuestionFeedback PRIMARY KEY (Id),
    CONSTRAINT FK_QuestionFeedback_SessionFeedback
        FOREIGN KEY (SessionFeedbackId) REFERENCES SessionFeedback(Id) ON DELETE CASCADE,
    CONSTRAINT FK_QuestionFeedback_Question
        FOREIGN KEY (QuestionId) REFERENCES Questions(Id)
);

-- -------------------------------------------------------
-- Indexes
-- -------------------------------------------------------
CREATE INDEX IX_Questions_Category    ON Questions (Category);
CREATE INDEX IX_Questions_Difficulty  ON Questions (Difficulty);
CREATE INDEX IX_Questions_Topic       ON Questions (Topic);

CREATE INDEX IX_QuestionOptions_QuestionId ON QuestionOptions (QuestionId);
CREATE INDEX IX_QuestionHints_QuestionId   ON QuestionHints   (QuestionId);
CREATE INDEX IX_QuestionExamples_QuestionId ON QuestionExamples (QuestionId);
CREATE INDEX IX_QuestionConstraints_QuestionId ON QuestionConstraints (QuestionId);

CREATE INDEX IX_Sessions_Status    ON Sessions (Status);
CREATE INDEX IX_Answers_SessionId  ON Answers  (SessionId);
CREATE INDEX IX_Answers_QuestionId ON Answers  (QuestionId);
CREATE INDEX IX_QuestionFeedback_SessionFeedbackId ON QuestionFeedback (SessionFeedbackId);
