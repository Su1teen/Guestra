import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

type VerificationState = 'scanning' | 'verifying' | 'success';

/**
 * Verification Screen
 * Camera → "Verifying..." (2s) → "Access Granted" success
 */
const VerificationScreen = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [state, setState] = useState<VerificationState>('scanning');

  const handleScan = useCallback(() => {
    setState('verifying');
    
    // Simulate verification delay
    setTimeout(() => {
      setState('success');
    }, 2000);
  }, []);

  const handleDone = () => {
    navigate('/profile');
  };

  // Camera constraints for mobile
  const videoConstraints = {
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-white tracking-wide">
          {state === 'scanning' && 'Scan Access Point'}
          {state === 'verifying' && 'Verifying...'}
          {state === 'success' && 'Access Granted'}
        </h1>
        <p className="text-white/60 mt-1">
          {state === 'scanning' && 'Point camera at the door QR code'}
          {state === 'verifying' && 'Please wait while we verify'}
          {state === 'success' && 'You may now proceed'}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {state === 'scanning' && (
          <>
            {/* Camera View */}
            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black/50 mb-8">
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                screenshotFormat="image/jpeg"
              />
              
              {/* Scan Frame Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/60 rounded-xl relative">
                  {/* Corner accents */}
                  <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />
                  <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />
                </div>
              </div>
            </div>

            {/* Scan Button */}
            <button
              onClick={handleScan}
              className="w-full max-w-sm py-4 bg-white text-primary font-semibold rounded-xl 
                         transition-all duration-200 active:scale-[0.98]
                         shadow-lg shadow-black/20 flex items-center justify-center gap-3"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Scan Now
            </button>
          </>
        )}

        {state === 'verifying' && (
          <div className="text-center">
            {/* Spinner */}
            <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-8" />
            <p className="text-white/80 text-lg">Verifying your access...</p>
            <p className="text-white/40 text-sm mt-2">This will only take a moment</p>
          </div>
        )}

        {state === 'success' && (
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full bg-status-success flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3">Access Granted</h2>
            <p className="text-white/60 text-lg mb-8">Welcome! You may now enter.</p>
            
            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full max-w-xs py-4 bg-white text-primary font-semibold rounded-xl 
                         transition-all duration-200 active:scale-[0.98]
                         shadow-lg shadow-black/20"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {state === 'scanning' && (
        <div className="px-6 pb-12">
          <p className="text-center text-white/30 text-xs">
            Position the QR code within the frame to scan
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationScreen;
