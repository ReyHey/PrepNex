export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'technical' | 'conceptual';

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  type: QuestionType;
  starterCode?: string;
  suggestedAnswer?: string;
  examples?: QuestionExample[];
  constraints?: string[];
  hints?: string[];
}

export interface FilterState {
  search: string;
  difficulty: Difficulty | 'All';
  type: QuestionType | 'All';
  category: string;
}

export interface SubmitAnswerResponse {
  message: string;
  sessionId: string;
  answerId: number;
  totalAnswers: number;
  canRequestFeedback: boolean;
}

export interface QuestionFeedback {
  questionId: number;
  questionTitle: string;
  userAnswer: string;
  feedback: string;
  score?: number;
  strengths: string[];
  improvements: string[];
}

export interface AIFeedbackResponse {
  sessionId: string;
  totalAnswers: number;
  overallFeedback: string;
  questionFeedbacks: QuestionFeedback[];
}
