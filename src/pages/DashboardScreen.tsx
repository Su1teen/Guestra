import { useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';

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

const DashboardScreen = () => {
  const [qrData, setQrData] = useState(`GUESTRA-PASS-${Date.now()}`);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [rulesSubmitted, setRulesSubmitted] = useState(false);

  const handleRegenerate = useCallback(() => {
    setIsRegenerating(true);
    setTimeout(() => {
      setQrData(`GUESTRA-PASS-${Date.now()}`);
      setIsRegenerating(false);
    }, 500);
  }, []);

  const handleSubmitRules = () => {
    if (agreedToRules) {
      setRulesSubmitted(true);
      setTimeout(() => {
        setIsRulesOpen(false);
      }, 1000);
    }
  };

  return (
    <div className="mobile-container min-h-screen bg-primary/[0.02] pb-20">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <h1 className="text-xl font-semibold text-primary tracking-tight">Security Pass</h1>
        <p className="text-primary/40 text-sm mt-0.5">Show this code at building entry</p>
      </div>

      {/* QR Card */}
      <div className="px-5">
        <div className="bg-surface rounded-3xl p-6 mb-4">
          <div className={`transition-opacity duration-300 ${isRegenerating ? 'opacity-30' : 'opacity-100'} flex flex-col items-center`}>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/5">
              <QRCodeSVG 
                value={qrData}
                size={200}
                fgColor="#050A30"
                bgColor="#FFFFFF"
                level="H"
              />
            </div>
          </div>
          
          <p className="text-center text-[10px] text-primary/25 mt-4 font-mono tracking-wide">
            {qrData.slice(0, 24)}...
          </p>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-full h-12 bg-primary/[0.03] text-primary rounded-full font-medium text-sm disabled:opacity-40 active:bg-primary/[0.06] transition-all"
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Code'}
        </button>

        {/* Status & Rules Row */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Pass Active Card */}
          <div className="bg-surface rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-status-success/10 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-primary text-sm">Pass Active</p>
                <p className="text-primary/40 text-[10px] mt-0.5">
                  Until Jan 20, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Community Rules Card */}
          <button
            onClick={() => setIsRulesOpen(true)}
            className="bg-surface rounded-2xl p-4 text-left active:bg-primary/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/[0.05] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-primary text-sm">Community Rules</p>
                <p className="text-primary/40 text-[10px] mt-0.5">
                  Tap to view
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Community Rules Modal */}
      <SlideUpModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)}>
        <div className="px-6 pb-8">
          <h2 className="text-xl font-semibold text-primary mb-1">Community Rules</h2>
          <p className="text-primary/40 text-sm mb-6">ACT Towers Residential Complex</p>
          
          <div className="space-y-4 text-primary/80 text-sm">
            <div className="bg-primary/[0.02] rounded-xl p-4">
              <h3 className="font-semibold text-primary mb-2">🔇 Noise Restrictions</h3>
              <ul className="space-y-2 text-primary/60">
                <li>• Quiet hours: <strong className="text-primary">10:00 PM - 8:00 AM</strong></li>
                <li>• No loud music or parties after <strong className="text-primary">12:00 AM (midnight)</strong></li>
                <li>• Keep TV/music at reasonable levels at all times</li>
                <li>• Be mindful of neighbors in adjacent units</li>
              </ul>
            </div>

            <div className="bg-primary/[0.02] rounded-xl p-4">
              <h3 className="font-semibold text-primary mb-2">🏊 Pool & Gym</h3>
              <ul className="space-y-2 text-primary/60">
                <li>• Pool hours: <strong className="text-primary">7:00 AM - 10:00 PM</strong></li>
                <li>• Gym hours: <strong className="text-primary">6:00 AM - 11:00 PM</strong></li>
                <li>• Shower before using the pool</li>
                <li>• No glass containers in pool area</li>
              </ul>
            </div>

            <div className="bg-primary/[0.02] rounded-xl p-4">
              <h3 className="font-semibold text-primary mb-2">🚗 Parking</h3>
              <ul className="space-y-2 text-primary/60">
                <li>• Use designated visitor parking only</li>
                <li>• Do not block other vehicles or fire lanes</li>
                <li>• Speed limit in parking: <strong className="text-primary">10 km/h</strong></li>
              </ul>
            </div>

            <div className="bg-primary/[0.02] rounded-xl p-4">
              <h3 className="font-semibold text-primary mb-2">🗑️ Waste Disposal</h3>
              <ul className="space-y-2 text-primary/60">
                <li>• Use designated trash chutes on each floor</li>
                <li>• Separate recyclables when possible</li>
                <li>• No dumping of large items without prior arrangement</li>
              </ul>
            </div>

            <div className="bg-primary/[0.02] rounded-xl p-4">
              <h3 className="font-semibold text-primary mb-2">🐕 Pets</h3>
              <ul className="space-y-2 text-primary/60">
                <li>• Pets must be leashed in common areas</li>
                <li>• Clean up after your pet immediately</li>
                <li>• Pets are not allowed in pool or gym areas</li>
              </ul>
            </div>

            <div className="bg-primary/[0.02] rounded-xl p-4">
              <h3 className="font-semibold text-primary mb-2">🚭 Smoking</h3>
              <ul className="space-y-2 text-primary/60">
                <li>• Smoking is prohibited in all common areas</li>
                <li>• Smoke only in designated areas or private balconies</li>
                <li>• Dispose of cigarette butts properly</li>
              </ul>
            </div>
          </div>

          {/* Agreement Section */}
          <div className="mt-6 pt-4 border-t border-primary/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-primary/20 text-primary focus:ring-primary"
              />
              <span className="text-sm text-primary/70">
                I have read and agree to comply with the Community Rules during my stay at ACT Towers.
              </span>
            </label>

            <button
              onClick={handleSubmitRules}
              disabled={!agreedToRules || rulesSubmitted}
              className={`w-full h-12 rounded-full font-semibold text-[15px] mt-4 transition-all ${
                rulesSubmitted 
                  ? 'bg-status-success text-white'
                  : agreedToRules 
                    ? 'bg-primary text-surface active:scale-[0.98]' 
                    : 'bg-primary/20 text-primary/40 cursor-not-allowed'
              }`}
            >
              {rulesSubmitted ? '✓ Submitted' : 'Submit'}
            </button>
          </div>
        </div>
      </SlideUpModal>
    </div>
  );
};

export default DashboardScreen;
