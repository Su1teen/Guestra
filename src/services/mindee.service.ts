import type { MindeeResponse, MindeePrediction, PassportDetails } from '../types/passport';

/**
 * Mindee Service - Custom Document API
 * Handles passport document processing via Mindee Custom Document API
 */

// Configuration
const MINDEE_API_KEY = import.meta.env.VITE_MINDEE_API_KEY || 'md_GUIH8wWQ1IdrybFksZWj5YXDsW6lWLew0obPJWadGmE';
const MINDEE_MODEL_ID = import.meta.env.VITE_MINDEE_MODEL_ID || '00f4f65a-3026-4088-9269-7dd269fbf5bd';

// Try multiple endpoint formats
const ENDPOINTS = [
  // Universal custom document endpoint with model_id query param
  `https://api.mindee.net/v1/products/mindee/custom-document/v1/predict?model_id=${MINDEE_MODEL_ID}`,
  // Direct model endpoint with account name
  `https://api.mindee.net/v1/products/sultan_sovetov/passport/v1/predict`,
  // Inference API v2
  `https://api.mindee.net/v2/inference/${MINDEE_MODEL_ID}/predict`,
];

/**
 * Convert base64 data URL to Blob
 */
const dataUrlToBlob = (dataUrl: string): Blob => {
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
 * Extract field value from Mindee prediction
 * Handles both simple values and complex field structures
 */
const getFieldValue = (prediction: MindeePrediction, ...fieldNames: string[]): string | null => {
  for (const name of fieldNames) {
    const field = prediction[name];
    if (!field) continue;
    
    // Direct value
    if (typeof field === 'string' || typeof field === 'number') {
      return String(field);
    }
    
    // Object with value property
    if (typeof field === 'object' && 'value' in field && field.value !== undefined && field.value !== null) {
      return String(field.value);
    }
    
    // Array of values (like given_names)
    if (Array.isArray(field) && field.length > 0) {
      if (field[0]?.value !== undefined) {
        return field.map((f: { value: string }) => f.value).join(' ');
      }
    }
  }
  return null;
};

/**
 * Parse Mindee prediction to PassportDetails format
 * Maps custom model fields to our database schema
 */
export const parseMindeeResponse = (prediction: MindeePrediction): Partial<PassportDetails> => {
  console.log('[Mindee] Parsing prediction:', prediction);
  
  return {
    first_name: getFieldValue(prediction, 'given_names', 'first_name', 'firstname'),
    last_name: getFieldValue(prediction, 'surnames', 'surname', 'last_name', 'lastname'),
    nationality: getFieldValue(prediction, 'nationality', 'country'),
    passport_number: getFieldValue(prediction, 'passport_number', 'id_number', 'document_number'),
    dob: getFieldValue(prediction, 'date_of_birth', 'dob', 'birth_date'),
    gender: getFieldValue(prediction, 'sex', 'gender'),
    expiry_date: getFieldValue(prediction, 'date_of_expiry', 'expiry_date', 'expiration_date'),
    issuing_country: getFieldValue(prediction, 'issuing_country', 'issuance_country', 'country_code'),
    MRZ_L1: getFieldValue(prediction, 'mrz_line_1', 'mrz1', 'MRZ_L1'),
    MRZ_L2: getFieldValue(prediction, 'mrz_line_2', 'mrz2', 'MRZ_L2'),
    verification_status: 'pending',
  };
};

/**
 * Scan passport using Mindee Custom Model API
 * Tries multiple endpoint formats until one works
 */
export const scanPassportWithMindee = async (
  imageData: string | File
): Promise<{
  success: boolean;
  data: Partial<PassportDetails> | null;
  prediction: MindeePrediction | null;
  message: string;
  rawResponse?: MindeeResponse;
}> => {
  try {
    console.log('[Mindee] API Key present:', !!MINDEE_API_KEY);
    console.log('[Mindee] Model ID:', MINDEE_MODEL_ID);
    console.log('[Mindee] Will try endpoints:', ENDPOINTS);
    
    if (!MINDEE_API_KEY) {
      return {
        success: false,
        data: null,
        prediction: null,
        message: 'Mindee API key not configured.',
      };
    }

    // Prepare the image blob once
    let imageBlob: Blob;
    if (typeof imageData === 'string') {
      imageBlob = dataUrlToBlob(imageData);
    } else {
      imageBlob = imageData;
    }

    // Try each endpoint until one works
    let lastError = '';
    for (const endpoint of ENDPOINTS) {
      console.log('[Mindee] Trying endpoint:', endpoint);
      
      const formData = new FormData();
      formData.append('document', imageBlob, 'passport.jpg');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${MINDEE_API_KEY}`,
          },
          body: formData,
        });

        const result = await response.json();
        console.log('[Mindee] Response from', endpoint, '- Status:', response.status);

        if (response.ok) {
          console.log('[Mindee] Success! Response:', result);
          
          // Extract prediction from various response formats
          const prediction = 
            result?.document?.inference?.prediction ||
            result?.document?.inference?.pages?.[0]?.prediction ||
            result?.inference?.prediction ||
            result?.inference?.pages?.[0]?.prediction ||
            result?.prediction;

          if (prediction) {
            const passportData = parseMindeeResponse(prediction);
            return {
              success: true,
              data: passportData,
              prediction,
              message: 'Passport scanned successfully',
              rawResponse: result,
            };
          }
        }
        
        // Log the error but continue to next endpoint
        const errorMsg = result?.api_request?.error?.message || 
                         result?.api_request?.error?.details || 
                         `Status ${response.status}`;
        lastError = `${endpoint}: ${errorMsg}`;
        console.log('[Mindee] Endpoint failed:', lastError);
        
      } catch (fetchError) {
        lastError = `${endpoint}: ${fetchError instanceof Error ? fetchError.message : 'Network error'}`;
        console.error('[Mindee] Fetch error:', lastError);
      }
    }

    // All endpoints failed
    return {
      success: false,
      data: null,
      prediction: null,
      message: `All Mindee endpoints failed. Last error: ${lastError}`,
    };
  } catch (error) {
    console.error('[Mindee] Scan error:', error);
    return {
      success: false,
      data: null,
      prediction: null,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Get polygon coordinates for face/photo field
 */
export const getFacePolygon = (prediction: MindeePrediction): { polygon: { x: number; y: number }[] } | null => {
  const faceFields = ['picture_of_a_person', 'face', 'photo', 'portrait', 'holder_photo'];
  
  for (const fieldName of faceFields) {
    const field = prediction[fieldName];
    if (field && typeof field === 'object' && 'polygon' in field) {
      const polygon = field.polygon as { x: number; y: number }[];
      if (Array.isArray(polygon) && polygon.length >= 3) {
        return { polygon };
      }
    }
  }
  
  // Check any field containing photo/face/picture
  for (const [key, value] of Object.entries(prediction)) {
    if (key.toLowerCase().includes('photo') || 
        key.toLowerCase().includes('face') ||
        key.toLowerCase().includes('picture')) {
      if (value && typeof value === 'object' && 'polygon' in value) {
        const polygon = (value as { polygon?: { x: number; y: number }[] }).polygon;
        if (Array.isArray(polygon) && polygon.length >= 3) {
          return { polygon };
        }
      }
    }
  }

  return null;
};

/**
 * Get polygon coordinates for signature field
 */
export const getSignaturePolygon = (prediction: MindeePrediction): { polygon: { x: number; y: number }[] } | null => {
  const signatureFields = ['signature', 'holder_signature', 'sig'];
  
  for (const fieldName of signatureFields) {
    const field = prediction[fieldName];
    if (field && typeof field === 'object' && 'polygon' in field) {
      const polygon = field.polygon as { x: number; y: number }[];
      if (Array.isArray(polygon) && polygon.length >= 3) {
        return { polygon };
      }
    }
  }

  return null;
};
