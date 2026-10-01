import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link, Check, Plus } from 'lucide-react';
import { uploadsApi } from '@/api/uploads.api';
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
  label = 'Product Images Gallery',
  helperText = 'Upload photos or specify image path/URL',
  aspectRatio = 'auto',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize current items
  const items: UploadedMediaItem[] = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? { url: v } : v));
    }
    return [typeof value === 'string' ? { url: value } : value];
  }, [value]);

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    const cleanUrl = manualUrl.trim();
    const newItem: UploadedMediaItem = {
      url: cleanUrl,
      alt_text: 'Product asset',
      is_primary: items.length === 0,
    };

    if (multiple) {
      onChange?.([...items, newItem]);
    } else {
      onChange?.(cleanUrl);
    }
    setManualUrl('');
    setShowUrlInput(false);
    toast.success('Image path added!');
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!multiple && files.length > 1) {
      toast.error('Only single image upload is allowed here.');
      return;
    }

    if (multiple && items.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const newItems: UploadedMediaItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        let imgUrl = '';
        try {
          const res = await uploadsApi.uploadFile(file, folder);
          if (res?.data) {
            imgUrl = res.data.secure_url || res.data.url;
          }
        } catch (apiErr) {
          // If remote upload fails, convert to data URL so the image displays immediately in the UI
          imgUrl = await readFileAsDataUrl(file);
        }

        if (imgUrl) {
          newItems.push({
            url: imgUrl,
            alt_text: file.name,
            is_primary: items.length === 0 && newItems.length === 0,
          });
        }
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      toast.success(files.length > 1 ? 'Images processed successfully!' : 'Image processed successfully!');

      if (multiple) {
        const combined = [...items, ...newItems];
        onChange?.(combined);
      } else {
        const singleUrl = newItems[0]?.url || '';
        onChange?.(singleUrl);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to process image.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleRemove = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const updated = items.filter((_, idx) => idx !== indexToRemove);
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
      <div className="flex items-center justify-between">
        {label && <label className="block text-xs font-semibold text-muted-foreground">{label}</label>}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#5ef046] hover:underline flex items-center gap-1 font-semibold"
        >
          <Link className="size-3" /> {showUrlInput ? 'Hide URL Input' : 'Enter Image URL / Path'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[#5ef046]/30 bg-surface/80">
          <input
            type="text"
            placeholder="/products/tshirts/mind-maze-streetwear-tee.jpeg or https://..."
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs text-foreground focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddManualUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1 bg-[#5ef046] text-black font-bold text-xs rounded-lg hover:bg-[#4de035] transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Grid of uploaded items */}
      {items.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'}`}>
          {items.map((item, index) => (
            <div
              key={item.public_id || item.url || index}
              className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-surface/80 ${aspectClass} transition-all hover:border-primary/50`}
            >
              <img
                src={item.url.startsWith('/') || item.url.startsWith('data:') ? item.url : getCloudinaryUrl(item.url, { width: 400, height: 400, crop: 'fill' })}
                alt={item.alt_text || 'Product asset'}
                className="size-full object-cover"
                loading="lazy"
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {multiple && (
                  <button
                    type="button"
                    onClick={() => setAsPrimary(index)}
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-colors ${
                      item.is_primary
                        ? 'bg-[#5ef046] text-black'
                        : 'bg-surface/80 text-foreground hover:bg-[#5ef046] hover:text-black'
                    }`}
                  >
                    {item.is_primary ? 'Primary' : 'Set Primary'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => handleRemove(index, e)}
                  disabled={disabled}
                  className="rounded-lg bg-red-600/90 p-1.5 text-white hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>

              {item.is_primary && (
                <div className="absolute top-2 left-2 rounded-md bg-[#5ef046] px-1.5 py-0.5 text-[9px] font-bold text-black shadow-xs">
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
              : 'cursor-pointer hover:border-[#5ef046]/60 hover:bg-surface/60'
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
              <Loader2 className="size-7 animate-spin text-[#5ef046]" />
              <div className="text-xs font-semibold text-foreground">
                Processing image... {uploadProgress !== null ? `${uploadProgress}%` : ''}
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-[#5ef046]/10 p-3 text-[#5ef046]">
                <Upload className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground hover:underline">
                  Click to upload from device
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
