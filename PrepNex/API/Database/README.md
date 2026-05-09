# Database Setup

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | Creates all tables, constraints, and indexes |
| `seed.sql` | Inserts the 11 starter questions (mirrors `mockData.ts`) |

## Applying

Run against a SQL Server instance (local or Azure SQL):

```sql
-- schema.sql creates the database automatically if it doesn't exist
:r schema.sql
:r seed.sql
```

Or via `sqlcmd` (connect to `master` so the CREATE DATABASE can run):

```bash
sqlcmd -S localhost -d master -i schema.sql
sqlcmd -S localhost -d master -i seed.sql
```

## Connection string

Add to `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

## Entity map

```
Questions           ← core question data
QuestionOptions     ← multiple-choice options (IsCorrect is server-side only, never sent to client)
QuestionHints       ← ordered hints list
QuestionExamples    ← input/output examples
QuestionConstraints ← algorithmic bounds

Sessions            ← one per interview attempt
SessionSkills       ← skills the user selected at setup
SessionQuestions    ← ordered list of questions for the session

Answers             ← one row per question per session (code + explanation + selectedOptionId)

SessionFeedback     ← overall AI-generated score and summary
QuestionFeedback    ← per-question score/correct + feedback text
```
