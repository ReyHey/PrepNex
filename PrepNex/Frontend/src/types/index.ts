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

// --- Session ---

export interface Answer {
  questionId: number;
  code?: string;
  explanation?: string;
  selectedOptionId?: number;
}

export interface Session {
  id: string;
  position: string;
  skills: string[];
  questions: Question[];
  status: 'active' | 'submitted';
}

export interface QuestionFeedback {
  questionId: number;
  score?: number;
  correct?: boolean;
  feedback: string;
}

export interface SessionFeedback {
  overallScore: number;
  summary: string;
  questionFeedback: QuestionFeedback[];
}
