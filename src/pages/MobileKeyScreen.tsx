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
      <div 
        className="absolute inset-0 bg-primary/60 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full bg-surface rounded-t-3xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface pt-3 pb-2">
          <div className="w-10 h-1 bg-primary/10 rounded-full mx-auto" />
        </div>
        {children}
      </div>
    </div>
  );
};

const MobileKeyScreen = () => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestPhone, setGuestPhone] = useState('');

  const unitInfo = {
    building: 'ACT Towers',
    unit: '2803',
    pin: '284719',
    wifiName: 'ACTTowers_2803',
    wifiPassword: 'Welcome2803!',
    holidayHomeCompany: 'Paterhaus',
    holidayHomeLogo: '/Paterhaus.png',
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
      {/* Hero Header with Building Image */}
      <div className="relative">
        {/* Building Image Background */}
        <div className="h-44 overflow-hidden">
          <img 
            src="/act_towers.png" 
            alt="ACT Towers" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-primary" />
        </div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-surface text-2xl font-bold tracking-tight">{unitInfo.building}</h1>
              <p className="text-surface/70 text-sm mt-0.5">Unit {unitInfo.unit}</p>
            </div>

          </div>
        </div>
      </div>

      {/* Unlock Button */}
      <div className="flex flex-col items-center py-8">
        <button
          onClick={handleUnlock}
          disabled={isUnlocking}
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
            unlockSuccess 
              ? 'bg-status-success/10' 
              : isUnlocking 
                ? 'bg-primary/[0.03]' 
                : 'bg-primary/[0.03] active:bg-primary/[0.06]'
          }`}
        >
          {unlockSuccess ? (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-status-success font-semibold mt-2 text-xs">UNLOCKED</span>
            </>
          ) : isUnlocking ? (
            <>
              <div className="w-8 h-8 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
              <span className="text-primary/40 font-medium mt-2 text-xs">UNLOCKING</span>
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-primary font-semibold mt-2 text-[10px] tracking-wide">PRESS TO</span>
              <span className="text-primary font-semibold text-[10px] tracking-wide">UNLOCK</span>
            </>
          )}
        </button>
      </div>

      {/* Info Cards */}
      <div className="px-5 space-y-3">
        {/* Bluetooth & PIN Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Bluetooth Card */}
          <div className="bg-primary/[0.02] rounded-2xl p-4">
            <div className="w-10 h-10 rounded-full bg-primary/[0.05] flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
              </svg>
            </div>
            <p className="font-semibold text-primary text-sm">Bluetooth</p>
            <p className="text-status-success text-xs mt-0.5">Connected</p>
          </div>

          {/* PIN Card */}
          <div className="bg-primary/[0.02] rounded-2xl p-4">
            <div className="w-10 h-10 rounded-full bg-primary/[0.05] flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="4" height="4" rx="1" />
                <rect x="10" y="4" width="4" height="4" rx="1" />
                <rect x="16" y="4" width="4" height="4" rx="1" />
                <rect x="4" y="10" width="4" height="4" rx="1" />
                <rect x="10" y="10" width="4" height="4" rx="1" />
                <rect x="16" y="10" width="4" height="4" rx="1" />
                <rect x="10" y="16" width="4" height="4" rx="1" />
              </svg>
            </div>
            <p className="font-semibold text-primary text-sm">Door PIN</p>
            <p className="text-primary font-mono text-lg mt-0.5">{unitInfo.pin}</p>
          </div>
        </div>

        {/* Wi-Fi & Holiday Home Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Wi-Fi Card */}
          <button 
            onClick={() => copyToClipboard(unitInfo.wifiPassword, 'wifi')}
            className="bg-primary/[0.02] rounded-2xl p-4 text-left active:bg-primary/[0.04] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/[0.05] flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>
            <p className="font-semibold text-primary text-sm">Wi-Fi</p>
            <p className="text-primary/40 text-[10px] mt-0.5 truncate">{unitInfo.wifiName}</p>
            <p className="text-primary font-mono text-xs mt-1">{unitInfo.wifiPassword}</p>
            <span className={`text-[10px] font-medium mt-2 block ${copied === 'wifi' ? 'text-status-success' : 'text-primary/25'}`}>
              {copied === 'wifi' ? 'Copied!' : 'Tap to copy'}
            </span>
          </button>

          {/* Holiday Home Company Card */}
          <div className="bg-primary/[0.02] rounded-2xl p-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 overflow-hidden">
              <img 
                src={unitInfo.holidayHomeLogo} 
                alt="Paterhaus" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <p className="font-semibold text-primary text-sm">Holiday Home</p>
            <p className="text-primary/60 text-xs mt-0.5">{unitInfo.holidayHomeCompany}</p>
          </div>
        </div>

        {/* Guest Access Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-14 bg-primary/[0.02] text-primary rounded-2xl font-medium text-sm flex items-center justify-center gap-2 active:bg-primary/[0.04] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Add Guest / Shared Access
        </button>
      </div>

      {/* Guest Access Modal */}
      <SlideUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="px-6 pb-8">
          <h2 className="text-xl font-semibold text-primary mb-1">Share Access</h2>
          <p className="text-primary/40 text-sm mb-6">Invite a guest to access your unit</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-primary/40 mb-2 uppercase tracking-wider">Guest Phone Number</label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full h-14 px-4 bg-primary/[0.03] border-0 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-base"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-semibold text-primary/40 mb-2 uppercase tracking-wider">Access Duration</label>
              <select className="w-full h-14 px-4 bg-primary/[0.03] border-0 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-base appearance-none">
                <option>24 Hours</option>
                <option>3 Days</option>
                <option>1 Week</option>
                <option>Full Stay</option>
              </select>
            </div>

            <button className="w-full h-12 bg-primary text-surface rounded-full font-semibold text-[15px] mt-2 active:scale-[0.98] transition-transform">
              Send Invitation
            </button>
          </div>
        </div>
      </SlideUpModal>
    </div>
  );
};

export default MobileKeyScreen;
