import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboard';
import { getNotifications } from '../api/activity';

export const useDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsData, activitiesData] = await Promise.all([
          getDashboardStats(),
          getNotifications()
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, activities, isLoading, error };
};
