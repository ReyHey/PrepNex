import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { Question } from '../../types';
import { Button } from '../ui/Button';
import { AiFeedbackDrawer } from './AiFeedbackDrawer';
import { CodeOutputPanel, type RunStatus } from './CodeOutputPanel';
import { questionsService } from '../../api/questionsService';
import { codeService } from '../../api/codeService';

interface CodeAndExplainPanelProps {
  question: Question;
}

export function CodeAndExplainPanel({ question }: CodeAndExplainPanelProps) {
  const [code, setCode] = useState(question.starterCode ?? '');
  const [explanation, setExplanation] = useState('');
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');
  const [runOutput, setRunOutput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [score, setScore] = useState<number | undefined>();
  const [feedback, setFeedback] = useState<string | undefined>();

  const canSubmit = code.trim().length > 0 || explanation.trim().length > 0;

  const handleRun = async () => {
    setRunStatus('running');
    setRunOutput('');
    const result = await codeService.run(code, question.language ?? 'plaintext');
    const offline = result.output.startsWith('Cannot reach');
    setRunStatus(result.success ? 'success' : offline ? 'unreachable' : 'error');
    setRunOutput(result.output);
  };

  const handleSubmit = async () => {
    setDrawerOpen(true);
    setReviewing(true);
    setScore(undefined);
    setFeedback(undefined);
    try {
      const result = await questionsService.reviewAnswer(question.id, { code, explanation });
      setScore(result.score);
      setFeedback(result.feedback);
    } finally {
      setReviewing(false);
    }
  };

  const handleReset = () => {
    setCode(question.starterCode ?? '');
    setExplanation('');
    setRunStatus('idle');
    setRunOutput('');
    setDrawerOpen(false);
    setScore(undefined);
    setFeedback(undefined);
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          {question.language && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {question.language}
            </span>
          )}
          <span className="text-xs text-gray-600">+ explanation</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRun}
            loading={runStatus === 'running'}
            disabled={runStatus === 'running' || code.trim().length === 0}
          >
            ▶ Run
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!canSubmit}>
            Submit for Review
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden border-b border-gray-800">
          <Editor
            height="100%"
            language={question.language ?? 'plaintext'}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? '')}
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

        <div className="h-40 flex flex-col shrink-0">
          <div className="px-4 py-2 border-b border-gray-800">
            <span className="text-xs text-gray-500">Your explanation</span>
          </div>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain your approach, trade-offs, and any assumptions you made..."
            className="flex-1 resize-none bg-[#1e1e1e] text-gray-200 text-sm font-mono px-4 py-3
              focus:outline-none placeholder-gray-600 leading-relaxed"
          />
        </div>
      </div>

      <CodeOutputPanel status={runStatus} output={runOutput} />

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
