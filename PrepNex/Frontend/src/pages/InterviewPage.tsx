import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useQuestion } from '../hooks/useQuestion';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { QuestionPanel } from '../components/interview/QuestionPanel';
import { CodeEditorPanel } from '../components/interview/CodeEditorPanel';
import { CodeAndExplainPanel } from '../components/interview/CodeAndExplainPanel';
import { ConceptualPanel } from '../components/interview/ConceptualPanel';
import { MultipleChoicePanel } from '../components/interview/MultipleChoicePanel';
import { Spinner } from '../components/ui/Spinner';
import type { Question } from '../types';

function AnswerPanel({ question }: { question: Question }) {
  switch (question.category) {
    case 'code-only':
      return <CodeEditorPanel question={question} />;
    case 'code-and-explain':
      return <CodeAndExplainPanel question={question} />;
    case 'explain':
      return <ConceptualPanel question={question} />;
    case 'multiple-choice':
      return <MultipleChoicePanel question={question} />;
  }
}

export function InterviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionId = id ? parseInt(id, 10) : null;

  const { questions, loading: listLoading } = useQuestions();
  const { question, loading: questionLoading, error } = useQuestion(questionId);

  const [panelRatio, setPanelRatio] = useState(50);
  const [dragging, setDragging] = useState(false);

  // Answer tracking
  const [sessionId, setSessionId] = useState<string>('');
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [canRequestFeedback, setCanRequestFeedback] = useState(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedbackResponse | null>(null);

  // Initialize or restore session ID
  useEffect(() => {
    let storedSessionId = localStorage.getItem('prepnex_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('prepnex_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load answer count
    answersService.getAnswerCount(storedSessionId).then((data) => {
      setTotalAnswers(data.totalAnswers);
      setCanRequestFeedback(data.canRequestFeedback);
      setShowFeedbackButton(data.canRequestFeedback);
    }).catch(() => {
      // Session doesn't exist yet, that's fine
    });
  }, []);

  const handleAnswerSubmitted = (newSessionId: string, total: number, canRequest: boolean) => {
    setSessionId(newSessionId);
    setTotalAnswers(total);
    setCanRequestFeedback(canRequest);
    setShowFeedbackButton(canRequest);
    localStorage.setItem('prepnex_session_id', newSessionId);
  };

  const handleRequestFeedback = async () => {
    if (!canRequestFeedback || !sessionId) return;

    setLoadingFeedback(true);
    try {
      const feedbackData = await answersService.getFeedback(sessionId);
      setFeedback(feedbackData);
    } catch (err) {
      console.error('Failed to get feedback:', err);
      alert('Failed to get AI feedback. Make sure you have answered at least 5 questions.');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleCloseFeedback = () => {
    setFeedback(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(70, Math.max(30, (x / rect.width) * 100));
    setPanelRatio(ratio);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] overflow-hidden">
      <Navbar questionTitle={question?.title}>
        {showFeedbackButton && (
          <button
            onClick={handleRequestFeedback}
            disabled={loadingFeedback}
            className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg
              hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2"
          >
            {loadingFeedback ? (
              <>
                <span className="animate-spin">⟳</span>
                Getting AI Feedback...
              </>
            ) : (
              <>
                <span>✨</span>
                Get AI Feedback ({totalAnswers} answers)
              </>
            )}
          </button>
        )}
      </Navbar>

      {totalAnswers > 0 && totalAnswers < 5 && (
        <div className="px-6 py-2 bg-blue-900/20 border-b border-blue-800 text-blue-300 text-sm text-center">
          Answer {5 - totalAnswers} more question{5 - totalAnswers !== 1 ? 's' : ''} to unlock AI feedback ({totalAnswers}/5)
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          questions={questions}
          loading={listLoading}
          selectedId={questionId}
          onSelect={(id) => navigate(`/questions/${id}`)}
        />

        {questionLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-red-400 text-sm">Failed to load: {error}</p>
          </div>
        )}

        {!questionLoading && question && (
          <div
            className="flex-1 flex overflow-hidden select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
          >
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

            <div className="flex-1 bg-[#1e1e1e] overflow-hidden relative">
              <AnswerPanel key={question.id} question={question} />
            </div>
          </div>
        )}

        {!questionLoading && !error && !question && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-4">⌬</p>
              <p className="text-gray-400 text-sm">Select a question from the sidebar to begin.</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Feedback Modal */}
      {feedback && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>✨</span>
                AI Feedback Report
              </h2>
              <button
                onClick={handleCloseFeedback}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Overall Feedback */}
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-300 mb-2">Overall Assessment</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feedback.overallFeedback}</p>
              </div>

              {/* Individual Question Feedback */}
              {feedback.questionFeedbacks.map((qf, idx) => (
                <div key={idx} className="bg-gray-800/40 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-semibold text-white">
                      Question {idx + 1}: {qf.questionTitle}
                    </h3>
                    {qf.score && (
                      <span className={`text-lg font-bold ${
                        qf.score >= 8 ? 'text-green-400' :
                        qf.score >= 6 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        {qf.score}/10
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">{qf.feedback}</p>

                  {qf.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-400 mb-1">✓ Strengths:</p>
                      <ul className="space-y-1">
                        {qf.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-gray-400 flex gap-2">
                            <span className="text-green-600">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {qf.improvements.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-orange-400 mb-1">→ Areas for Improvement:</p>
                      <ul className="space-y-1">
                        {qf.improvements.map((imp, i) => (
                          <li key={i} className="text-xs text-gray-400 flex gap-2">
                            <span className="text-orange-600">•</span>
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={handleCloseFeedback}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
