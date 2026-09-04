import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, AddToCartPayload } from '../api/cart.api';
import { Cart, CartItem } from '../types/order';
import { toast } from 'sonner';

export const CART_QUERY_KEY = ['cart'];

export function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const res = await cartApi.getCart();
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  const addItemMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => cartApi.addItem(payload),
    onSuccess: (res) => {
      queryClient.setQueryData(CART_QUERY_KEY, res.data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Item added to cart!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add item to cart');
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => cartApi.updateItem(id, quantity),
    onSuccess: (res) => {
      queryClient.setQueryData(CART_QUERY_KEY, res.data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update cart');
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: number) => cartApi.removeItem(id),
    onSuccess: (res) => {
      queryClient.setQueryData(CART_QUERY_KEY, res.data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Item removed from cart');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to remove item');
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Coupon applied!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Invalid coupon code');
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: () => cartApi.removeCoupon(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Coupon removed');
    },
  });

  const mergeGuestCartMutation = useMutation({
    mutationFn: () => cartApi.mergeGuestCart(),
    onSuccess: (res) => {
      queryClient.setQueryData(CART_QUERY_KEY, res.data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Cart merged successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to merge cart');
    },
  });

  const data = cartQuery.data as any;
  const cart = data?.cart;
  const breakdown = data?.breakdown;
  const items = cart?.items || [];
  const itemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  return {
    cart,
    breakdown,
    items,
    itemCount,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
    addItem: addItemMutation.mutate,
    isAdding: addItemMutation.isPending,
    updateItem: updateItemMutation.mutate,
    isUpdating: updateItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemoving: removeItemMutation.isPending,
    applyCoupon: applyCouponMutation.mutate,
    isApplyingCoupon: applyCouponMutation.isPending,
    removeCoupon: removeCouponMutation.mutate,
    mergeGuestCart: mergeGuestCartMutation.mutate,
    isMerging: mergeGuestCartMutation.isPending,
    refreshCart: cartQuery.refetch,
  };
}