import { useState } from 'react';
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(70, Math.max(30, (x / rect.width) * 100));
    setPanelRatio(ratio);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] overflow-hidden">
      <Navbar questionTitle={question?.title} />

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
    </div>
  );
}
