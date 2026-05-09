import { client } from './client';
import { mockQuestions } from './mockData';
import type { Session, Answer, SessionFeedback, QuestionFeedback } from '../types';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA as string) === 'true';

// In-memory store for mock sessions
const mockSessions = new Map<string, Session>();
const mockFeedback = new Map<string, SessionFeedback>();

function buildMockFeedback(session: Session, answers: Answer[]): SessionFeedback {
  const questionFeedback: QuestionFeedback[] = session.questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);

    if (q.category === 'multiple-choice') {
      const correct = answer?.selectedOptionId === q.correctOptionId;
      return {
        questionId: q.id,
        correct,
        feedback: correct
          ? 'Correct! You identified the right answer.'
          : `Incorrect. The right answer was option ${
              q.options?.find((o) => o.id === q.correctOptionId)?.text ?? '?'
            }.`,
      };
    }

    const hasCode = (answer?.code ?? '').trim().length > 20;
    const hasExplanation = (answer?.explanation ?? '').trim().length > 10;
    const answered = hasCode || hasExplanation;

    const score = !answered ? 2 : hasCode && hasExplanation ? 8 : 7;

    return {
      questionId: q.id,
      score,
      feedback: !answered
        ? 'No answer was provided for this question.'
        : score >= 8
        ? 'Great answer! You demonstrated a clear understanding and covered the key points well.'
        : 'Good effort. Your answer covers the basics — consider expanding on edge cases or trade-offs.',
    };
  });

  const nonMcFeedback = questionFeedback.filter((f) => f.score !== undefined);
  const mcFeedback = questionFeedback.filter((f) => f.correct !== undefined);

  const avgCodeScore =
    nonMcFeedback.length > 0
      ? nonMcFeedback.reduce((s, f) => s + (f.score ?? 0), 0) / nonMcFeedback.length
      : 0;
  const mcRate =
    mcFeedback.length > 0
      ? mcFeedback.filter((f) => f.correct).length / mcFeedback.length
      : 0;

  const totalParts = (nonMcFeedback.length > 0 ? 1 : 0) + (mcFeedback.length > 0 ? 1 : 0);
  const overallScore = Math.round(
    totalParts > 0
      ? ((nonMcFeedback.length > 0 ? avgCodeScore : 0) + (mcFeedback.length > 0 ? mcRate * 10 : 0)) /
          totalParts
      : 0,
  );

  const answeredCount = answers.filter(
    (a) => a.selectedOptionId !== undefined || (a.code ?? '').trim() || (a.explanation ?? '').trim(),
  ).length;

  return {
    overallScore,
    summary: `You completed ${answeredCount} of ${session.questions.length} questions for the ${session.position} session. ${
      overallScore >= 8
        ? 'Excellent performance — you demonstrated strong technical knowledge across the board.'
        : overallScore >= 6
        ? 'Solid performance. A few areas could use more depth, but the fundamentals are clearly there.'
        : 'There is room to grow. Focus on the questions marked below and revisit the underlying concepts.'
    }`,
    questionFeedback,
  };
}

export const sessionService = {
  createSession: async (position: string, skills: string[]): Promise<Session> => {
    if (USE_MOCK) {
      const session: Session = {
        id: `session_${Date.now()}`,
        position,
        skills,
        questions: mockQuestions,
        status: 'active',
      };
      mockSessions.set(session.id, session);
      return session;
    }
    return client.post<Session>('/api/sessions', { position, skills });
  },

  getSession: async (id: string): Promise<Session> => {
    if (USE_MOCK) {
      const session = mockSessions.get(id);
      if (!session) throw new Error('Session not found');
      return session;
    }
    return client.get<Session>(`/api/sessions/${id}`);
  },

  submitSession: async (id: string, answers: Answer[]): Promise<SessionFeedback> => {
    if (USE_MOCK) {
      const session = mockSessions.get(id);
      if (!session) throw new Error('Session not found');
      await new Promise((res) => setTimeout(res, 2000));
      session.status = 'submitted';
      const feedback = buildMockFeedback(session, answers);
      mockFeedback.set(id, feedback);
      return feedback;
    }
    return client.post<SessionFeedback>(`/api/sessions/${id}/submit`, { answers });
  },

  getFeedback: async (id: string): Promise<SessionFeedback> => {
    if (USE_MOCK) {
      const feedback = mockFeedback.get(id);
      if (!feedback) throw new Error('Feedback not found');
      return feedback;
    }
    return client.get<SessionFeedback>(`/api/sessions/${id}/feedback`);
  },
};
