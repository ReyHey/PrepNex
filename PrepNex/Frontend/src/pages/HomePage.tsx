import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { DifficultyBadge } from '../components/questions/DifficultyBadge';
import { CategoryTag } from '../components/questions/CategoryTag';
import { Spinner } from '../components/ui/Spinner';
import type { FilterState, Question } from '../types';
import { SearchFilter } from '../components/questions/SearchFilter';
import { Navbar } from '../components/layout/Navbar';

const defaultFilter: FilterState = {
  search: '',
  difficulty: 'All',
  category: 'All',
  topic: '',
};

export function HomePage() {
  const { questions, loading, error } = useQuestions();
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const navigate = useNavigate();

  const topics = useMemo(
    () => [...new Set(questions.map((q) => q.topic).filter(Boolean) as string[])].sort(),
    [questions],
  );

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (filter.search && !q.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.difficulty !== 'All' && q.difficulty !== filter.difficulty) return false;
      if (filter.category !== 'All' && q.category !== filter.category) return false;
      if (filter.topic && q.topic !== filter.topic) return false;
      return true;
    });
  }, [questions, filter]);

  const stats = useMemo(
    () => ({
      easy: questions.filter((q) => q.difficulty === 'Easy').length,
      medium: questions.filter((q) => q.difficulty === 'Medium').length,
      hard: questions.filter((q) => q.difficulty === 'Hard').length,
    }),
    [questions],
  );

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d]">
      <Navbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Start session CTA */}
          <div className="mb-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6 flex items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Ready for a mock interview?</h2>
              <p className="text-sm text-gray-400">
                Pick a position and skills — we'll build a curated session and analyse your answers when you're done.
              </p>
            </div>
            <button
              onClick={() => navigate('/setup')}
              className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Start Interview →
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Question Library</h1>
            <p className="text-gray-400">
              Browse and practice individual questions. Click any row to open it.
            </p>
          </div>

          {!loading && questions.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Easy', count: stats.easy, color: 'text-green-400' },
                { label: 'Medium', count: stats.medium, color: 'text-yellow-400' },
                { label: 'Hard', count: stats.hard, color: 'text-red-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <p className={`text-2xl font-bold ${color}`}>{count}</p>
                  <p className="text-sm text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <SearchFilter filter={filter} onChange={setFilter} topics={topics} />
            </div>

            {loading && (
              <div className="flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm">Failed to load questions: {error}</p>
              </div>
            )}

            {!loading && !error && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-2.5 w-12">#</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-2.5">Title</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-2.5">Difficulty</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-2.5">Format</th>
                    <th className="text-left text-xs text-gray-500 font-medium px-4 py-2.5">Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">
                        No questions match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((q: Question, i) => (
                      <tr
                        key={q.id}
                        onClick={() => navigate(`/questions/${q.id}`)}
                        className="border-b border-gray-800/60 hover:bg-gray-800/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-gray-600">{i + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-200 font-medium">{q.title}</td>
                        <td className="px-4 py-3">
                          <DifficultyBadge difficulty={q.difficulty} />
                        </td>
                        <td className="px-4 py-3">
                          <CategoryTag category={q.category} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {q.topic ?? '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
