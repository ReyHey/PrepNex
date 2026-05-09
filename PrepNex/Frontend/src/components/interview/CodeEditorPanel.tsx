import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { Question } from '../../types';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

interface CodeEditorPanelProps {
  question: Question;
}

type OutputStatus = 'idle' | 'running' | 'success' | 'error';

const categoryToLanguage: Record<string, string> = {
  'C#': 'csharp',
  '.NET': 'csharp',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  SQL: 'sql',
  Python: 'python',
};

function getLanguage(category: string): string {
  return categoryToLanguage[category] ?? 'plaintext';
}

export function CodeEditorPanel({ question }: CodeEditorPanelProps) {
  const [code, setCode] = useState(question.starterCode ?? '');
  const [status, setStatus] = useState<OutputStatus>('idle');
  const [output, setOutput] = useState('');

  const handleRunCode = () => {
    setStatus('running');
    setOutput('');
    // Mock execution — replace with real API call when backend supports it
    setTimeout(() => {
      const lines = code.trim().split('\n').length;
      const hasSolution = code.length > (question.starterCode?.length ?? 0) + 10;
      if (hasSolution) {
        setStatus('success');
        setOutput(
          `✓ Compiled successfully\n✓ Test cases passed: 2/2\n\nExecution time: ${Math.floor(Math.random() * 80 + 20)}ms\nMemory: ${Math.floor(Math.random() * 4 + 2)}MB\n\nLines of code: ${lines}`,
        );
      } else {
        setStatus('error');
        setOutput('✗ No solution found. Add your implementation and try again.');
      }
    }, 1200);
  };

  const handleReset = () => {
    setCode(question.starterCode ?? '');
    setStatus('idle');
    setOutput('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {getLanguage(question.category)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunCode}
            loading={status === 'running'}
            disabled={status === 'running'}
          >
            ▶ Run Code
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getLanguage(question.category)}
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

      <div
        className={`border-t border-gray-800 transition-all duration-200 ${
          status !== 'idle' ? 'h-44' : 'h-10'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800">
          <span className="text-xs font-medium text-gray-400">Output</span>
          {status === 'running' && <Spinner size="sm" />}
          {status === 'success' && <span className="text-xs text-green-400">Accepted</span>}
          {status === 'error' && <span className="text-xs text-red-400">Failed</span>}
        </div>
        {status !== 'idle' && status !== 'running' && (
          <pre
            className={`px-4 py-2 text-xs font-mono overflow-auto h-28 ${
              status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {output}
          </pre>
        )}
        {status === 'running' && (
          <div className="flex items-center justify-center h-28">
            <span className="text-xs text-gray-500">Running your code...</span>
          </div>
        )}
      </div>
    </div>
  );
}
