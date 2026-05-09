import { useLocation, useNavigate } from 'react-router-dom';
import type { Session, SessionFeedback, QuestionFeedback } from '../types';
import { CategoryTag } from '../components/questions/CategoryTag';
import { DifficultyBadge } from '../components/questions/DifficultyBadge';

interface LocationState {
  feedback: SessionFeedback;
  session: Session;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 8 ? 'text-green-400' : score >= 6 ? 'text-yellow-400' : 'text-red-400';
  const label = score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : 'Needs work';
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-6xl font-bold tabular-nums ${color}`}>{score}</span>
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-xs text-gray-600">out of 10</span>
    </div>
  );
}

function QuestionFeedbackCard({
  qf,
  session,
}: {
  qf: QuestionFeedback;
  session: Session;
}) {
  const question = session.questions.find((q) => q.id === qf.questionId);
  if (!question) return null;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 leading-snug">{question.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <DifficultyBadge difficulty={question.difficulty} />
            <CategoryTag category={question.category} />
            {question.topic && (
              <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                {question.topic}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          {qf.correct !== undefined && (
            <span
              className={`text-sm font-semibold ${qf.correct ? 'text-green-400' : 'text-red-400'}`}
            >
              {qf.correct ? '✓ Correct' : '✗ Incorrect'}
            </span>
          )}
          {qf.score !== undefined && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < qf.score!
                      ? qf.score! >= 8
                        ? 'bg-green-400'
                        : qf.score! >= 5
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">{qf.score}/10</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3.5">
        <p className="text-sm text-gray-300 leading-relaxed">{qf.feedback}</p>
      </div>
    </div>
  );
}

export function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state?.feedback || !state?.session) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d0d0d]">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">No feedback available.</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
          >
            Return home
          </button>
        </div>
      </div>
    );
  }

  const { feedback, session } = state;

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <header className="h-12 shrink-0 bg-gray-900 border-b border-gray-800 flex items-center px-6 gap-3">
        <span className="text-blue-500 text-lg font-bold">⌬</span>
        <span className="text-white font-semibold text-sm">PrepNex</span>
        <span className="text-gray-700">/</span>
        <span className="text-gray-400 text-sm">Session Feedback</span>
        <button
          onClick={() => navigate('/')}
          className="ml-auto text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          Done →
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
          {/* Overall score */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 flex flex-col sm:flex-row items-center gap-8">
            <ScoreRing score={feedback.overallScore} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                {session.position}
                {session.skills.length > 0 && (
                  <span className="ml-2 text-gray-600">· {session.skills.join(', ')}</span>
                )}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">{feedback.summary}</p>
            </div>
          </div>

          {/* Per-question feedback */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Question Breakdown
            </h2>
            <div className="space-y-3">
              {feedback.questionFeedback.map((qf) => (
                <QuestionFeedbackCard key={qf.questionId} qf={qf} session={session} />
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate('/setup')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Start another session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
