import { client } from './client';

export interface RunResult {
  success: boolean;
  output: string;
  executionTimeMs?: number;
}

// Code execution always calls the real backend — it requires an actual compiler.
// VITE_USE_MOCK_DATA only bypasses question/session data, not code execution.
export const codeService = {
  run: async (code: string, language: string): Promise<RunResult> => {
    try {
      return await client.post<RunResult>('/api/code/run', { code, language });
    } catch (err: unknown) {
      // TypeError = fetch failed (backend not running / network error)
      if (err instanceof TypeError) {
        return {
          success: false,
          output: 'Cannot reach backend. Start the API server to enable real code execution.',
        };
      }
      // HttpError = backend returned a non-2xx response
      return {
        success: false,
        output: (err as Error).message ?? 'Unexpected error from code execution service.',
      };
    }
  },
};
