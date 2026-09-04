import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlist.api';
import { toast } from 'sonner';

export const WISHLIST_QUERY_KEY = ['wishlist'];

export function useWishlist() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const res: any = await wishlistApi.getWishlist();
      return res?.data?.wishlist || res?.data || { items: [] };
    },
    staleTime: 2 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, variantId }: { productId: number; variantId?: number }) =>
      wishlistApi.addToWishlist(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success('Added to wishlist');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add to wishlist');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success('Removed from wishlist');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to remove from wishlist');
    },
  });

  const moveToCartMutation = useMutation({
    mutationFn: (productId: number) => wishlistApi.moveToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Moved to cart');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to move to cart');
    },
  });

  return {
    wishlist: query.data,
    items: query.data?.items || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    addToWishlist: addMutation.mutate,
    isAdding: addMutation.isPending,
    removeFromWishlist: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    moveToCart: moveToCartMutation.mutate,
    isMovingToCart: moveToCartMutation.isPending,
    refetch: query.refetch,
  };
}