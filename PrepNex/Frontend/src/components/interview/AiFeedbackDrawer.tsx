import { Spinner } from '../ui/Spinner';

interface AiFeedbackDrawerProps {
  open: boolean;
  loading: boolean;
  score?: number;
  feedback?: string;
  onClose: () => void;
}

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i < score
              ? score >= 8
                ? 'bg-green-400'
                : score >= 5
                ? 'bg-yellow-400'
                : 'bg-red-400'
              : 'bg-gray-700'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-200">{score}/10</span>
    </div>
  );
}

export function AiFeedbackDrawer({ open, loading, score, feedback, onClose }: AiFeedbackDrawerProps) {
  return (
    <div
      className={`absolute inset-y-0 right-0 w-full bg-[#161616] border-l border-gray-800 flex flex-col
        transition-transform duration-300 ease-in-out z-10
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">AI Review</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-200 transition-colors text-lg leading-none cursor-pointer"
          aria-label="Close feedback"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-gray-500">Reviewing your answer...</p>
          </div>
        )}

        {!loading && score !== undefined && feedback && (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Score</p>
              <ScoreDots score={score} />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Feedback</p>
              <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-300 leading-relaxed border border-gray-700/50">
                {feedback}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
