/**
 * Cloudinary URL transformation and optimization utilities
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'pad' | 'scale' | 'thumb';
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco' | number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  gravity?: 'auto' | 'center' | 'face';
  blur?: number;
}

/**
 * Transforms a Cloudinary URL or publicId with specified optimization flags.
 * If the input is already a non-Cloudinary URL, returns the original URL.
 */
export function getCloudinaryUrl(
  urlOrPublicId: string | null | undefined,
  options: CloudinaryTransformOptions = {}
): string {
  if (!urlOrPublicId) {
    return '/placeholder.svg';
  }

  // If it's a relative path or non-Cloudinary external URL, return as-is
  if (!urlOrPublicId.includes('cloudinary.com') && !urlOrPublicId.includes('res.cloudinary.com')) {
    // If it's a simple public_id without URL prefix
    if (!urlOrPublicId.startsWith('http://') && !urlOrPublicId.startsWith('https://') && !urlOrPublicId.startsWith('/')) {
      const cloudName = 'xeno'; // default cloud name if direct public ID
      return buildCloudinaryUrl(cloudName, urlOrPublicId, options);
    }
    return urlOrPublicId;
  }

  // Build transformation string
  const transforms: string[] = [];

  const crop = options.crop || 'fill';
  if (options.width || options.height) {
    transforms.push(`c_${crop}`);
  }
  if (options.width) {
    transforms.push(`w_${options.width}`);
  }
  if (options.height) {
    transforms.push(`h_${options.height}`);
  }
  if (options.gravity) {
    transforms.push(`g_${options.gravity}`);
  }

  const quality = options.quality || 'auto';
  transforms.push(`q_${quality}`);

  const format = options.format || 'auto';
  transforms.push(`f_${format}`);

  if (options.blur) {
    transforms.push(`e_blur:${options.blur}`);
  }

  const transformString = transforms.join(',');

  // Insert transformation into Cloudinary URL: /upload/[transforms]/v...
  const uploadIndex = urlOrPublicId.indexOf('/upload/');
  if (uploadIndex !== -1) {
    const prefix = urlOrPublicId.substring(0, uploadIndex + 8);
    const suffix = urlOrPublicId.substring(uploadIndex + 8);
    return `${prefix}${transformString}/${suffix}`;
  }

  return urlOrPublicId;
}

function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  options: CloudinaryTransformOptions
): string {
  const transforms: string[] = ['q_auto', 'f_auto'];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}
