/**
 * Passport Types for GUESTRA
 * Matches the Supabase public.passport_details table schema
 */

export interface PassportDetails {
  id?: number;
  first_name: string | null;
  last_name: string | null;
  nationality: string | null;
  passport_number: string | null;
  dob: string | null;
  gender: string | null;
  expiry_date: string | null;
  issuing_country: string | null;
  verification_status: 'pending' | 'verified' | 'rejected' | null;
  passport_scan_url: string | null;
  face_photo_url: string | null;
  selfie_verification_url: string | null;
  MRZ_L1: string | null;
  MRZ_L2: string | null;
  Signature: string | null;
}

export interface PassportInsert extends Omit<PassportDetails, 'id'> {}

/**
 * Mindee Custom Model Response Types
 */
export interface MindeePolygon {
  x: number;
  y: number;
}

export interface MindeeField {
  value: string | null;
  confidence: number;
  polygon: MindeePolygon[];
}

export interface MindeeObjectField {
  polygon: MindeePolygon[];
  confidence: number;
}

export interface MindeePrediction {
  // Text fields from custom model
  first_name?: MindeeField;
  last_name?: MindeeField;
  nationality?: MindeeField;
  passport_number?: MindeeField;
  dob?: MindeeField;
  date_of_birth?: MindeeField;
  gender?: MindeeField;
  expiry_date?: MindeeField;
  issuing_country?: MindeeField;
  mrz_line_1?: MindeeField;
  mrz_line_2?: MindeeField;
  MRZ_L1?: MindeeField;
  MRZ_L2?: MindeeField;
  // Object/Image fields
  picture_of_a_person?: MindeeObjectField;
  face?: MindeeObjectField;
  photo?: MindeeObjectField;
  signature?: MindeeObjectField;
  [key: string]: MindeeField | MindeeObjectField | undefined;
}

export interface MindeeDocument {
  inference: {
    prediction: MindeePrediction;
    pages: Array<{
      prediction: MindeePrediction;
    }>;
  };
}

export interface MindeeResponse {
  api_request: {
    status: string;
    status_code: number;
  };
  document: MindeeDocument;
}

/**
 * Cropper Types
 */
export interface CropResult {
  blob: Blob;
  dataUrl: string;
}

export interface CropCoordinates {
  polygon: MindeePolygon[];
}

/**
 * Scanner State
 */
export type ScannerStep = 'capture' | 'processing' | 'review' | 'uploading' | 'success' | 'error';

export interface ScannerState {
  step: ScannerStep;
  capturedImage: string | null;
  passportData: Partial<PassportDetails> | null;
  faceBlob: Blob | null;
  signatureBlob: Blob | null;
  error: string | null;
}
