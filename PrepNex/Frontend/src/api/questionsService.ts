// Questions service — the single place that knows how to talk to the backend.
// Set VITE_USE_MOCK_DATA=true in .env to use local mock data (no backend needed).

import { client } from './client';
import type { ApiQuestion, GetQuestionsResponse } from './types';
import { mockQuestions } from './mockData';
import type { Difficulty, Question, QuestionType } from '../types';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA as string) === 'true';

function mapApiQuestion(q: ApiQuestion): Question {
  return {
    id: q.id,
    title: q.title,
    description: q.description,
    difficulty: q.difficulty as Difficulty,
    category: q.category,
    type: q.type as QuestionType,
    starterCode: q.starterCode ?? undefined,
    suggestedAnswer: q.suggestedAnswer ?? undefined,
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
};
