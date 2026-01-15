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
    <div className="mobile-container bg-primary flex items-center justify-center min-h-screen">
      <h1
        className={`text-surface text-2xl font-bold tracking-widest transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        GUESTRA
      </h1>
    </div>
  );
};

export default SplashScreen;
