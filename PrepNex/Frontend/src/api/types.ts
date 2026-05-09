export interface ApiMultipleChoiceOption {
  id: number;
  text: string;
}

export interface ApiQuestion {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  topic?: string | null;
  language?: string | null;
  starterCode?: string | null;
  options?: ApiMultipleChoiceOption[] | null;
  hints?: string[] | null;
  examples?: { input: string; output: string; explanation?: string }[] | null;
  constraints?: string[] | null;
}

export type GetQuestionsResponse = ApiQuestion[];
export type GetQuestionResponse = ApiQuestion;

export interface ReviewPayload {
  code?: string;
  explanation?: string;
}

export interface ReviewResponse {
  score: number;
  feedback: string;
}

export interface SubmitAnswerPayload {
  selectedOptionId: number;
}

export interface SubmitAnswerResponse {
  correct: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
