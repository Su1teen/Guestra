import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNavbar from './components/BottomNavbar';
import SplashScreen from './pages/SplashScreen';
import AuthScreen from './pages/AuthScreen';
import DashboardScreen from './pages/DashboardScreen';
import MobileKeyScreen from './pages/MobileKeyScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/key" element={<MobileKeyScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNavbar />
    </BrowserRouter>
  );
}

export default App;
