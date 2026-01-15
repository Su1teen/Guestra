import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthStep = 'phone' | 'otp' | 'passport' | 'selfie' | 'complete';

const OTPInput = ({ length, value, onChange }: { length: number; value: string; onChange: (val: string) => void }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    
    const newValue = value.split('');
    newValue[index] = val.slice(-1);
    onChange(newValue.join(''));
    
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-10 h-12 text-center text-xl font-bold border border-primary/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
        />
      ))}
    </div>
  );
};

const PassportScanner = ({ onCapture }: { onCapture: () => void }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onCapture, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-primary/5 rounded-2xl overflow-hidden">
      {/* Simulated passport scan area */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="1.5" strokeOpacity="0.4" className="mx-auto mb-3">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="7" y1="8" x2="17" y2="8" />
            <line x1="7" y1="12" x2="13" y2="12" />
            <rect x="14" y="10" width="3" height="4" rx="0.5" />
          </svg>
          <p className="text-primary/40 text-sm">Passport Scanner</p>
        </div>
      </div>
      {/* White hairline frame overlay */}
      <div className="absolute inset-4 border-2 border-primary/20 rounded-lg pointer-events-none" />
      
      {isScanning && (
        <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            <p className="text-primary text-sm">Scanning... {progress}%</p>
          </div>
        </div>
      )}
      
      {!isScanning && (
        <button
          onClick={handleScan}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-surface px-6 py-2.5 rounded-lg font-medium text-sm"
        >
          Scan Passport
        </button>
      )}
    </div>
  );
};

const LivenessCheck = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'complete'>('idle');

  const startVerification = () => {
    setStatus('verifying');
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('complete');
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  useEffect(() => {
    // Auto-start after a short delay
    const timer = setTimeout(startVerification, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        {/* Rotating border SVG */}
        <svg
          className={`absolute inset-0 w-full h-full ${status === 'verifying' ? 'animate-rotate-border' : ''}`}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={status === 'complete' ? '#27AE60' : '#050A30'}
            strokeWidth="3"
            strokeDasharray={`${progress * 2.89} 289`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-200"
          />
        </svg>
        {/* Avatar placeholder */}
        <div className="absolute inset-2 rounded-full overflow-hidden bg-primary/5 flex items-center justify-center">
          {status === 'complete' ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="1.5" strokeOpacity="0.3">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
      </div>
      <p className={`text-sm font-medium ${status === 'complete' ? 'text-status-success' : 'text-primary/60'}`}>
        {status === 'idle' && 'Preparing...'}
        {status === 'verifying' && `Verifying... ${progress}%`}
        {status === 'complete' && 'Verification Complete!'}
      </p>
    </div>
  );
};

const AuthScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleOTPSubmit = () => {
    if (otp.length === 6) {
      setStep('passport');
    }
  };

  const handlePassportCapture = () => {
    setStep('selfie');
  };

  const handleLivenessComplete = () => {
    setStep('complete');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="mobile-container min-h-screen bg-surface">
      <div className="px-5 py-6 stable-layout">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6">
          {['phone', 'otp', 'passport', 'selfie'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ['phone', 'otp', 'passport', 'selfie', 'complete'].indexOf(step) >= i
                  ? 'bg-primary'
                  : 'bg-primary/10'
              }`}
            />
          ))}
        </div>

        {step === 'phone' && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-primary mb-1">Welcome to GUESTRA</h1>
            <p className="text-primary/60 text-sm mb-6">Enter your phone number to get started</p>
            
            <div className="mb-5">
              <label className="block text-xs font-medium text-primary mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full h-12 px-4 border border-primary/10 rounded-lg focus:border-primary focus:outline-none text-base"
              />
            </div>
            
            <button
              onClick={handlePhoneSubmit}
              disabled={phone.length < 10}
              className="w-full h-11 bg-primary text-surface rounded-lg font-medium text-sm disabled:opacity-40 transition-opacity"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-primary mb-1">Verify Your Number</h1>
            <p className="text-primary/60 text-sm mb-6">Enter the 6-digit code sent to {phone}</p>
            
            <div className="mb-5">
              <OTPInput length={6} value={otp} onChange={setOtp} />
            </div>
            
            <button
              onClick={handleOTPSubmit}
              disabled={otp.length < 6}
              className="w-full h-11 bg-primary text-surface rounded-lg font-medium text-sm disabled:opacity-40 transition-opacity"
            >
              Verify
            </button>
            
            <button className="w-full mt-3 text-primary/60 text-xs">
              Resend Code
            </button>
          </div>
        )}

        {step === 'passport' && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-primary mb-1">Scan Passport</h1>
            <p className="text-primary/60 text-sm mb-5">Position your passport within the frame</p>
            
            <PassportScanner onCapture={handlePassportCapture} />
          </div>
        )}

        {step === 'selfie' && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-primary mb-1">Selfie Verification</h1>
            <p className="text-primary/60 text-sm mb-6">Complete the liveness check</p>
            
            <LivenessCheck onComplete={handleLivenessComplete} />
          </div>
        )}

        {step === 'complete' && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-status-success flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-primary mb-1">Verified!</h1>
            <p className="text-primary/60 text-sm">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
