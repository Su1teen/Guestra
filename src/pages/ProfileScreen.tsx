import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';

// Types matching the exact DB schema
interface PassportDetails {
  id: number;
  first_name: string | null;
  last_name: string | null;
  nationality: string | null;
  passport_number: string | null;
  dob: string | null;
  gender: string | null;
  expiry_date: string | null;
  issuing_country: string | null;
  verification_status: string | null;
  passport_scan_url: string | null;
  face_photo_url: string | null;
  selfie_verification_url: string | null;
  mrz_1: string | null;
  mrz_2: string | null;
  signature: string | null;
}

/**
 * Get public URL for storage path
 */
const getStorageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
};

const VerifiedBadge = () => (
  <div className="inline-flex items-center gap-1.5 bg-status-success/15 text-status-success px-3 py-1.5 rounded-full">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <span className="text-xs font-semibold">Verified</span>
  </div>
);

const PendingBadge = () => (
  <div className="inline-flex items-center gap-1.5 bg-status-warning/15 text-status-warning px-3 py-1.5 rounded-full">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <span className="text-xs font-semibold">Pending</span>
  </div>
);

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [passportData, setPassportData] = useState<PassportDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPassportData();
  }, []);

  const fetchPassportData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching from Supabase...');
      
      // Fetch all rows to debug
      const { data, error: fetchError, count } = await supabase
        .from('passport_details')
        .select('*', { count: 'exact' });
      
      console.log('Supabase response:', { data, error: fetchError, count });
      
      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(fetchError.message);
      } else if (data && data.length > 0) {
        console.log('Found data:', data[0]);
        setPassportData(data[0]);
      } else {
        console.log('No data found in table');
        setPassportData(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('guestra_user_id');
    navigate('/auth');
  };

  // Get image URLs from storage
  const facePhotoUrl = getStorageUrl(passportData?.face_photo_url);
  const signatureUrl = getStorageUrl(passportData?.signature);
  const passportScanUrl = getStorageUrl(passportData?.passport_scan_url);

  const stayDetails = {
    building: 'ACT Towers',
    unitId: '2803',
    managementCompany: 'Paterhaus',
    checkIn: 'January 15, 2026',
    checkOut: 'January 20, 2026',
    buildingImage: '/act_towers.png',
  };

  if (loading) {
    return (
      <div className="mobile-container min-h-screen bg-primary/[0.02] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary/15 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary/40 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-container min-h-screen bg-primary/[0.02] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-status-error/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-primary font-semibold mb-2">Connection Error</h3>
          <p className="text-primary/40 text-sm mb-4">{error}</p>
          <button
            onClick={fetchPassportData}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-primary/[0.02] pb-24">
      {/* Identity Header */}
      <div className="bg-primary px-6 pt-14 pb-8">
        <div className="flex items-start gap-4">
          {/* Face Photo - 3x4 Aspect Ratio */}
          <div className="w-28 aspect-[3/4] bg-surface/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-surface/30 shadow-lg">
            {facePhotoUrl ? (
              <img src={facePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          
          {/* Name & Badge */}
          <div className="flex-1 pt-1">
            <h1 className="text-surface text-xl font-semibold tracking-tight">
              {passportData?.first_name && passportData?.last_name 
                ? `${passportData.first_name} ${passportData.last_name}`
                : 'Guest User'}
            </h1>
            <p className="text-surface/50 text-sm mt-0.5">
              {passportData?.nationality || 'Nationality not set'}
            </p>
            <p className="text-surface/40 text-xs mt-1">
              ID: {passportData?.id || '—'}
            </p>
            <div className="mt-3">
              {passportData?.verification_status === 'verified' ? (
                <VerifiedBadge />
              ) : passportData?.verification_status === 'pending' ? (
                <PendingBadge />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 space-y-4">
        {/* No Passport Data - Prompt to Scan */}
        {!passportData && (
          <div className="bg-surface rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/[0.05] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#050A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="13" y2="12" />
                <rect x="14" y="10" width="3" height="4" rx="0.5" />
              </svg>
            </div>
            <h3 className="text-primary font-semibold mb-2">Verify Your Identity</h3>
            <p className="text-primary/40 text-sm mb-5">
              Scan your passport to complete verification
            </p>
            <button
              onClick={() => navigate('/scan-passport')}
              className="h-12 bg-primary text-surface px-8 rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform"
            >
              Scan Passport
            </button>
          </div>
        )}

        {/* Personal Information */}
        {passportData && (
          <div className="bg-surface rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">First Name</p>
                <p className="text-primary text-sm font-medium">{passportData.first_name || '—'}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Last Name</p>
                <p className="text-primary text-sm font-medium">{passportData.last_name || '—'}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Nationality</p>
                <p className="text-primary text-sm font-medium">{passportData.nationality || '—'}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Passport No.</p>
                <p className="text-primary text-sm font-medium font-mono">{passportData.passport_number || '—'}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Date of Birth</p>
                <p className="text-primary text-sm font-medium">{passportData.dob || '—'}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Gender</p>
                <p className="text-primary text-sm font-medium">{passportData.gender || '—'}</p>
              </div>

              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Expiry Date</p>
                <p className="text-primary text-sm font-medium">{passportData.expiry_date || '—'}</p>
              </div>

              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Issuing Country</p>
                <p className="text-primary text-sm font-medium">{passportData.issuing_country || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Signature */}
        {signatureUrl && (
          <div className="bg-surface rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-4">Signature</h2>
            <div className="bg-primary/[0.02] rounded-xl p-4 flex items-center justify-center">
              <img 
                src={signatureUrl || undefined} 
                alt="Signature" 
                className="max-h-16 object-contain"
              />
            </div>
          </div>
        )}

        {/* Stay Details */}
        <div className="bg-surface rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-primary mb-4">Stay Details</h2>
          
          {/* Building Image */}
          <div className="rounded-xl overflow-hidden mb-4 border border-primary/5">
            <img 
              src={stayDetails.buildingImage} 
              alt={stayDetails.building} 
              className="w-full h-32 object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Building</p>
                <p className="text-primary text-sm font-medium">{stayDetails.building}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Unit ID</p>
                <p className="text-primary text-sm font-medium">{stayDetails.unitId}</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Holiday Home Company</p>
              <p className="text-primary text-sm font-medium">{stayDetails.managementCompany}</p>
            </div>
            
            <div className="h-px bg-primary/5" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Check-in</p>
                <p className="text-primary text-sm font-medium">{stayDetails.checkIn}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Check-out</p>
                <p className="text-primary text-sm font-medium">{stayDetails.checkOut}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Scan Preview */}
        {passportScanUrl && (
          <div className="bg-surface rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-primary mb-4">Document Scan</h2>
            <div className="rounded-xl overflow-hidden border border-primary/5">
              <img 
                src={passportScanUrl} 
                alt="Passport Scan" 
                className="w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={() => navigate('/verify')}
            className="w-full h-14 bg-primary text-surface rounded-full font-semibold text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Scan Access
          </button>
          
          <button 
            onClick={() => navigate('/scan-passport')}
            className="w-full h-12 bg-primary/[0.03] text-primary rounded-full font-medium text-sm active:bg-primary/[0.06] transition-colors"
          >
            {passportData ? 'Update Passport' : 'Scan Passport'}
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full h-12 text-status-error/80 rounded-full font-medium text-sm active:bg-status-error/5 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
