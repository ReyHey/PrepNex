import { useState } from 'react';
import type { Question } from '../../types';
import { Button } from '../ui/Button';
import { AiFeedbackDrawer } from './AiFeedbackDrawer';
import { questionsService } from '../../api/questionsService';

interface ConceptualPanelProps {
  question: Question;
}

export function ConceptualPanel({ question }: ConceptualPanelProps) {
  const [answer, setAnswer] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [score, setScore] = useState<number | undefined>();
  const [feedback, setFeedback] = useState<string | undefined>();

  const canSubmit = answer.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setDrawerOpen(true);
    setReviewing(true);
    setScore(undefined);
    setFeedback(undefined);
    try {
      const result = await questionsService.reviewAnswer(question.id, { explanation: answer });
      setScore(result.score);
      setFeedback(result.feedback);
    } finally {
      setReviewing(false);
    }
  };

  const handleReset = () => {
    setAnswer('');
    setDrawerOpen(false);
    setScore(undefined);
    setFeedback(undefined);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 shrink-0">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">text answer</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!canSubmit}>
            Submit for Review
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here. Explain your thinking clearly — as you would in a real interview..."
          className="w-full h-full resize-none bg-[#1e1e1e] text-gray-200 text-sm font-mono p-5
            focus:outline-none placeholder-gray-600 leading-relaxed"
        />
      </div>

      <AiFeedbackDrawer
        open={drawerOpen}
        loading={reviewing}
        score={score}
        feedback={feedback}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
