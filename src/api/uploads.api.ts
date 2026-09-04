import { apiClient } from './client';
import { ApiResponse } from '../types/api';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  resource_type: string;
}

export interface UploadSignatureResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  folder: string;
  upload_url: string;
}

export const uploadsApi = {
  /**
   * Upload file to Cloudinary via server backend
   */
  async uploadFile(
    file: File,
    folder = 'general',
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<CloudinaryUploadResult>> {
    console.log(`[UploadsApi] Starting upload: "${file.name}" (${(file.size / 1024).toFixed(1)} KB, type: ${file.type}) to folder "${folder}"`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const result = await apiClient<CloudinaryUploadResult>('/uploads', {
        method: 'POST',
        body: formData,
      });
      console.log(`[UploadsApi] Upload successful for "${file.name}":`, result);
      return result;
    } catch (error: any) {
      console.error(`[UploadsApi] Upload failed for "${file.name}":`, error);
      throw error;
    }
  },

  /**
   * Direct signed upload to Cloudinary CDN
   */
  async directUploadToCloudinary(
    file: File,
    folder = 'general'
  ): Promise<CloudinaryUploadResult> {
    console.log(`[UploadsApi] Requesting upload signature for "${file.name}" in folder "${folder}"`);
    
    // 1. Get signature from backend
    const signRes = await apiClient<UploadSignatureResponse>('/uploads/sign', {
      method: 'POST',
      body: { folder },
    });

    if (!signRes.data) {
      console.error('[UploadsApi] Failed to obtain upload authorization:', signRes);
      throw new Error(signRes.message || 'Failed to obtain upload authorization.');
    }

    const { signature, timestamp, api_key, cloud_name, folder: fullFolder } = signRes.data;
    console.log(`[UploadsApi] Obtained signature for cloud "${cloud_name}". Posting to Cloudinary CDN...`);

    // 2. Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('folder', fullFolder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('[UploadsApi] Direct Cloudinary CDN error response:', data);
        throw new Error(data.error?.message || 'Direct Cloudinary upload failed.');
      }

      console.log('[UploadsApi] Direct Cloudinary CDN upload success:', data);
      return {
        public_id: data.public_id,
        secure_url: data.secure_url || data.url,
        url: data.url,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
        resource_type: data.resource_type || 'image',
      };
    } catch (error: any) {
      console.error(`[UploadsApi] Direct upload failed for "${file.name}":`, error);
      throw error;
    }
  },

  /**
   * Delete asset from Cloudinary
   */
  async deleteAsset(publicId: string, resourceType = 'image'): Promise<ApiResponse<{ deleted: boolean }>> {
    console.log(`[UploadsApi] Deleting asset "${publicId}" (${resourceType})`);
    try {
      const result = await apiClient<{ deleted: boolean }>('/uploads', {
        method: 'DELETE',
        body: {
          public_id: publicId,
          resource_type: resourceType,
        },
      });
      console.log(`[UploadsApi] Delete result for "${publicId}":`, result);
      return result;
    } catch (error: any) {
      console.error(`[UploadsApi] Delete failed for "${publicId}":`, error);
      throw error;
    }
  },
};
