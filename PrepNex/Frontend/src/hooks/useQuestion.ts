import { useEffect, useState } from 'react';
import { questionsService } from '../api/questionsService';
import type { Question } from '../types';

interface UseQuestionResult {
  question: Question | null;
  loading: boolean;
  error: string | null;
}

export function useQuestion(id: number | null): UseQuestionResult {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setQuestion(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    questionsService
      .getById(id)
      .then((data) => {
        if (!cancelled) setQuestion(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { question, loading, error };
}
