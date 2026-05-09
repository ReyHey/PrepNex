import type { Difficulty } from '../../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

const styles: Record<Difficulty, string> = {
  Easy: 'text-green-400 bg-green-400/10 border border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20',
  Hard: 'text-red-400 bg-red-400/10 border border-red-400/20',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export function DifficultyBadge({ difficulty, size = 'sm' }: DifficultyBadgeProps) {
  return (
    <span className={`rounded-full font-medium ${styles[difficulty]} ${sizeClasses[size]}`}>
      {difficulty}
    </span>
  );
}
