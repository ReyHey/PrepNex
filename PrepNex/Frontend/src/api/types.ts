// These types mirror the backend API response shapes.
// Update them when the backend contract is finalized.

export interface ApiQuestion {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  type: string;
  starterCode?: string | null;
  suggestedAnswer?: string | null;
}

export type GetQuestionsResponse = ApiQuestion[];
export type GetQuestionResponse = ApiQuestion;

export interface ApiError {
  message: string;
  statusCode?: number;
}
