import { User } from './index';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'other';
  address: string;
  rfidCardId?: string;
  createdAt: string;
  updatedAt: string;
  lastVisit?: string;
  status: 'active' | 'inactive';
  hospitalId: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  date: string;
  duration: number; // en minutes
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  type: 'consultation' | 'followup' | 'emergency';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
  type: 'chat' | 'announcement';
  hospitalId: string;
}