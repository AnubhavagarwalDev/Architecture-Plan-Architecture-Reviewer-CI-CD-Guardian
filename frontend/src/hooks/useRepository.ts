import { useState, useEffect } from 'react';
import { getRepository } from '../api/repositories';

export const useRepository = (id: string | number) => {
  const [repo, setRepo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchRepository = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRepository(id.toString());
        setRepo(data);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching the repository'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepository();
  }, [id]);

  return { repo, isLoading, error };
};
