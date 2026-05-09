import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { Question } from '../../types';
import { Button } from '../ui/Button';
import { AiFeedbackDrawer } from './AiFeedbackDrawer';
import { CodeOutputPanel, type RunStatus } from './CodeOutputPanel';
import { questionsService } from '../../api/questionsService';
import { codeService } from '../../api/codeService';

interface CodeEditorPanelProps {
  question: Question;
}

export function CodeEditorPanel({ question }: CodeEditorPanelProps) {
  const [code, setCode] = useState(question.starterCode ?? '');
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');
  const [runOutput, setRunOutput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [score, setScore] = useState<number | undefined>();
  const [feedback, setFeedback] = useState<string | undefined>();

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
      const result = await questionsService.reviewAnswer(question.id, { code });
      setScore(result.score);
      setFeedback(result.feedback);
    } finally {
      setReviewing(false);
    }
  };

  const handleReset = () => {
    setCode(question.starterCode ?? '');
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
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={code.trim().length === 0}
          >
            Submit for Review
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
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
