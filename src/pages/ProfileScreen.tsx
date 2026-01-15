const VerifiedBadge = () => (
  <div className="inline-flex items-center gap-1.5 bg-status-success/15 text-status-success px-3 py-1.5 rounded-full">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <span className="text-xs font-semibold">Verified</span>
  </div>
);

const ProfileScreen = () => {
  const guestData = {
    firstName: 'Alexander',
    lastName: 'Mitchell',
    nationality: 'United States',
    passportId: 'X12345678',
    dateOfBirth: 'March 15, 1988',
    photoUrl: '',
  };

  const stayDetails = {
    building: 'Jasmine Tower',
    unitId: '2803',
    managementCompany: 'Prestige Estates LLC',
    checkIn: 'January 15, 2026',
    checkOut: 'January 20, 2026',
  };

  return (
    <div className="mobile-container min-h-screen bg-primary/[0.02] pb-20">
      {/* Identity Header */}
      <div className="bg-primary px-6 pt-14 pb-8">
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="w-20 aspect-[3/4] bg-surface/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {guestData.photoUrl ? (
              <img src={guestData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          
          {/* Name & Badge */}
          <div className="flex-1 pt-1">
            <h1 className="text-surface text-lg font-semibold tracking-tight">
              {guestData.firstName} {guestData.lastName}
            </h1>
            <div className="mt-2">
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
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Nationality</p>
              <p className="text-primary text-sm font-medium">{guestData.nationality}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Passport ID</p>
              <p className="text-primary text-sm font-medium font-mono">{guestData.passportId}</p>
            </div>
            
            <div className="col-span-2 pt-1">
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Date of Birth</p>
              <p className="text-primary text-sm font-medium">{guestData.dateOfBirth}</p>
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
                <p className="text-primary text-sm font-medium">{stayDetails.building}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Unit ID</p>
                <p className="text-primary text-sm font-medium">{stayDetails.unitId}</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/30 uppercase tracking-wider font-semibold mb-1">Management Company</p>
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

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button className="w-full h-12 bg-primary/[0.03] text-primary rounded-full font-medium text-sm active:bg-primary/[0.06] transition-colors">
            Download Documents
          </button>
          
          <button className="w-full h-12 text-primary/40 rounded-full font-medium text-sm">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
