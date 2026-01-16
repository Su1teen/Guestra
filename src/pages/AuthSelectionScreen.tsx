import { useNavigate } from 'react-router-dom';

/**
 * Auth Selection Screen
 * Entry point with "Create Account" and "Login" options
 */
const AuthSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Brand */}
        <h1 className="text-4xl font-bold text-white tracking-[0.3em] mb-2">
          GUESTRA
        </h1>
        <p className="text-white/60 text-sm tracking-widest uppercase mb-16">
          Premium Guest Experience
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-12 space-y-4">
        {/* Create Account Button */}
        <button
          onClick={() => navigate('/scan-passport')}
          className="w-full py-4 bg-white text-primary font-semibold rounded-xl 
                     transition-all duration-200 active:scale-[0.98]
                     shadow-lg shadow-black/20"
        >
          Create an Account
        </button>

        {/* Login Button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-transparent border-2 border-white/30 text-white 
                     font-semibold rounded-xl transition-all duration-200 
                     active:scale-[0.98] active:bg-white/5"
        >
          I Have an Existing Account
        </button>

        {/* Terms */}
        <p className="text-center text-white/40 text-xs pt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthSelectionScreen;
