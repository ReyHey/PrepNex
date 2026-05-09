import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionService } from '../api/sessionService';
import { SessionAnswerPanel } from '../components/session/SessionAnswerPanel';
import { QuestionPanel } from '../components/interview/QuestionPanel';
import { CategoryTag } from '../components/questions/CategoryTag';
import { DifficultyBadge } from '../components/questions/DifficultyBadge';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import type { Session, Answer, Question } from '../types';

function isAnswered(answer: Answer | undefined, question: Question): boolean {
  if (!answer) return false;
  if (question.category === 'multiple-choice') return answer.selectedOptionId !== undefined;
  if (question.category === 'code-only') return (answer.code ?? '').trim().length > 0;
  if (question.category === 'explain') return (answer.explanation ?? '').trim().length >= 10;
  if (question.category === 'code-and-explain')
    return (answer.code ?? '').trim().length > 0 || (answer.explanation ?? '').trim().length >= 10;
  return false;
}

export function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map());
  const [panelRatio, setPanelRatio] = useState(50);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    sessionService
      .getSession(sessionId)
      .then(setSession)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleAnswerChange = (answer: Answer) => {
    setAnswers((prev) => new Map(prev).set(answer.questionId, answer));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(70, Math.max(30, ((e.clientX - rect.left) / rect.width) * 100));
    setPanelRatio(ratio);
  };

  const handleSubmit = async () => {
    if (!session || !sessionId) return;
    setSubmitting(true);
    try {
      const answerList = Array.from(answers.values());
      const feedback = await sessionService.submitSession(sessionId, answerList);
      navigate(`/session/${sessionId}/feedback`, { state: { feedback, session } });
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d0d0d]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d0d0d]">
        <p className="text-red-400 text-sm">{error ?? 'Session not found'}</p>
      </div>
    );
  }

  const question = session.questions[currentIndex];
  const answeredCount = session.questions.filter((q) => isAnswered(answers.get(q.id), q)).length;

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Header */}
      <header className="h-12 shrink-0 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3 z-10">
        <span className="text-blue-500 text-lg font-bold">⌬</span>
        <span className="text-white font-semibold text-sm">{session.position}</span>
        <span className="text-gray-700 text-xs">interview session</span>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs text-gray-400">
            <span className="text-white font-medium">{answeredCount}</span>
            <span className="text-gray-600"> / </span>
            {session.questions.length} answered
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            loading={submitting}
            disabled={submitting}
          >
            Finish & Submit
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Session sidebar */}
        <div className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="px-3 py-2.5 border-b border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Questions</span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {session.questions.map((q, i) => {
              const answered = isAnswered(answers.get(q.id), q);
              const current = i === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors cursor-pointer
                    border-l-2 hover:bg-gray-800/60
                    ${current ? 'border-l-blue-500 bg-gray-800/50' : 'border-l-transparent'}`}
                >
                  <span
                    className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      current
                        ? 'bg-blue-400'
                        : answered
                        ? 'bg-green-400'
                        : 'bg-gray-600'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${current ? 'text-white' : 'text-gray-300'}`}>
                      {i + 1}. {q.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div
          className="flex-1 flex overflow-hidden select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          {/* Question panel */}
          <div
            className="bg-gray-900 overflow-hidden border-r border-gray-800"
            style={{ width: `${panelRatio}%` }}
          >
            <QuestionPanel question={question} />
          </div>

          <div
            className="w-1 bg-gray-800 hover:bg-blue-600 cursor-col-resize shrink-0 transition-colors"
            onMouseDown={() => setDragging(true)}
          />

          {/* Answer panel */}
          <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
            <SessionAnswerPanel
              key={question.id}
              question={question}
              initialAnswer={answers.get(question.id)}
              onAnswerChange={handleAnswerChange}
            />
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="h-11 shrink-0 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="text-xs text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
        >
          ← Previous
        </button>

        <div className="flex gap-1">
          {session.questions.map((q, i) => {
            const answered = isAnswered(answers.get(q.id), q);
            const current = i === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  current ? 'bg-blue-400 scale-125' : answered ? 'bg-green-400' : 'bg-gray-700'
                }`}
                title={`Q${i + 1}: ${q.title}`}
              />
            );
          })}
        </div>

        <button
          onClick={() => setCurrentIndex((i) => Math.min(session.questions.length - 1, i + 1))}
          disabled={currentIndex === session.questions.length - 1}
          className="text-xs text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
        >
          Next →
        </button>
      </div>

      {submitting && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
          <Spinner size="lg" />
          <p className="text-sm text-gray-300 mt-4">Analyzing your answers...</p>
        </div>
      )}
    </div>
  );
}
