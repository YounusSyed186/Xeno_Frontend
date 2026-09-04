import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { Notification } from '../types/order';
import { toast } from 'sonner';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export function useNotifications(params?: { page?: number; per_page?: number }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: async () => {
      const res: any = await notificationsApi.getNotifications(params);
      const notifications = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : (res?.data?.notifications || []));
      const pagination = res?.meta || res?.data?.meta || res?.pagination;
      return { notifications, pagination };
    },
    staleTime: 30 * 1000,
  });

  const markReadMutation = useMutation({
    mutationFn: (notificationId: number) => notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to mark as read');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications marked as read');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to mark all as read');
    },
  });

  return {
    notifications: query.data?.notifications || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    markAsRead: markReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
    markAllAsRead: markAllReadMutation.mutate,
    isMarkingAllRead: markAllReadMutation.isPending,
    refetch: query.refetch,
  };
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res: any = await notificationsApi.getUnreadCount();
      return res?.data?.unread_count ?? (typeof res?.data === 'number' ? res.data : 0);
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}