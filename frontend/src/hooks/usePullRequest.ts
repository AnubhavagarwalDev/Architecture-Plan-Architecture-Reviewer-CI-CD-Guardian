import { useState, useEffect } from 'react';
import { getPullRequest } from '../api/pr';

export const usePullRequest = (id: string | number) => {
  const [pullRequest, setPullRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPullRequest = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPullRequest(id.toString());
        setPullRequest(data);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching the pull request'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPullRequest();
  }, [id]);

  return { pullRequest, isLoading, error };
};
