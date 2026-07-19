import { useState, useEffect, useCallback } from 'react';
import { getPolicies, updatePolicies } from '../api/policies';

export const usePolicies = () => {
  const [policies, setPolicies] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPolicies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching policies'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const savePolicy = async (data: any) => {
    try {
      const updatedData = await updatePolicies(data);
      setPolicies(updatedData);
      return updatedData;
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error('An error occurred while saving policies');
      setError(e);
      throw e;
    }
  };

  return { policies, isLoading, error, savePolicy };
};
