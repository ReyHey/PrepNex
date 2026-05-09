import { useState } from 'react';
import type { Question } from '../../types';
import { Button } from '../ui/Button';

interface ConceptualPanelProps {
  question: Question;
}

type SubmitStatus = 'idle' | 'submitted';

export function ConceptualPanel({ question }: ConceptualPanelProps) {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [showSuggested, setShowSuggested] = useState(false);

  const handleSubmit = () => {
    if (answer.trim().length < 10) return;
    setStatus('submitted');
  };

  const handleReset = () => {
    setAnswer('');
    setStatus('idle');
    setShowSuggested(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">text answer</span>
        <div className="flex items-center gap-2">
          {status === 'submitted' && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Try again
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={answer.trim().length < 10 || status === 'submitted'}
          >
            Submit Answer
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={status === 'submitted'}
          placeholder="Write your answer here. Explain your thinking clearly — as you would in a real interview..."
          className="flex-1 resize-none bg-[#1e1e1e] text-gray-200 text-sm font-mono p-5
            focus:outline-none placeholder-gray-600 disabled:opacity-60 leading-relaxed"
        />
      </div>

      {status === 'submitted' && (
        <div className="border-t border-gray-800 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-gray-200">Answer submitted</span>
            </div>
            {question.suggestedAnswer && (
              <button
                onClick={() => setShowSuggested((v) => !v)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                {showSuggested ? 'Hide' : 'Show'} suggested answer
              </button>
            )}
          </div>

          {showSuggested && question.suggestedAnswer && (
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Suggested Answer</p>
              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {question.suggestedAnswer}
              </div>
            </div>
          )}

          {!showSuggested && (
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">Your answer</p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
