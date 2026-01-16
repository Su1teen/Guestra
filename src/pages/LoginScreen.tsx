import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Login Screen
 * MVP: Accepts any input and redirects to Profile (ID 11)
 */
const LoginScreen = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 800));

    // Store user ID 11 in localStorage for session
    localStorage.setItem('guestra_user_id', '11');

    // Navigate to profile
    navigate('/profile');
  };

  const isFormValid = phoneNumber.length >= 1 && otpCode.length >= 1;

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <button
          onClick={() => navigate('/auth')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-8"
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

        <h1 className="text-3xl font-bold text-white tracking-wide mb-2">Welcome Back</h1>
        <p className="text-white/60">Sign in to access your profile</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8">
        {/* Phone Number */}
        <div className="mb-6">
          <label className="block text-white/60 text-sm mb-2">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              +971
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="50 123 4567"
              maxLength={10}
              className="w-full pl-16 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl
                         text-white placeholder-white/30 focus:outline-none focus:border-white/40
                         transition-colors"
            />
          </div>
        </div>

        {/* OTP Code */}
        <div className="mb-8">
          <label className="block text-white/60 text-sm mb-2">4-Digit Security Code</label>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="• • • •"
            maxLength={4}
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl
                       text-white text-center text-2xl tracking-[1em] placeholder-white/30 
                       focus:outline-none focus:border-white/40 transition-colors"
          />
          <p className="text-white/40 text-xs mt-2 text-center">
            Enter any values for demo
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!isFormValid || isLoading}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 
                      ${isFormValid && !isLoading
                        ? 'bg-white text-primary active:scale-[0.98]'
                        : 'bg-white/20 text-white/40 cursor-not-allowed'
                      }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing In...
            </span>
          ) : (
            'Login'
          )}
        </button>

        {/* Create Account Link */}
        <p className="text-center text-white/60 text-sm mt-8">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/scan-passport')}
            className="text-white underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
