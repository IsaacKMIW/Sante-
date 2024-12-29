import { Hospital } from './index';

export interface PatientBase {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'other';
  email?: string;
  phone: string;
  address: string;
  rfidCardId?: string;
  createdAt: string;
  updatedAt: string;
  originHospitalId: string; // ID de l'hôpital qui a créé le compte
  status: 'active' | 'inactive';
}

export interface PatientMedicalData {
  allergies: string[];
  bloodType?: string;
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface PatientAuditLog {
  id: string;
  patientId: string;
  userId: string;
  userRole: string;
  hospitalId: string;
  action: 'create' | 'view' | 'update' | 'delete';
  timestamp: string;
  details?: string;
}

export interface PatientSearchFilters {
  query: string;
  hospitalId?: string;
  isGlobalSearch: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: 'active' | 'inactive';
}