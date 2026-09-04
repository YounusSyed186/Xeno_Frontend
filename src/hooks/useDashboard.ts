import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const res: any = await apiClient('/dashboard/summary');
      return res?.data || {};
    },
    staleTime: 2 * 60 * 1000,
  });
}