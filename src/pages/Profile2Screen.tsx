import { useNavigate } from 'react-router-dom';

/**
 * Profile2Screen - Demo profile with fake data
 * Shows when user enters 1111 as OTP code
 * No database connection - all hardcoded for presentations
 */

const VerifiedBadge = () => (
  <div className="inline-flex items-center gap-1.5 bg-status-success/15 text-status-success px-3 py-1.5 rounded-full">
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
    checkIn: 'Jan 16, 2026',
    checkOut: 'Jan 23, 2026',
    email: 'john.doe@example.com',
    phone: '+61 412 345 678',
    managementCompany: 'Paterhaus',
  };

  const handleLogout = () => {
    localStorage.removeItem('guestra_user_id');
    navigate('/auth');
  };

  return (
    <div className="mobile-container min-h-screen bg-primary/[0.02] pb-24">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold text-primary tracking-tight">Guest Profile</h1>
          <VerifiedBadge />
        </div>
        <p className="text-primary/40 text-sm">Verified guest identity</p>
      </div>

      {/* Profile Card */}
      <div className="px-5 space-y-3">
        {/* Personal Information */}
        <div className="bg-surface rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-primary/40 uppercase tracking-wider mb-5">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-primary/40 font-medium mb-1">Full Name</p>
                <p className="text-primary font-semibold text-base">{demoData.firstName} {demoData.lastName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-primary/40 font-medium mb-1">Date of Birth</p>
                <p className="text-primary text-sm">{demoData.dob}</p>
              </div>
              <div>
                <p className="text-[11px] text-primary/40 font-medium mb-1">Gender</p>
                <p className="text-primary text-sm">{demoData.gender}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-primary/40 font-medium mb-1">Nationality</p>
              <p className="text-primary text-sm">{demoData.nationality}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-surface rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-primary/40 uppercase tracking-wider mb-5">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-primary/40 font-medium mb-1">Email Address</p>
              <p className="text-primary text-sm">{demoData.email}</p>
            </div>

            <div>
              <p className="text-[11px] text-primary/40 font-medium mb-1">Phone Number</p>
              <p className="text-primary text-sm">{demoData.phone}</p>
            </div>
          </div>
        </div>

        {/* Passport Details */}
        <div className="bg-surface rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-primary/40 uppercase tracking-wider mb-5">Passport Details</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-primary/40 font-medium mb-1">Passport Number</p>
                <p className="text-primary text-sm font-mono">{demoData.passportNumber}</p>
              </div>
              <div>
                <p className="text-[11px] text-primary/40 font-medium mb-1">Issuing Country</p>
                <p className="text-primary text-sm">{demoData.issuingCountry}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-primary/40 font-medium mb-1">Expiry Date</p>
              <p className="text-primary text-sm">{demoData.expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Stay Details */}
        <div className="bg-surface rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-primary/40 uppercase tracking-wider mb-5">Stay Details</h2>
          
          {/* Building Image */}
          <div className="relative w-full h-32 rounded-xl overflow-hidden mb-5">
            <img 
              src="/act_towers.png" 
              alt="ACT Towers" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <p className="text-white text-sm font-semibold">{demoData.building}</p>
              <p className="text-white/80 text-xs">Unit {demoData.unit}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-primary/40 font-medium mb-1">Check-in</p>
                <p className="text-primary text-sm">{demoData.checkIn}</p>
              </div>
              <div>
                <p className="text-[11px] text-primary/40 font-medium mb-1">Check-out</p>
                <p className="text-primary text-sm">{demoData.checkOut}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-primary/40 font-medium mb-1">Holiday Home Company</p>
              <div className="flex items-center gap-2 mt-2">
                <img 
                  src="/Paterhaus.png" 
                  alt="Paterhaus" 
                  className="w-6 h-6 object-contain"
                />
                <p className="text-primary text-sm font-medium">{demoData.managementCompany}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full h-12 bg-status-error/10 text-status-error rounded-full font-medium text-sm active:bg-status-error/20 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile2Screen;
