import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressesApi } from '../api/addresses.api';
import { Address } from '../types/order';
import { toast } from 'sonner';

export const ADDRESSES_QUERY_KEY = ['addresses'];

export function useAddresses() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: async () => {
      const res = await addressesApi.getAddresses();
      const raw = res.data as any;
      if (Array.isArray(raw)) return raw;
      return raw?.addresses || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Address>) => addressesApi.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success('Address added successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add address');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Address> }) => addressesApi.updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success('Address updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update address');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => addressesApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      toast.success('Address deleted');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete address');
    },
  });

  return {
    addresses: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createAddress: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateAddress: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteAddress: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch,
  };
}