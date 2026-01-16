import type { MindeePolygon, CropResult } from '../types/passport';

/**
 * Cropper Utility
 * Extracts regions from images using polygon coordinates from Mindee API
 */

/**
 * Load an image from a data URL or source
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

/**
 * Calculate bounding box from polygon coordinates
 * Mindee returns normalized coordinates (0-1), we need to scale to image dimensions
 */
const getBoundingBox = (
  polygon: MindeePolygon[],
  imageWidth: number,
  imageHeight: number
): { x: number; y: number; width: number; height: number } => {
  if (!polygon || polygon.length === 0) {
    throw new Error('Invalid polygon coordinates');
  }

  // Scale normalized coordinates to actual pixel values
  const scaledPolygon = polygon.map((point) => ({
    x: point.x * imageWidth,
    y: point.y * imageHeight,
  }));

  const xs = scaledPolygon.map((p) => p.x);
  const ys = scaledPolygon.map((p) => p.y);

  const minX = Math.max(0, Math.min(...xs));
  const maxX = Math.min(imageWidth, Math.max(...xs));
  const minY = Math.max(0, Math.min(...ys));
  const maxY = Math.min(imageHeight, Math.max(...ys));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

/**
 * Crop a region from an image using polygon coordinates
 * @param originalImageSrc - Base64 data URL or image source
 * @param polygonCoordinates - Array of {x, y} normalized coordinates from Mindee
 * @param padding - Optional padding around the crop (in pixels)
 * @returns Promise<CropResult> - Blob and data URL of cropped image
 */
export const cropFromCoordinates = async (
  originalImageSrc: string,
  polygonCoordinates: MindeePolygon[],
  padding: number = 5
): Promise<CropResult> => {
  const img = await loadImage(originalImageSrc);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Get bounding box from polygon
  const bbox = getBoundingBox(polygonCoordinates, img.width, img.height);

  // Apply padding
  const x = Math.max(0, bbox.x - padding);
  const y = Math.max(0, bbox.y - padding);
  const width = Math.min(img.width - x, bbox.width + padding * 2);
  const height = Math.min(img.height - y, bbox.height + padding * 2);

  // Set canvas size to crop dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw the cropped region
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve({ blob, dataUrl });
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      'image/jpeg',
      0.92
    );
  });
};

/**
 * Crop face from passport image
 * Searches for face/photo field in Mindee prediction
 */
export const cropFace = async (
  imageSrc: string,
  prediction: Record<string, unknown>
): Promise<CropResult | null> => {
  // Look for face coordinates in various field names
  const faceFieldNames = ['picture_of_a_person', 'face', 'photo', 'portrait', 'holder_photo'];
  
  for (const fieldName of faceFieldNames) {
    const field = prediction[fieldName] as { polygon?: MindeePolygon[] } | undefined;
    if (field?.polygon && field.polygon.length >= 3) {
      try {
        return await cropFromCoordinates(imageSrc, field.polygon, 10);
      } catch (error) {
        console.warn(`Failed to crop face from ${fieldName}:`, error);
      }
    }
  }

  console.warn('No face coordinates found in prediction');
  return null;
};

/**
 * Crop signature from passport image
 */
export const cropSignature = async (
  imageSrc: string,
  prediction: Record<string, unknown>
): Promise<CropResult | null> => {
  // Look for signature coordinates
  const signatureFieldNames = ['signature', 'holder_signature', 'sig'];
  
  for (const fieldName of signatureFieldNames) {
    const field = prediction[fieldName] as { polygon?: MindeePolygon[] } | undefined;
    if (field?.polygon && field.polygon.length >= 3) {
      try {
        return await cropFromCoordinates(imageSrc, field.polygon, 5);
      } catch (error) {
        console.warn(`Failed to crop signature from ${fieldName}:`, error);
      }
    }
  }

  console.warn('No signature coordinates found in prediction');
  return null;
};

/**
 * Convert base64 data URL to Blob
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Resize image to max dimensions while maintaining aspect ratio
 */
export const resizeImage = async (
  imageSrc: string,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<string> => {
  const img = await loadImage(imageSrc);
  
  let { width, height } = img;
  
  if (width <= maxWidth && height <= maxHeight) {
    return imageSrc;
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  width = Math.floor(width * ratio);
  height = Math.floor(height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.9);
};
