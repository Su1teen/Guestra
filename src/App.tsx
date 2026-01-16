import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BottomNavbar from './components/BottomNavbar';
import SplashScreen from './pages/SplashScreen';
import AuthSelectionScreen from './pages/AuthSelectionScreen';
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import MobileKeyScreen from './pages/MobileKeyScreen';
import ProfileScreen from './pages/ProfileScreen';
import PassportScanner from './pages/PassportScanner';
import VerificationScreen from './pages/VerificationScreen';

function AppContent() {
  const location = useLocation();
  
  // Hide navbar on auth-related screens
  const hideNavbar = ['/auth', '/login', '/verify', '/scan-passport', '/'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthSelectionScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/verify" element={<VerificationScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/key" element={<MobileKeyScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/scan-passport" element={<PassportScanner />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideNavbar && <BottomNavbar />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
