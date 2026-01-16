import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import type { PassportDetails, PassportInsert } from '../types/passport';

/**
 * Passport Storage Service
 * Handles file uploads and database operations for passport data
 */

/**
 * Generate unique filename with timestamp
 */
const generateFilename = (prefix: string, extension: string = 'jpg'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}.${extension}`;
};

/**
 * Upload passport scan images to Supabase Storage
 */
export const uploadPassportImages = async (
  fullPassportBlob: Blob,
  faceCropBlob: Blob | null,
  signatureBlob: Blob | null
): Promise<{
  success: boolean;
  urls: {
    passportScanUrl: string | null;
    facePhotoUrl: string | null;
    signatureUrl: string | null;
  };
  message: string;
}> => {
  try {
    const urls = {
      passportScanUrl: null as string | null,
      facePhotoUrl: null as string | null,
      signatureUrl: null as string | null,
    };

    // 1. Upload full passport scan
    const passportFilename = generateFilename('full_passport');
    const { data: passportData, error: passportError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(`passports/${passportFilename}`, fullPassportBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (passportError) {
      console.error('[Storage] Passport upload error:', passportError);
      return {
        success: false,
        urls,
        message: 'Failed to upload passport scan',
      };
    }

    // Get public URL for passport
    const { data: passportUrl } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(passportData.path);
    urls.passportScanUrl = passportUrl.publicUrl;

    // 2. Upload face crop (if available)
    if (faceCropBlob) {
      const faceFilename = generateFilename('face_crop');
      const { data: faceData, error: faceError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(`passports/${faceFilename}`, faceCropBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (faceError) {
        console.warn('[Storage] Face crop upload error:', faceError);
      } else {
        const { data: faceUrl } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(faceData.path);
        urls.facePhotoUrl = faceUrl.publicUrl;
      }
    }

    // 3. Upload signature (if available)
    if (signatureBlob) {
      const signatureFilename = generateFilename('signature');
      const { data: signatureData, error: signatureError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(`passports/${signatureFilename}`, signatureBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (signatureError) {
        console.warn('[Storage] Signature upload error:', signatureError);
      } else {
        const { data: signatureUrl } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(signatureData.path);
        urls.signatureUrl = signatureUrl.publicUrl;
      }
    }

    return {
      success: true,
      urls,
      message: 'Images uploaded successfully',
    };
  } catch (error) {
    console.error('[Storage] Upload error:', error);
    return {
      success: false,
      urls: {
        passportScanUrl: null,
        facePhotoUrl: null,
        signatureUrl: null,
      },
      message: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Save passport details to database
 */
export const savePassportDetails = async (
  data: PassportInsert
): Promise<{
  success: boolean;
  id: number | null;
  message: string;
}> => {
  try {
    const { data: result, error } = await supabase
      .from('passport_details')
      .insert(data)
      .select('id')
      .single();

    if (error) {
      console.error('[DB] Insert error:', error);
      return {
        success: false,
        id: null,
        message: 'Failed to save passport details',
      };
    }

    return {
      success: true,
      id: result.id,
      message: 'Passport details saved successfully',
    };
  } catch (error) {
    console.error('[DB] Save error:', error);
    return {
      success: false,
      id: null,
      message: error instanceof Error ? error.message : 'Database error',
    };
  }
};

/**
 * Get passport details by ID
 */
export const getPassportDetails = async (
  id: number
): Promise<{
  success: boolean;
  data: PassportDetails | null;
  message: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('passport_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[DB] Fetch error:', error);
      return {
        success: false,
        data: null,
        message: 'Passport details not found',
      };
    }

    return {
      success: true,
      data: data as PassportDetails,
      message: 'Passport details fetched successfully',
    };
  } catch (error) {
    console.error('[DB] Fetch error:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Database error',
    };
  }
};

/**
 * Get latest passport details (for demo/single user flow)
 */
export const getLatestPassportDetails = async (): Promise<{
  success: boolean;
  data: PassportDetails | null;
  message: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('passport_details')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[DB] Fetch error:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to fetch passport details',
      };
    }

    return {
      success: true,
      data: data as PassportDetails | null,
      message: data ? 'Passport details found' : 'No passport details found',
    };
  } catch (error) {
    console.error('[DB] Fetch error:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Database error',
    };
  }
};

/**
 * Update passport verification status
 */
export const updateVerificationStatus = async (
  id: number,
  status: 'pending' | 'verified' | 'rejected'
): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase
      .from('passport_details')
      .update({ verification_status: status })
      .eq('id', id);

    if (error) {
      console.error('[DB] Update error:', error);
      return {
        success: false,
        message: 'Failed to update verification status',
      };
    }

    return {
      success: true,
      message: 'Verification status updated',
    };
  } catch (error) {
    console.error('[DB] Update error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Database error',
    };
  }
};
