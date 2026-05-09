import { useState } from 'react';
import type { Question, Answer } from '../../types';

interface Props {
  question: Question;
  initialAnswer?: Answer;
  onAnswerChange: (answer: Answer) => void;
}

export function SessionExplainEditor({ question, initialAnswer, onAnswerChange }: Props) {
  const [text, setText] = useState(initialAnswer?.explanation ?? '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onAnswerChange({ questionId: question.id, explanation: e.target.value });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-800 shrink-0">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">text answer</span>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Write your answer here. Explain your thinking clearly — as you would in a real interview..."
        className="flex-1 resize-none bg-[#1e1e1e] text-gray-200 text-sm font-mono p-5
          focus:outline-none placeholder-gray-600 leading-relaxed"
      />
    </div>
  );
}
