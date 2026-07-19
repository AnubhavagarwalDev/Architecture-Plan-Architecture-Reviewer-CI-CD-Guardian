import { useState, useEffect } from 'react';
import { getRepositories } from '../api/repositories';

export const useRepositories = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRepositories();
        setRepos(data);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching repositories'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  return { repos, isLoading, error };
};
