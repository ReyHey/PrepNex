import type { Difficulty, FilterState, QuestionType } from '../../types';

interface SearchFilterProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  categories: string[];
}

const difficulties: Array<Difficulty | 'All'> = ['All', 'Easy', 'Medium', 'Hard'];
const types: Array<QuestionType | 'All'> = ['All', 'technical', 'conceptual'];

export function SearchFilter({ filter, onChange, categories }: SearchFilterProps) {
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
        {types.map((t) => (
          <button
            key={t}
            onClick={() => set('type', t)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer
              ${
                filter.type === t
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
          >
            {t === 'All' ? 'All Types' : t}
          </button>
        ))}
      </div>
      {categories.length > 0 && (
        <select
          value={filter.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300
            focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
