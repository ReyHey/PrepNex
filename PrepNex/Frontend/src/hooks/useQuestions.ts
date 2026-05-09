import { useEffect, useState } from 'react';
import { questionsService } from '../api/questionsService';
import type { Question } from '../types';

interface UseQuestionsResult {
  questions: Question[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    questionsService
      .getAll()
      .then((data) => {
        if (!cancelled) setQuestions(data);
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
  }, [tick]);

  return { questions, loading, error, refetch: () => setTick((t) => t + 1) };
}
