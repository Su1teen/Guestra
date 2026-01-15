import { useNavigate, useLocation } from 'react-router-dom';
import { useScrollDirection } from '../hooks/useScrollDirection';

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const QRIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="14" y="14" width="3" height="3"/>
    <rect x="18" y="14" width="3" height="3"/>
    <rect x="14" y="18" width="3" height="3"/>
    <rect x="18" y="18" width="3" height="3"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollDirection = useScrollDirection();

  const tabs = [
    { id: 'key', path: '/key', icon: LockIcon, label: 'Mobile Key' },
    { id: 'dashboard', path: '/dashboard', icon: QRIcon, label: 'Security Pass' },
    { id: 'profile', path: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Hide navbar on splash and auth screens
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null;
  }

  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-surface border-t border-primary/10 z-50 transition-transform duration-300 ${
        scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex justify-around items-center h-14 px-4 safe-area-pb">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
                isActive(tab.path) ? 'text-primary' : 'text-primary/40'
              }`}
              aria-label={tab.label}
            >
              <Icon />
              <span className="text-[9px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
