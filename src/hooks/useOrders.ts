import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { Order } from '../types/order';
import { toast } from 'sonner';

export const ORDERS_QUERY_KEY = ['orders'];

export function useOrders(params?: { page?: number; per_page?: number }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params],
    queryFn: async () => {
      const res: any = await ordersApi.getOrders(params);
      const orders = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : (res?.data?.orders || []));
      const pagination = res?.meta || res?.data?.meta || res?.pagination;
      return { orders, pagination };
    },
    staleTime: 2 * 60 * 1000,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: number) => ordersApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success('Order cancelled');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to cancel order');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (orderId: number) => ordersApi.reorder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success('Items added to cart');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to reorder');
    },
  });

  return {
    orders: query.data?.orders || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    cancelOrder: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
    reorder: reorderMutation.mutate,
    isReordering: reorderMutation.isPending,
    refetch: query.refetch,
  };
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res: any = await ordersApi.getOrder(orderId);
      return res?.data?.order || res?.data || null;
    },
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => ordersApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success('Order cancelled');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to cancel order');
    },
  });
}