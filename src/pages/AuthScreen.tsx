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
    <div className="flex justify-between w-full">
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
          className="w-12 h-14 text-center text-xl font-semibold bg-primary/[0.03] border-0 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
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
    <div className="relative w-full aspect-[4/3] bg-primary/[0.03] rounded-2xl overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="1.5" strokeOpacity="0.25" className="mx-auto mb-2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="7" y1="8" x2="17" y2="8" />
            <line x1="7" y1="12" x2="13" y2="12" />
            <rect x="14" y="10" width="3" height="4" rx="0.5" />
          </svg>
          <p className="text-primary/25 text-xs">Position document here</p>
        </div>
      </div>
      
      {/* Corner markers */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
      
      {isScanning && (
        <div className="absolute inset-0 bg-surface/95 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/15 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-primary text-sm font-medium">Scanning... {progress}%</p>
          </div>
        </div>
      )}
      
      {!isScanning && (
        <button
          onClick={handleScan}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-primary text-surface px-6 py-2.5 rounded-full font-medium text-sm active:scale-95 transition-transform"
        >
          Scan Document
        </button>
      )}
    </div>
  );
};

const LivenessCheck = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'complete'>('idle');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('verifying');
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('complete');
            setTimeout(onComplete, 500);
            return 100;
          }
          return prev + 4;
        });
      }, 60);
    }, 400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center pt-8">
      <div className="relative w-36 h-36 mb-6">
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#050A30"
            strokeOpacity="0.06"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={status === 'complete' ? '#27AE60' : '#050A30'}
            strokeWidth="4"
            strokeDasharray={`${progress * 2.89} 289`}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>
        {/* Avatar */}
        <div className="absolute inset-3 rounded-full bg-primary/[0.03] flex items-center justify-center">
          {status === 'complete' ? (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="1.5" strokeOpacity="0.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
      </div>
      <p className={`text-sm font-medium ${status === 'complete' ? 'text-status-success' : 'text-primary/40'}`}>
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
    }, 1200);
  };

  return (
    <div className="mobile-container min-h-screen bg-surface">
      <div className="px-6 pt-14 pb-8">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-10">
          {['phone', 'otp', 'passport', 'selfie'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                ['phone', 'otp', 'passport', 'selfie', 'complete'].indexOf(step) >= i
                  ? 'bg-primary'
                  : 'bg-primary/[0.08]'
              }`}
            />
          ))}
        </div>

        {step === 'phone' && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-primary mb-2 tracking-tight">Welcome to GUESTRA</h1>
            <p className="text-primary/40 text-[15px] mb-10">Enter your phone number to get started</p>
            
            <div className="mb-8">
              <label className="block text-[11px] font-semibold text-primary/40 mb-3 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full h-14 px-4 bg-primary/[0.03] border-0 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-[17px] text-primary placeholder:text-primary/20 transition-all"
              />
            </div>
            
            <button
              onClick={handlePhoneSubmit}
              disabled={phone.length < 10}
              className="w-full h-12 bg-primary text-surface rounded-full font-semibold text-[15px] disabled:opacity-25 transition-all active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-primary mb-2 tracking-tight">Verify Your Number</h1>
            <p className="text-primary/40 text-[15px] mb-10">Enter the 6-digit code sent to {phone}</p>
            
            <div className="mb-8">
              <OTPInput length={6} value={otp} onChange={setOtp} />
            </div>
            
            <button
              onClick={handleOTPSubmit}
              disabled={otp.length < 6}
              className="w-full h-12 bg-primary text-surface rounded-full font-semibold text-[15px] disabled:opacity-25 transition-all active:scale-[0.98]"
            >
              Verify
            </button>
            
            <button className="w-full mt-5 text-primary/30 text-sm font-medium">
              Resend Code
            </button>
          </div>
        )}

        {step === 'passport' && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-primary mb-2 tracking-tight">Scan Passport</h1>
            <p className="text-primary/40 text-[15px] mb-8">Position your passport within the frame</p>
            
            <PassportScanner onCapture={handlePassportCapture} />
          </div>
        )}

        {step === 'selfie' && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-semibold text-primary mb-2 tracking-tight">Selfie Verification</h1>
            <p className="text-primary/40 text-[15px]">Complete the liveness check</p>
            
            <LivenessCheck onComplete={handleLivenessComplete} />
          </div>
        )}

        {step === 'complete' && (
          <div className="animate-fade-in flex flex-col items-center pt-28">
            <div className="w-16 h-16 rounded-full bg-status-success flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-primary mb-1">All Set!</h1>
            <p className="text-primary/40 text-[15px]">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
