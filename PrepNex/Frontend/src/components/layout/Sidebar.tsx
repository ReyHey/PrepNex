import { useMemo, useState } from 'react';
import type { Question, FilterState } from '../../types';
import { QuestionCard } from '../questions/QuestionCard';
import { SearchFilter } from '../questions/SearchFilter';
import { Spinner } from '../ui/Spinner';

interface SidebarProps {
  questions: Question[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const defaultFilter: FilterState = {
  search: '',
  difficulty: 'All',
  type: 'All',
  category: '',
};

export function Sidebar({ questions, loading, selectedId, onSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  const categories = useMemo(
    () => [...new Set(questions.map((q) => q.category))].sort(),
    [questions],
  );

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (filter.search && !q.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.difficulty !== 'All' && q.difficulty !== filter.difficulty) return false;
      if (filter.type !== 'All' && q.type !== filter.type) return false;
      if (filter.category && q.category !== filter.category) return false;
      return true;
    });
  }, [questions, filter]);

  if (collapsed) {
    return (
      <div className="flex flex-col items-center w-10 bg-gray-900 border-r border-gray-800 py-3 gap-3">
        <button
          onClick={() => setCollapsed(false)}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer text-lg"
          title="Expand sidebar"
        >
          ›
        </button>
        <div
          className="text-gray-600 text-xs rotate-90 whitespace-nowrap mt-4 select-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          Problems
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-72 shrink-0 bg-gray-900 border-r border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-sm font-semibold text-gray-200">
          Problems{' '}
          {!loading && (
            <span className="text-gray-500 font-normal">({filtered.length})</span>
          )}
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-500 hover:text-gray-200 transition-colors text-lg cursor-pointer"
          title="Collapse sidebar"
        >
          ‹
        </button>
      </div>

      <SearchFilter filter={filter} onChange={setFilter} categories={categories} />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No questions match your filters.</p>
        ) : (
          filtered.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i + 1}
              selected={selectedId === q.id}
              onClick={() => onSelect(q.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
