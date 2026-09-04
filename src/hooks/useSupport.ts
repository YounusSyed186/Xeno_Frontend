import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '../api/support.api';
import { SupportTicket, SupportMessage } from '../types/order';
import { toast } from 'sonner';

export const SUPPORT_QUERY_KEY = ['support'];

export function useSupportTickets(params?: { page?: number; per_page?: number }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...SUPPORT_QUERY_KEY, params],
    queryFn: async () => {
      const res: any = await supportApi.getTickets(params);
      const tickets = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : (res?.data?.tickets || []));
      const pagination = res?.meta || res?.data?.meta || res?.pagination;
      return { tickets, pagination };
    },
    staleTime: 2 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data: { subject: string; description: string; order_id?: number; priority?: string }) =>
      supportApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY });
      toast.success('Support ticket created');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create ticket');
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: number; message: string }) =>
      supportApi.reply(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['support', 'ticket'] });
      toast.success('Reply sent');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send reply');
    },
  });

  const closeMutation = useMutation({
    mutationFn: (ticketId: number) => supportApi.close(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['support', 'ticket'] });
      toast.success('Ticket closed');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to close ticket');
    },
  });

  return {
    tickets: query.data?.tickets || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createTicket: createMutation.mutate,
    isCreating: createMutation.isPending,
    reply: replyMutation.mutate,
    isReplying: replyMutation.isPending,
    closeTicket: closeMutation.mutate,
    isClosing: closeMutation.isPending,
    refetch: query.refetch,
  };
}

export function useSupportTicket(ticketId: number) {
  return useQuery({
    queryKey: ['support', 'ticket', ticketId],
    queryFn: async () => {
      const res: any = await supportApi.getTicket(ticketId);
      return res?.data?.ticket || res?.data || null;
    },
    enabled: !!ticketId,
    staleTime: 30 * 1000,
  });
}