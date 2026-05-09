import { client } from './client';
import type { SubmitAnswerResponse, AIFeedbackResponse } from '../types';

export const answersService = {
  submitAnswer: async (questionId: number, answer: string, sessionId?: string): Promise<SubmitAnswerResponse> => {
	return client.post<SubmitAnswerResponse>('/api/answers/submit', {
	  questionId,
	  answer,
	  sessionId,
	});
  },

  getAnswerCount: async (sessionId: string): Promise<{ sessionId: string; totalAnswers: number; questionIds: number[]; canRequestFeedback: boolean }> => {
	return client.get(`/api/answers/session/${sessionId}/count`);
  },

  getFeedback: async (sessionId: string): Promise<AIFeedbackResponse> => {
	return client.post<AIFeedbackResponse>('/api/answers/feedback', { sessionId });
  },

  getSessionAnswers: async (sessionId: string): Promise<{ sessionId: string; totalAnswers: number; answers: any[] }> => {
	return client.get(`/api/answers/session/${sessionId}`);
  },
};
