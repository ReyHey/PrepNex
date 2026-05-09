import type { Question, Answer } from '../../types';
import { SessionMultipleChoice } from './SessionMultipleChoice';
import { SessionCodeEditor } from './SessionCodeEditor';
import { SessionExplainEditor } from './SessionExplainEditor';
import { SessionCodeAndExplain } from './SessionCodeAndExplain';

interface Props {
  question: Question;
  initialAnswer?: Answer;
  onAnswerChange: (answer: Answer) => void;
}

export function SessionAnswerPanel({ question, initialAnswer, onAnswerChange }: Props) {
  const shared = { question, initialAnswer, onAnswerChange };

  switch (question.category) {
    case 'multiple-choice':
      return <SessionMultipleChoice {...shared} />;
    case 'code-only':
      return <SessionCodeEditor {...shared} />;
    case 'explain':
      return <SessionExplainEditor {...shared} />;
    case 'code-and-explain':
      return <SessionCodeAndExplain {...shared} />;
  }
}
