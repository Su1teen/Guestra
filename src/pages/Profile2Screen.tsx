import { useNavigate } from 'react-router-dom';

/**
 * Profile2Screen - Demo profile with fake data
 * Shows when user enters 1111 as OTP code
 * No database connection - all hardcoded for presentations
 * Design matches ProfileScreen exactly
 */

const VerifiedBadge = () => (
  <div className="inline-flex items-center gap-1.5 bg-surface/20 text-surface px-3 py-1.5 rounded-full border border-surface/30">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <span className="text-xs font-semibold">Verified</span>
  </div>
);

const Profile2Screen = () => {
  const navigate = useNavigate();

  // Fake demo data - John Doe from Australia
  const demoData = {
    firstName: 'John',
    lastName: 'Doe',
    nationality: 'Australian',
    passportNumber: 'N8742951',
    dob: '15.03.1985',
    gender: 'Male',
    expiryDate: '15.03.2030',
    issuingCountry: 'AUSTRALIA',
    building: 'ACT Towers',
    unit: '2803',
    checkIn: 'January 16, 2026',
    checkOut: 'January 23, 2026',
    managementCompany: 'Paterhaus',
  };

  const handleLogout = () => {
    localStorage.removeItem('guestra_user_id');
    navigate('/auth');
  };

  return (
    <div className="mobile-container min-h-screen bg-primary/[0.02] pb-24">
      {/* Identity Header */}
      <div className="bg-primary px-6 pt-14 pb-8">
        <div className="flex items-start gap-4">
          {/* Face Photo - John Doe */}
          <div className="w-28 aspect-[3/4] bg-surface/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-surface/30 shadow-lg">
            <img src="/John Doe.png" alt="John Doe" className="w-full h-full object-cover" />
          </div>
          
          {/* Name & Badge */}
          <div className="flex-1 pt-1">
            <h1 className="text-surface text-xl font-semibold tracking-tight">
              {demoData.firstName} {demoData.lastName}
            </h1>
            <p className="text-surface/50 text-sm mt-0.5">
              {demoData.nationality}
            </p>
            <p className="text-surface/40 text-xs mt-1">
              ID: DEMO
            </p>
            <div className="mt-3">
              <VerifiedBadge />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 space-y-4">
        {/* Personal Information */}
        <div className="bg-surface rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-primary mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">First Name</p>
              <p className="text-primary text-sm font-medium">{demoData.firstName}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Last Name</p>
              <p className="text-primary text-sm font-medium">{demoData.lastName}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Nationality</p>
              <p className="text-primary text-sm font-medium">{demoData.nationality}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Passport No.</p>
              <p className="text-primary text-sm font-medium font-mono">{demoData.passportNumber}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Date of Birth</p>
              <p className="text-primary text-sm font-medium">{demoData.dob}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Gender</p>
              <p className="text-primary text-sm font-medium">{demoData.gender}</p>
            </div>

            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Expiry Date</p>
              <p className="text-primary text-sm font-medium">{demoData.expiryDate}</p>
            </div>

            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Issuing Country</p>
              <p className="text-primary text-sm font-medium">{demoData.issuingCountry}</p>
            </div>
          </div>
        </div>

        {/* Stay Details */}
        <div className="bg-surface rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-primary mb-4">Stay Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Building</p>
                <p className="text-primary text-sm font-medium">{demoData.building}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Unit ID</p>
                <p className="text-primary text-sm font-medium">{demoData.unit}</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Holiday Home Company</p>
              <p className="text-primary text-sm font-medium">{demoData.managementCompany}</p>
            </div>
            
            <div className="h-px bg-primary/5" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Check-in</p>
                <p className="text-primary text-sm font-medium">{demoData.checkIn}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Check-out</p>
                <p className="text-primary text-sm font-medium">{demoData.checkOut}</p>
              </div>
            </div>
          </div>
        </div>

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
            Update Passport
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

export default Profile2Screen;
