const VerifiedBadge = () => (
  <div className="flex items-center gap-1 bg-status-success/10 text-status-success px-2 py-1 rounded-interactive">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <span className="text-xs font-medium">Verified</span>
  </div>
);

const ProfileScreen = () => {
  const guestData = {
    firstName: 'Alexander',
    lastName: 'Mitchell',
    nationality: 'United States',
    passportId: 'X12345678',
    dateOfBirth: 'March 15, 1988',
    photoUrl: '', // Placeholder
  };

  const stayDetails = {
    building: 'Jasmine Tower',
    unitId: '2803',
    managementCompany: 'Prestige Estates LLC',
    checkIn: 'January 15, 2026',
    checkOut: 'January 20, 2026',
  };

  return (
    <div className="mobile-container min-h-screen bg-primary/5 pb-20">
      {/* Identity Header */}
      <div className="bg-primary px-4 py-5">
        <div className="flex items-start gap-3">
          {/* Photo */}
          <div className="w-16 aspect-[3/4] bg-surface/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {guestData.photoUrl ? (
              <img src={guestData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          
          {/* Name & Badge */}
          <div className="flex-1">
            <h1 className="text-surface text-base font-bold">
              {guestData.firstName} {guestData.lastName}
            </h1>
            <div className="mt-1.5">
              <VerifiedBadge />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {/* Personal Information Grid */}
        <div className="card p-4">
          <h2 className="text-sm font-bold text-primary mb-3">Personal Information</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Nationality</p>
              <p className="text-primary text-sm font-medium">{guestData.nationality}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Passport ID</p>
              <p className="text-primary text-sm font-medium font-mono">{guestData.passportId}</p>
            </div>
            
            <div className="col-span-2">
              <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Date of Birth</p>
              <p className="text-primary text-sm font-medium">{guestData.dateOfBirth}</p>
            </div>
          </div>
        </div>

        {/* Stay Details Card */}
        <div className="card p-4">
          <h2 className="text-sm font-bold text-primary mb-3">Stay Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Building</p>
                <p className="text-primary text-sm font-medium">{stayDetails.building}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Unit ID</p>
                <p className="text-primary text-sm font-medium">{stayDetails.unitId}</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Management Company</p>
              <p className="text-primary text-sm font-medium">{stayDetails.managementCompany}</p>
            </div>
            
            <div className="h-px bg-primary/10" />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Check-in</p>
                <p className="text-primary text-sm font-medium">{stayDetails.checkIn}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-primary/40 uppercase tracking-wide mb-0.5">Check-out</p>
                <p className="text-primary text-sm font-medium">{stayDetails.checkOut}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button className="w-full h-10 border border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors">
            Download Documents
          </button>
          
          <button className="w-full h-10 border border-primary/20 text-primary/60 rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
