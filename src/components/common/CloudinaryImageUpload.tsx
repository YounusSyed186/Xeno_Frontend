import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadsApi, CloudinaryUploadResult } from '@/api/uploads.api';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { toast } from 'sonner';

export interface UploadedMediaItem {
  url: string;
  public_id?: string | undefined;
  cloudinary_public_id?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  format?: string | undefined;
  bytes?: number | undefined;
  alt_text?: string | undefined;
  is_primary?: boolean | undefined;
}

interface CloudinaryImageUploadProps {
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
  value?: string | string[] | UploadedMediaItem | UploadedMediaItem[];
  onChange?: (value: any) => void;
  className?: string;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  disabled?: boolean;
}

export const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  folder = 'products',
  multiple = false,
  maxFiles = 6,
  maxSizeMb = 10,
  value,
  onChange,
  className = '',
  label = 'Upload Image',
  helperText = 'JPG, PNG, WEBP or AVIF up to 10MB',
  aspectRatio = 'auto',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize current items
  const items: UploadedMediaItem[] = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? { url: v } : v));
    }
    return [typeof value === 'string' ? { url: value } : value];
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    console.log('[CloudinaryImageUpload] Files selected:', files.map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      type: f.type,
    })));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!multiple && files.length > 1) {
      console.warn('[CloudinaryImageUpload] Multiple files selected for single-image upload.');
      toast.error('Only single image upload is allowed here.');
      return;
    }

    if (multiple && items.length + files.length > maxFiles) {
      console.warn(`[CloudinaryImageUpload] Exceeded max file count: current ${items.length}, incoming ${files.length}, max ${maxFiles}`);
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    // Validate size and mime types
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
    for (const file of files) {
      if (!validMimes.includes(file.type)) {
        console.warn(`[CloudinaryImageUpload] Invalid MIME type: ${file.type} for file ${file.name}`);
        toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, WEBP, AVIF, SVG allowed.`);
        return;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        console.warn(`[CloudinaryImageUpload] File too large: ${file.size} bytes vs limit ${maxSizeMb * 1024 * 1024} bytes`);
        toast.error(`File too large: ${file.name}. Maximum size is ${maxSizeMb}MB.`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    const newItems: UploadedMediaItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        console.log(`[CloudinaryImageUpload] Uploading file ${i + 1}/${files.length}: ${file.name} to folder "${folder}"...`);
        const res = await uploadsApi.uploadFile(file, folder);

        if (res.data) {
          console.log(`[CloudinaryImageUpload] File ${i + 1}/${files.length} uploaded successfully:`, res.data);
          newItems.push({
            url: res.data.secure_url || res.data.url,
            public_id: res.data.public_id,
            cloudinary_public_id: res.data.public_id,
            width: res.data.width,
            height: res.data.height,
            format: res.data.format,
            bytes: res.data.bytes,
            is_primary: items.length === 0 && newItems.length === 0,
          });
        }
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      toast.success(files.length > 1 ? 'Images uploaded successfully!' : 'Image uploaded successfully!');

      if (multiple) {
        const combined = [...items, ...newItems];
        console.log('[CloudinaryImageUpload] Updated gallery items:', combined);
        onChange?.(combined);
      } else {
        const singleUrl = newItems[0]?.url || '';
        console.log('[CloudinaryImageUpload] Updated single image URL:', singleUrl);
        onChange?.(singleUrl);
      }
    } catch (err: any) {
      console.error('[CloudinaryImageUpload] Upload error caught in component:', err);
      toast.error(err.message || 'Failed to upload image to Cloudinary.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleRemove = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    const removedItem = items[indexToRemove];
    console.log('[CloudinaryImageUpload] Removing item at index', indexToRemove, removedItem);
    const updated = items.filter((_, idx) => idx !== indexToRemove);

    // Optionally cleanup on server in background
    if (removedItem?.public_id || removedItem?.cloudinary_public_id) {
      const pId = removedItem.public_id || removedItem.cloudinary_public_id;
      if (pId) {
        console.log(`[CloudinaryImageUpload] Requesting deletion for public_id: ${pId}`);
        uploadsApi.deleteAsset(pId).catch((err) => {
          console.warn('[CloudinaryImageUpload] Asset deletion error:', err);
        });
      }
    }

    if (multiple) {
      onChange?.(updated);
    } else {
      onChange?.('');
    }
  };

  const setAsPrimary = (indexToPrimary: number) => {
    if (!multiple || disabled) return;
    const updated = items.map((item, idx) => ({
      ...item,
      is_primary: idx === indexToPrimary,
    }));
    onChange?.(updated);
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'banner'
      ? 'aspect-[3/1]'
      : 'min-h-32';

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="block text-xs font-semibold text-muted-foreground">{label}</label>}

      {/* Grid of uploaded items */}
      {items.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'}`}>
          {items.map((item, index) => (
            <div
              key={item.public_id || item.url || index}
              className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-surface/80 ${aspectClass} transition-all hover:border-primary/50`}
            >
              <img
                src={getCloudinaryUrl(item.url, { width: 400, height: 400, crop: 'fill' })}
                alt={item.alt_text || 'Uploaded asset'}
                className="size-full object-cover"
                loading="lazy"
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-background/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {multiple && (
                  <button
                    type="button"
                    onClick={() => setAsPrimary(index)}
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-colors ${
                      item.is_primary
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface/80 text-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {item.is_primary ? 'Primary' : 'Set Primary'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => handleRemove(index, e)}
                  disabled={disabled}
                  className="rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive transition-colors"
                  title="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>

              {item.is_primary && (
                <div className="absolute top-2 left-2 rounded-md bg-primary/90 px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-xs">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button area */}
      {(!items.length || multiple) && (items.length < maxFiles || !multiple) && (
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 bg-surface/40 p-6 text-center transition-all ${
            disabled || isUploading
              ? 'opacity-60 cursor-not-allowed'
              : 'cursor-pointer hover:border-primary/60 hover:bg-surface/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            multiple={multiple}
            disabled={disabled || isUploading}
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-7 animate-spin text-primary" />
              <div className="text-xs font-semibold text-foreground">
                Uploading to Cloudinary... {uploadProgress !== null ? `${uploadProgress}%` : ''}
              </div>
              <div className="text-[11px] text-muted-foreground">Optimizing and securing asset</div>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Upload className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground hover:underline">
                  Click to upload
                </span>
                <span className="text-xs text-muted-foreground"> or drag and drop</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{helperText}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
