export type Role = 'super_admin' | 'admin_hospital' | 'doctor' | 'nurse' | 'receptionist' | 'patient';

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  isFirstLogin?: boolean;
  rfidCardId?: string;
  hospitalId?: string;
  status?: 'active' | 'inactive' | 'suspended';
  hospitalName?: string;
}

export interface AppConfig {
  id: string;
  isInitialized: boolean;
  superAdminCreated: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  userCount?: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  medicalHistory: string[];
  allergies: string[];
  currentTreatments: string[];
  consultationHistory: Consultation[];
}

export interface DashboardStats {
  hospitals: {
    total: number;
    active: number;
    new: number;
  };
  users: {
    total: number;
    byRole: Record<string, number>;
    active: number;
  };
  rfidCards: {
    total: number;
    active: number;
  };
}

export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info';
  message: string;
  createdAt: string;
  status: 'read' | 'unread';
  icon: any;
}
export interface Consultation {
  id: string;
  date: Date;
  doctorId: string;
  hospitalId: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}