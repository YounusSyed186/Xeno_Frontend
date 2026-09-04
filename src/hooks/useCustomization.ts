import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customizationApi } from '../api/customization.api';
import { DesignUpload, CustomizationOption, PrintingMethod } from '../types/product';
import { toast } from 'sonner';

export const CUSTOMIZATION_QUERY_KEY = ['customization'];

export function useCustomizationOptions() {
  return useQuery({
    queryKey: [CUSTOMIZATION_QUERY_KEY, 'options'],
    queryFn: async () => {
      const res: any = await customizationApi.getOptions();
      return res?.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useMyArtworks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [CUSTOMIZATION_QUERY_KEY, 'artworks'],
    queryFn: async () => {
      const res: any = await customizationApi.getMyArtworks();
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.uploads) ? res.data.uploads : (Array.isArray(res) ? res : []));
      return list;
    },
    staleTime: 2 * 60 * 1000,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, name }: { file: File; name?: string }) => customizationApi.uploadArtwork(file, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMIZATION_QUERY_KEY, 'artworks'] });
      toast.success('Artwork uploaded');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload artwork');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uploadId: number) => customizationApi.deleteArtwork(uploadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMIZATION_QUERY_KEY, 'artworks'] });
      toast.success('Artwork deleted');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete artwork');
    },
  });

  return {
    artworks: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    uploadArtwork: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    deleteArtwork: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch,
  };
}

export function usePreviewPrice() {
  return useMutation({
    mutationFn: (data: { product_id: number; variant_id?: number; printing_method_id?: number; quantity: number }) =>
      customizationApi.previewPrice(data),
  });
}