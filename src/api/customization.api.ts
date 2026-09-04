import { apiClient } from './client';
import { CustomizationOption, PrintingMethod, DesignUpload } from '../types/product';
import { ApiResponse } from '../types/api';

export const customizationApi = {
  async getOptions(): Promise<ApiResponse<{ options: CustomizationOption[]; printing_methods: PrintingMethod[] }>> {
    return apiClient<{ options: CustomizationOption[]; printing_methods: PrintingMethod[] }>('/customizations/options');
  },

  async uploadArtwork(file: File, name?: string): Promise<ApiResponse<{ upload: DesignUpload }>> {
    const formData = new FormData();
    formData.append('artwork', file);
    if (name) formData.append('name', name);

    return apiClient<{ upload: DesignUpload }>('/customizations/artworks', {
      method: 'POST',
      body: formData,
    });
  },

  async getMyArtworks(): Promise<ApiResponse<{ uploads: DesignUpload[] }>> {
    return apiClient<{ uploads: DesignUpload[] }>('/customizations/artworks');
  },

  async deleteArtwork(uploadId: number): Promise<ApiResponse<object>> {
    return apiClient<object>(`/customizations/artworks/${uploadId}`, {
      method: 'DELETE',
    });
  },

  async previewPrice(data: {
    product_id: number;
    variant_id?: number;
    printing_method_id?: number;
    quantity: number;
  }): Promise<ApiResponse<{ unit_price: number; quantity: number; line_total: number }>> {
    return apiClient<{ unit_price: number; quantity: number; line_total: number }>('/customizations/preview', {
      method: 'POST',
      body: data,
    });
  },
};