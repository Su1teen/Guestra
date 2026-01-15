import { useState, useCallback } from 'react';

// SVG-based QR Code Component
const QRCode = ({ data }: { data: string }) => {
  const generatePattern = () => {
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern: boolean[][] = [];
    
    for (let i = 0; i < 25; i++) {
      pattern[i] = [];
      for (let j = 0; j < 25; j++) {
        // Position detection patterns (corners)
        const isTopLeft = i < 7 && j < 7;
        const isTopRight = i < 7 && j > 17;
        const isBottomLeft = i > 17 && j < 7;
        const isCorner = isTopLeft || isTopRight || isBottomLeft;
        
        if (isCorner) {
          const ci = isTopLeft ? i : isTopRight ? i : i - 18;
          const cj = isTopLeft ? j : isTopRight ? j - 18 : j;
          const isBorder = ci === 0 || ci === 6 || cj === 0 || cj === 6;
          const isInner = ci >= 2 && ci <= 4 && cj >= 2 && cj <= 4;
          pattern[i][j] = isBorder || isInner;
        } else {
          pattern[i][j] = ((hash * (i + 1) * (j + 1)) % 5) < 2;
        }
      }
    }
    return pattern;
  };

  const pattern = generatePattern();
  const moduleSize = 8;
  const padding = 16;
  const size = 25 * moduleSize + padding * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <rect x="0" y="0" width={size} height={size} fill="white" />
      {pattern.map((row, i) =>
        row.map((cell, j) =>
          cell ? (
            <rect
              key={`${i}-${j}`}
              x={padding + j * moduleSize}
              y={padding + i * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#050A30"
            />
          ) : null
        )
      )}
    </svg>
  );
};

const DashboardScreen = () => {
  const [qrData, setQrData] = useState(`GUESTRA-PASS-${Date.now()}`);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = useCallback(() => {
    setIsRegenerating(true);
    setTimeout(() => {
      setQrData(`GUESTRA-PASS-${Date.now()}`);
      setIsRegenerating(false);
    }, 500);
  }, []);

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
          <div className={`transition-opacity duration-300 ${isRegenerating ? 'opacity-30' : 'opacity-100'}`}>
            <QRCode data={qrData} />
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

        {/* Status Card */}
        <div className="bg-surface rounded-2xl p-5 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-status-success/10 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-primary text-sm">Pass Active</p>
              <p className="text-primary/40 text-xs mt-0.5">
                Valid until checkout on January 20, 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
