import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Navigate to auth after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center">
      <h1
        className={`text-surface text-2xl font-bold tracking-[0.3em] transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ fontFamily: '-apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif' }}
      >
        GUESTRA
      </h1>
    </div>
  );
};

export default SplashScreen;
