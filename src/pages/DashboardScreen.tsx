import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// SVG-based QR Code Component
const QRCode = ({ data }: { data: string }) => {
  // Generate a simple QR-like pattern based on data hash
  const generatePattern = () => {
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern: boolean[][] = [];
    
    for (let i = 0; i < 21; i++) {
      pattern[i] = [];
      for (let j = 0; j < 21; j++) {
        // Position detection patterns (corners)
        const isCorner = (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7);
        const isCornerBorder = isCorner && (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        const isCornerInner = isCorner && i >= 2 && i <= 4 && j >= 2 && j <= 4;
        
        if (isCorner) {
          pattern[i][j] = isCornerBorder || isCornerInner;
        } else {
          // Data pattern based on hash
          pattern[i][j] = ((hash * (i + 1) * (j + 1)) % 7) < 3;
        }
      }
    }
    return pattern;
  };

  const pattern = generatePattern();
  const moduleSize = 10;
  const padding = 20;
  const size = 21 * moduleSize + padding * 2;

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
  const navigate = useNavigate();
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
    <div className="mobile-container min-h-screen bg-primary/5 pb-20">
      {/* Header */}
      <div className="px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-primary font-medium text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>

      {/* Hero QR Card */}
      <div className="px-4 mt-2">
        <div className="card p-5 stable-layout">
          <h2 className="text-center text-base font-medium text-primary mb-1">
            Security Pass
          </h2>
          <p className="text-center text-xs text-primary/60 mb-4">
            Show this code at building entry
          </p>
          
          {/* QR Code Container */}
          <div className={`transition-opacity duration-300 ${isRegenerating ? 'opacity-30' : 'opacity-100'}`}>
            <QRCode data={qrData} />
          </div>
          
          <p className="text-center text-[10px] text-primary/40 mt-4 font-mono">
            {qrData.slice(0, 20)}...
          </p>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-full mt-4 h-10 border border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors disabled:opacity-40"
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>

        {/* Info Card */}
        <div className="card p-4 mt-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-status-success/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-primary text-sm">Pass Active</h3>
              <p className="text-xs text-primary/60 mt-0.5">
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
