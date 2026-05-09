import { useState } from 'react';
import type { Question, MultipleChoiceOption } from '../../types';
import { Button } from '../ui/Button';
import { questionsService } from '../../api/questionsService';

interface MultipleChoicePanelProps {
  question: Question;
}

type SubmitState = 'idle' | 'submitting' | 'correct' | 'incorrect';

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export function MultipleChoicePanel({ question }: MultipleChoicePanelProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<SubmitState>('idle');

  const options: MultipleChoiceOption[] = question.options ?? [];
  const done = state === 'correct' || state === 'incorrect';

  const handleSubmit = async () => {
    if (selected === null) return;
    setState('submitting');
    try {
      const result = await questionsService.submitMultipleChoice(question.id, selected);
      setState(result.correct ? 'correct' : 'incorrect');
    } catch {
      setState('idle');
    }
  };

  const handleReset = () => {
    setSelected(null);
    setState('idle');
  };

  function optionStyle(option: MultipleChoiceOption): string {
    const base =
      'w-full text-left px-4 py-3.5 rounded-lg border transition-all text-sm flex items-start gap-3';

    if (!done) {
      return `${base} cursor-pointer ${
        selected === option.id
          ? 'bg-blue-600/20 border-blue-500 text-white'
          : 'bg-gray-800/40 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800/70'
      }`;
    }

    const isSelected = selected === option.id;
    const isCorrect = option.id === question.correctOptionId;

    if (isCorrect) return `${base} bg-green-500/10 border-green-500 text-green-300`;
    if (isSelected && !isCorrect) return `${base} bg-red-500/10 border-red-500 text-red-300`;
    return `${base} bg-gray-800/20 border-gray-800 text-gray-500`;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 shrink-0">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          Pick one answer
        </span>
        <div className="flex items-center gap-2">
          {done && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Try again
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={selected === null || done}
            loading={state === 'submitting'}
          >
            Submit
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {options.map((option, i) => (
          <button
            key={option.id}
            className={optionStyle(option)}
            onClick={() => !done && setSelected(option.id)}
            disabled={done}
          >
            <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-semibold">
              {optionLabel(i)}
            </span>
            <span className="leading-snug pt-0.5">{option.text}</span>
          </button>
        ))}
      </div>

      {done && (
        <div
          className={`px-5 py-3.5 border-t border-gray-800 shrink-0 flex items-center gap-2 ${
            state === 'correct' ? 'bg-green-500/5' : 'bg-red-500/5'
          }`}
        >
          <span className={`text-sm font-medium ${state === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
            {state === 'correct' ? '✓ Correct!' : '✗ Incorrect — the correct answer is highlighted above.'}
          </span>
        </div>
      )}
    </div>
  );
}
