import type { QuestionCategory } from '../../types';

const LABELS: Record<QuestionCategory, string> = {
  'multiple-choice': 'Multiple Choice',
  'code-only': 'Code',
  'code-and-explain': 'Code & Explain',
  explain: 'Explain',
};

const COLORS: Record<QuestionCategory, string> = {
  'multiple-choice': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  'code-only': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  'code-and-explain': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  explain: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
};

interface CategoryTagProps {
  category: QuestionCategory;
}

export function CategoryTag({ category }: CategoryTagProps) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border ${COLORS[category] ?? 'bg-gray-700/60 text-gray-300 border-gray-600/50'}`}
    >
      {LABELS[category] ?? category}
    </span>
  );
}
