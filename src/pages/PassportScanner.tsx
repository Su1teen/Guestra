import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import type { ScannerStep, PassportDetails, MindeePrediction } from '../types/passport';
// Keep Mindee imports for future use (currently using fake verification)
// import { scanPassportWithMindee, getFacePolygon, getSignaturePolygon } from '../services/mindee.service';
// import { uploadPassportImages, savePassportDetails } from '../services/passport.storage';
// import { cropFromCoordinates, dataUrlToBlob } from '../utils/cropper';

// Extended scanner steps to include selfie
type ExtendedScannerStep = ScannerStep | 'selfie_capture' | 'selfie_processing' | 'final_verify';

const PassportScanner = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const selfieWebcamRef = useRef<Webcam>(null);
  
  const [step, setStep] = useState<ExtendedScannerStep>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [passportData, setPassportData] = useState<Partial<PassportDetails> | null>(null);
  // Prediction state kept for future Mindee integration
  const [_prediction, _setPrediction] = useState<MindeePrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Webcam configuration for passport (back camera)
  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: 'environment' },
  };

  // Webcam configuration for selfie (front camera)
  const selfieVideoConstraints = {
    width: { ideal: 720 },
    height: { ideal: 720 },
    facingMode: 'user',
  };

  /**
   * Capture passport photo from webcam
   */
  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      processPassportFake(imageSrc);
    }
  }, []);

  /**
   * Capture selfie from webcam
   */
  const handleCaptureSelfie = useCallback(() => {
    const imageSrc = selfieWebcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfieImage(imageSrc);
      processSelfie();
    }
  }, []);

  /**
   * Retake photo
   */
  const handleRetake = () => {
    setCapturedImage(null);
    setSelfieImage(null);
    setPassportData(null);
    _setPrediction(null);
    setError(null);
    setStep('capture');
  };

  /**
   * FAKE passport processing (keeps Mindee code commented for future use)
   */
  const processPassportFake = async (_imageSrc: string) => {
    setStep('processing');
    setProgress(0);

    // Simulate processing steps
    await new Promise(r => setTimeout(r, 800));
    setProgress(30);
    await new Promise(r => setTimeout(r, 600));
    setProgress(60);
    await new Promise(r => setTimeout(r, 500));
    setProgress(90);
    await new Promise(r => setTimeout(r, 300));
    setProgress(100);

    // Fake extracted data
    const fakeData: Partial<PassportDetails> = {
      first_name: 'Sultan',
      last_name: 'Sovetov',
      nationality: 'Kazakh',
      passport_number: '126668707',
      dob: '01.10.2003',
      gender: 'Male',
      expiry_date: '14.10.2029',
      issuing_country: 'KAZAKHSTAN',
    };

    setPassportData(fakeData);
    setStep('review');
  };

  /**
   * REAL passport processing with Mindee (kept for future use)
   */
  /*
  const processPassportReal = async (imageSrc: string) => {
    setStep('processing');
    setProgress(20);

    try {
      const result = await scanPassportWithMindee(imageSrc);
      setProgress(50);

      if (!result.success || !result.data) {
        setError(result.message);
        setStep('error');
        return;
      }

      setPassportData(result.data);
      _setPrediction(result.prediction);
      setProgress(70);
      setStep('review');
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process passport');
      setStep('error');
    }
  };
  */

  /**
   * Process selfie (fake verification)
   */
  const processSelfie = async () => {
    setStep('selfie_processing');
    setProgress(0);

    // Simulate face verification
    await new Promise(r => setTimeout(r, 600));
    setProgress(25);
    await new Promise(r => setTimeout(r, 500));
    setProgress(50);
    await new Promise(r => setTimeout(r, 600));
    setProgress(75);
    await new Promise(r => setTimeout(r, 400));
    setProgress(100);

    setStep('final_verify');

    // Final verification animation
    await new Promise(r => setTimeout(r, 1500));
    setStep('success');

    // Store user ID and redirect
    localStorage.setItem('guestra_user_id', '1');
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  /**
   * Proceed to selfie after passport review
   */
  const handleProceedToSelfie = () => {
    setStep('selfie_capture');
  };

  return (
    <div className="mobile-container min-h-screen bg-surface">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-primary/[0.03] flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-primary tracking-tight">
              {step === 'selfie_capture' || step === 'selfie_processing' ? 'Selfie Verification' : 'Scan Passport'}
            </h1>
            <p className="text-primary/40 text-sm mt-0.5">
              {step === 'selfie_capture' ? 'Position your face in the circle' : 
               step === 'selfie_processing' ? 'Verifying identity...' :
               'Position document within frame'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {(step === 'processing' || step === 'uploading' || step === 'selfie_processing') && (
        <div className="px-6 mb-4">
          <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-primary/40 text-xs mt-2">
            {step === 'processing' ? 'Analyzing document...' : 
             step === 'selfie_processing' ? 'Verifying face...' : 'Saving data...'}
          </p>
        </div>
      )}

      {/* Capture Step */}
      {step === 'capture' && (
        <div className="px-5">
          <div className="relative aspect-[4/3] bg-primary/[0.03] rounded-2xl overflow-hidden mb-4">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={videoConstraints}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Corner markers */}
            <div className="absolute inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
            </div>

            {/* Passport frame guide */}
            <div className="absolute inset-8 border border-dashed border-primary/20 rounded-lg" />
          </div>

          {/* Capture Button */}
          <button
            onClick={handleCapture}
            className="w-full h-14 bg-primary text-surface rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Capture Document
          </button>

          <p className="text-center text-primary/30 text-xs mt-4">
            Ensure good lighting and hold steady
          </p>
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="px-5">
          <div className="relative aspect-[4/3] bg-primary/[0.03] rounded-2xl overflow-hidden mb-4">
            {capturedImage && (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-primary/15 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-primary font-medium">Analyzing passport...</p>
                <p className="text-primary/40 text-sm mt-1">Extracting information</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && passportData && (
        <div className="px-5 pb-8">
          <div className="relative aspect-[4/3] bg-primary/[0.03] rounded-2xl overflow-hidden mb-4">
            {capturedImage && (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}
            <div className="absolute top-3 right-3">
              <span className="bg-status-success/90 text-surface text-xs font-semibold px-3 py-1.5 rounded-full">
                Scanned
              </span>
            </div>
          </div>

          {/* Extracted Data */}
          <div className="bg-primary/[0.02] rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-semibold text-primary mb-4">Extracted Information</h3>
            <div className="space-y-3">
              <DataRow label="First Name" value={passportData.first_name} />
              <DataRow label="Last Name" value={passportData.last_name} />
              <DataRow label="Nationality" value={passportData.nationality} />
              <DataRow label="Passport No." value={passportData.passport_number} />
              <DataRow label="Date of Birth" value={passportData.dob} />
              <DataRow label="Gender" value={passportData.gender} />
              <DataRow label="Expiry Date" value={passportData.expiry_date} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleProceedToSelfie}
              className="w-full h-14 bg-primary text-surface rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Continue to Selfie
            </button>
            <button
              onClick={handleRetake}
              className="w-full h-12 bg-primary/[0.03] text-primary rounded-full font-medium text-sm active:bg-primary/[0.06] transition-colors"
            >
              Retake Photo
            </button>
          </div>
        </div>
      )}

      {/* Selfie Capture Step */}
      {step === 'selfie_capture' && (
        <div className="px-5 pb-8">
          {/* Face Circle Frame */}
          <div className="relative aspect-square max-w-[320px] mx-auto bg-primary/[0.03] rounded-full overflow-hidden mb-6">
            <Webcam
              ref={selfieWebcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={selfieVideoConstraints}
              className="absolute inset-0 w-full h-full object-cover"
              mirrored={true}
            />
            
            {/* Circle overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-4 border-white/50 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-dashed border-primary/30 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mb-6">
            <p className="text-primary font-medium mb-1">Position your face in the circle</p>
            <p className="text-primary/40 text-sm">Make sure your face is clearly visible</p>
          </div>

          {/* Capture Button */}
          <button
            onClick={handleCaptureSelfie}
            className="w-full h-14 bg-primary text-surface rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Take Selfie
          </button>
        </div>
      )}

      {/* Selfie Processing Step */}
      {step === 'selfie_processing' && (
        <div className="px-5 pb-8">
          <div className="relative aspect-square max-w-[320px] mx-auto rounded-full overflow-hidden mb-6">
            {selfieImage && (
              <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-surface/70 flex items-center justify-center rounded-full">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-primary/15 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-primary font-medium">Verifying identity...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Verification Step */}
      {step === 'final_verify' && (
        <div className="px-5 flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full overflow-hidden">
                {selfieImage && (
                  <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
            <p className="text-primary font-semibold text-lg">Matching face with passport...</p>
            <p className="text-primary/40 text-sm mt-2">Please wait</p>
          </div>
        </div>
      )}

      {/* Uploading Step */}
      {step === 'uploading' && (
        <div className="px-5 flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-2 border-primary/15 border-t-primary rounded-full animate-spin mx-auto mb-6" />
            <p className="text-primary font-semibold text-lg">Saving Data</p>
            <p className="text-primary/40 text-sm mt-2">Uploading images and details...</p>
          </div>
        </div>
      )}

      {/* Success Step */}
      {step === 'success' && (
        <div className="px-5 flex-1 flex items-center justify-center">
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-status-success flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Identity Verified</h2>
            <p className="text-primary/40">Welcome to GUESTRA!</p>
            <p className="text-primary/30 text-sm mt-1">Redirecting to your profile...</p>
          </div>
        </div>
      )}

      {/* Error Step */}
      {step === 'error' && (
        <div className="px-5 flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-status-error/10 flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">Scan Failed</h2>
            <p className="text-primary/40 text-sm mb-6 max-w-xs mx-auto">{error || 'Something went wrong'}</p>
            <button
              onClick={handleRetake}
              className="h-12 bg-primary text-surface px-8 rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Data Row Component
 */
const DataRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex justify-between items-center">
    <span className="text-primary/40 text-sm">{label}</span>
    <span className="text-primary font-medium text-sm">
      {value || <span className="text-primary/20">—</span>}
    </span>
  </div>
);

export default PassportScanner;
