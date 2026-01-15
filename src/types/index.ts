// Guest Management Types
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  passportId: string;
  dateOfBirth: string;
  photoUrl: string;
  isVerified: boolean;
}

export interface Booking {
  id: string;
  guestId: string;
  unitId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Unit {
  id: string;
  buildingName: string;
  unitNumber: string;
  floor: number;
  managementCompany: string;
  wifiName: string;
  wifiPassword: string;
  doorPin: string;
  bluetoothEnabled: boolean;
}

export interface StayDetails {
  building: string;
  unitId: string;
  managementCompany: string;
  checkIn: string;
  checkOut: string;
}

export interface NavigationTab {
  id: string;
  label: string;
  path: string;
  icon: 'key' | 'qr' | 'user';
}

export interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
