export interface RFIDCard {
  id: string;
  uid: string;
  isActive: boolean;
  patientId?: string;
  hospitalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RFIDScanResult {
  success: boolean;
  uid?: string;
  error?: string;
}