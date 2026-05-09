import { Spinner } from '../ui/Spinner';

export type RunStatus = 'idle' | 'running' | 'success' | 'error' | 'unreachable';

interface CodeOutputPanelProps {
  status: RunStatus;
  output: string;
}

export function CodeOutputPanel({ status, output }: CodeOutputPanelProps) {
  if (status === 'idle') return null;

  return (
    <div className="shrink-0 border-t border-gray-800 bg-[#141414]">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800">
        <span className="text-xs font-medium text-gray-400">Output</span>
        {status === 'running' && <Spinner size="sm" />}
        {status === 'success' && (
          <span className="text-xs text-green-400 font-medium">✓ Passed</span>
        )}
        {status === 'error' && (
          <span className="text-xs text-red-400 font-medium">✗ Compile error</span>
        )}
        {status === 'unreachable' && (
          <span className="text-xs text-yellow-500 font-medium">⚠ Backend offline</span>
        )}
      </div>
      <div className="h-28 overflow-auto px-4 py-2">
        {status === 'running' ? (
          <div className="flex items-center h-full">
            <span className="text-xs text-gray-500">Compiling and running...</span>
          </div>
        ) : (
          <pre
            className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${
              status === 'success'
                ? 'text-green-400'
                : status === 'unreachable'
                ? 'text-yellow-500'
                : 'text-red-400'
            }`}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
