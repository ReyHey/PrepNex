import type { Difficulty, FilterState, QuestionCategory } from '../../types';

interface SearchFilterProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  topics: string[];
}

const difficulties: Array<Difficulty | 'All'> = ['All', 'Easy', 'Medium', 'Hard'];

const categories: Array<{ value: QuestionCategory | 'All'; label: string }> = [
  { value: 'All', label: 'All' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'code-only', label: 'Code' },
  { value: 'code-and-explain', label: 'Code & Explain' },
  { value: 'explain', label: 'Explain' },
];

export function SearchFilter({ filter, onChange, topics }: SearchFilterProps) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filter, [key]: value });

  return (
    <div className="p-3 space-y-2 border-b border-gray-800">
      <input
        type="text"
        placeholder="Search questions..."
        value={filter.search}
        onChange={(e) => set('search', e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200
          placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <div className="flex gap-1.5 flex-wrap">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => set('difficulty', d)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer
              ${
                filter.difficulty === d
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {categories.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => set('category', value)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer
              ${
                filter.category === value
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      {topics.length > 0 && (
        <select
          value={filter.topic}
          onChange={(e) => set('topic', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300
            focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
