import { client } from './client';
import type { ApiQuestion, GetQuestionsResponse, ReviewPayload, ReviewResponse, SubmitAnswerResponse } from './types';
import { mockQuestions } from './mockData';
import type { Difficulty, Question, QuestionCategory } from '../types';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA as string) === 'true';

function mapApiQuestion(q: ApiQuestion): Question {
  return {
    id: q.id,
    title: q.title,
    description: q.description,
    difficulty: q.difficulty as Difficulty,
    category: q.category as QuestionCategory,
    topic: q.topic ?? undefined,
    language: q.language ?? undefined,
    starterCode: q.starterCode ?? undefined,
    options: q.options ?? undefined,
    hints: q.hints ?? undefined,
    examples: q.examples ?? undefined,
    constraints: q.constraints ?? undefined,
  };
}

export const questionsService = {
  getAll: async (): Promise<Question[]> => {
    if (USE_MOCK) return mockQuestions;
    const data = await client.get<GetQuestionsResponse>('/api/questions');
    return data.map(mapApiQuestion);
  },

  getById: async (id: number): Promise<Question> => {
    if (USE_MOCK) {
      const found = mockQuestions.find((q) => q.id === id);
      if (!found) throw new Error(`Question ${id} not found`);
      return found;
    }
    const data = await client.get<ApiQuestion>(`/api/questions/${id}`);
    return mapApiQuestion(data);
  },

  reviewAnswer: async (id: number, payload: ReviewPayload): Promise<ReviewResponse> => {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 1800));
      const hasCode = payload.code && payload.code.trim().length > 20;
      const hasExplanation = payload.explanation && payload.explanation.trim().length > 20;
      const score = hasCode && hasExplanation ? 8 : hasCode || hasExplanation ? 7 : 4;
      return {
        score,
        feedback:
          score >= 7
            ? 'Good work! Your answer demonstrates a solid understanding of the concept. The key ideas are well-covered. Consider elaborating on edge cases or trade-offs to make your answer even stronger.'
            : 'Your answer touches on the topic but lacks depth. Try to explain the "why" behind your approach and consider common edge cases.',
      };
    }
    return client.post<ReviewResponse>(`/api/questions/${id}/review`, payload);
  },

  submitMultipleChoice: async (id: number, selectedOptionId: number): Promise<SubmitAnswerResponse> => {
    if (USE_MOCK) {
      const q = mockQuestions.find((q) => q.id === id);
      return { correct: q?.correctOptionId === selectedOptionId };
    }
    return client.post<SubmitAnswerResponse>(`/api/questions/${id}/answer`, { selectedOptionId });
  },
};
