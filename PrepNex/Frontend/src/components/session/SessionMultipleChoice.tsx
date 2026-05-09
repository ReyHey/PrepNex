import type { Question, Answer, MultipleChoiceOption } from '../../types';

interface Props {
  question: Question;
  initialAnswer?: Answer;
  onAnswerChange: (answer: Answer) => void;
}

function optionLabel(i: number) {
  return String.fromCharCode(65 + i);
}

export function SessionMultipleChoice({ question, initialAnswer, onAnswerChange }: Props) {
  const options: MultipleChoiceOption[] = question.options ?? [];
  const selected = initialAnswer?.selectedOptionId ?? null;

  const handleSelect = (optionId: number) => {
    onAnswerChange({ questionId: question.id, selectedOptionId: optionId });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-800 shrink-0">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Pick one answer</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {options.map((option, i) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all text-sm flex items-start gap-3 cursor-pointer
              ${
                selected === option.id
                  ? 'bg-blue-600/20 border-blue-500 text-white'
                  : 'bg-gray-800/40 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800/70'
              }`}
          >
            <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-semibold">
              {optionLabel(i)}
            </span>
            <span className="leading-snug pt-0.5">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
