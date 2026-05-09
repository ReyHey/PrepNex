export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionCategory = 'multiple-choice' | 'code-only' | 'code-and-explain' | 'explain';

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface MultipleChoiceOption {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: QuestionCategory;
  topic?: string;
  language?: string;
  starterCode?: string;
  options?: MultipleChoiceOption[];
  correctOptionId?: number;
  hints?: string[];
  examples?: QuestionExample[];
  constraints?: string[];
}

export interface FilterState {
  search: string;
  difficulty: Difficulty | 'All';
  category: QuestionCategory | 'All';
  topic: string;
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
