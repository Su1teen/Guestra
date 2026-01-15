import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlideUpModal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/50 animate-fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-[390px] max-w-full bg-surface rounded-t-card animate-slide-up max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface p-4 border-b border-primary/10">
          <div className="w-12 h-1 bg-primary/20 rounded-full mx-auto mb-4" />
        </div>
        {children}
      </div>
    </div>
  );
};

const BluetoothIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
  </svg>
);

const KeypadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="4" height="4" rx="1" />
    <rect x="10" y="4" width="4" height="4" rx="1" />
    <rect x="16" y="4" width="4" height="4" rx="1" />
    <rect x="4" y="10" width="4" height="4" rx="1" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <rect x="16" y="10" width="4" height="4" rx="1" />
    <rect x="4" y="16" width="4" height="4" rx="1" />
    <rect x="10" y="16" width="4" height="4" rx="1" />
    <rect x="16" y="16" width="4" height="4" rx="1" />
  </svg>
);

const WifiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MobileKeyScreen = () => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestPhone, setGuestPhone] = useState('');

  const unitInfo = {
    building: 'Jasmine Tower',
    unit: '2803',
    pin: '284719',
    wifiName: 'JasmineTower_2803',
    wifiPassword: 'Welcome2803!',
  };

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setUnlockSuccess(true);
      setTimeout(() => setUnlockSuccess(false), 2000);
    }, 1500);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mobile-container min-h-screen bg-surface pb-20">
      {/* Header */}
      <div className="bg-primary px-5 py-5">
        <h1 className="text-surface text-lg font-bold">{unitInfo.building}</h1>
        <p className="text-surface/80 text-sm">Unit {unitInfo.unit}</p>
      </div>

      {/* Unlock Button */}
      <div className="flex flex-col items-center py-6">
        <button
          onClick={handleUnlock}
          disabled={isUnlocking}
          className={`w-28 h-28 rounded-full border-3 flex flex-col items-center justify-center transition-all active:scale-95 ${
            unlockSuccess 
              ? 'border-status-success bg-status-success/10' 
              : isUnlocking 
                ? 'border-primary/30 bg-primary/5' 
                : 'border-primary bg-surface hover:bg-primary/5'
          }`}
        >
          {unlockSuccess ? (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-status-success font-medium mt-1 text-xs">UNLOCKED</span>
            </>
          ) : isUnlocking ? (
            <>
              <div className="w-7 h-7 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-primary/60 font-medium mt-1 text-xs">UNLOCKING</span>
            </>
          ) : (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-primary font-bold mt-1 text-[10px]">PRESS TO</span>
              <span className="text-primary font-bold text-[10px]">UNLOCK</span>
            </>
          )}
        </button>
      </div>

      {/* Bento Grid */}
      <div className="px-4 space-y-2.5">
        {/* Bluetooth & PIN Row */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Bluetooth Card */}
          <div className="card-interactive border border-primary/10 p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <BluetoothIcon />
              </div>
              <div>
                <h3 className="font-medium text-primary text-xs">Bluetooth</h3>
                <p className="text-[10px] text-status-success">Connected</p>
              </div>
            </div>
          </div>

          {/* PIN Card */}
          <div className="card-interactive border border-primary/10 p-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <KeypadIcon />
              </div>
              <div>
                <h3 className="font-medium text-primary text-xs">Door PIN</h3>
                <p className="text-sm font-mono font-bold text-primary">{unitInfo.pin}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wi-Fi Card */}
        <button 
          onClick={() => copyToClipboard(unitInfo.wifiPassword, 'wifi')}
          className="card-interactive border border-primary/10 p-3 w-full text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <WifiIcon />
              </div>
              <div>
                <h3 className="font-medium text-primary text-xs">Wi-Fi Credentials</h3>
                <p className="text-[10px] text-primary/60">{unitInfo.wifiName}</p>
                <p className="text-xs font-mono text-primary">{unitInfo.wifiPassword}</p>
              </div>
            </div>
            <span className={`text-[10px] font-medium transition-colors ${copied === 'wifi' ? 'text-status-success' : 'text-primary/40'}`}>
              {copied === 'wifi' ? 'Copied!' : 'Copy'}
            </span>
          </div>
        </button>

        {/* Guest Access Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-10 border border-primary text-primary rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
        >
          <UsersIcon />
          Add Guest / Shared Access
        </button>
      </div>

      {/* Guest Access Modal */}
      <SlideUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-5">
          <h2 className="text-lg font-bold text-primary mb-1">Share Access</h2>
          <p className="text-primary/60 text-sm mb-4">Invite a guest to access your unit</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-primary mb-1.5">Guest Phone Number</label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full h-11 px-3 border border-primary/10 rounded-lg focus:border-primary focus:outline-none text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-primary mb-1.5">Access Duration</label>
              <select className="w-full h-11 px-3 border border-primary/10 rounded-lg focus:border-primary focus:outline-none bg-surface text-sm">
                <option>24 Hours</option>
                <option>3 Days</option>
                <option>1 Week</option>
                <option>Full Stay</option>
              </select>
            </div>

            <button className="w-full h-10 bg-primary text-surface rounded-lg font-medium text-sm mt-3">
              Send Invitation
            </button>
          </div>
        </div>
      </SlideUpModal>
    </div>
  );
};

export default MobileKeyScreen;
