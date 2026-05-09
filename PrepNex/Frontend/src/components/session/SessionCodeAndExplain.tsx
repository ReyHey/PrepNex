import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { Question, Answer } from '../../types';
import { Button } from '../ui/Button';
import { CodeOutputPanel, type RunStatus } from '../interview/CodeOutputPanel';
import { codeService } from '../../api/codeService';

interface Props {
  question: Question;
  initialAnswer?: Answer;
  onAnswerChange: (answer: Answer) => void;
}

export function SessionCodeAndExplain({ question, initialAnswer, onAnswerChange }: Props) {
  const [code, setCode] = useState(initialAnswer?.code ?? question.starterCode ?? '');
  const [explanation, setExplanation] = useState(initialAnswer?.explanation ?? '');
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');
  const [runOutput, setRunOutput] = useState('');

  const emit = (nextCode: string, nextExplanation: string) => {
    onAnswerChange({ questionId: question.id, code: nextCode, explanation: nextExplanation });
  };

  const handleCodeChange = (value: string | undefined) => {
    const next = value ?? '';
    setCode(next);
    emit(next, explanation);
  };

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExplanation(e.target.value);
    emit(code, e.target.value);
  };

  const handleRun = async () => {
    setRunStatus('running');
    setRunOutput('');
    const result = await codeService.run(code, question.language ?? 'plaintext');
    const offline = result.output.startsWith('Cannot reach');
    setRunStatus(result.success ? 'success' : offline ? 'unreachable' : 'error');
    setRunOutput(result.output);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {question.language && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {question.language}
            </span>
          )}
          <span className="text-xs text-gray-600">+ explanation</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRun}
          loading={runStatus === 'running'}
          disabled={runStatus === 'running' || code.trim().length === 0}
        >
          ▶ Run
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden border-b border-gray-800">
        <Editor
          height="100%"
          language={question.language ?? 'plaintext'}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 4,
            automaticLayout: true,
          }}
        />
      </div>

      <CodeOutputPanel status={runStatus} output={runOutput} />

      <div className="h-40 flex flex-col shrink-0 border-t border-gray-800">
        <div className="px-4 py-2 border-b border-gray-800">
          <span className="text-xs text-gray-500">Your explanation</span>
        </div>
        <textarea
          value={explanation}
          onChange={handleExplanationChange}
          placeholder="Explain your approach, trade-offs, and any assumptions you made..."
          className="flex-1 resize-none bg-[#1e1e1e] text-gray-200 text-sm font-mono px-4 py-3
            focus:outline-none placeholder-gray-600 leading-relaxed"
        />
      </div>
    </div>
  );
}
