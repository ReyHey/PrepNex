import type { Question } from '../../types';
import { DifficultyBadge } from './DifficultyBadge';
import { CategoryTag } from './CategoryTag';

interface QuestionCardProps {
  question: Question;
  selected?: boolean;
  onClick: () => void;
  index: number;
}

export function QuestionCard({ question, selected, onClick, index }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-800 transition-colors
        hover:bg-gray-800/60 cursor-pointer
        ${selected ? 'bg-gray-800 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-gray-500 text-xs mt-0.5 w-5 shrink-0">{index}.</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${selected ? 'text-white' : 'text-gray-200'}`}>
            {question.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <DifficultyBadge difficulty={question.difficulty} />
            <CategoryTag category={question.category} />
            {question.topic && (
              <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                {question.topic}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
