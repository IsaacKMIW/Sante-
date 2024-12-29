import React from 'react';
import Modal from '../common/Modal';
import PatientDetails from './PatientDetails';
import { PatientBase, PatientMedicalData, PatientAuditLog } from '../../types/patient';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientBase;
  medicalData?: PatientMedicalData;
  auditLogs?: PatientAuditLog[];
  isOriginHospital: boolean;
}

export default function PatientDetailsModal({
  isOpen,
  onClose,
  patient,
  medicalData,
  auditLogs,
  isOriginHospital
}: PatientDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails du patient"
    >
      <PatientDetails
        patient={patient}
        medicalData={medicalData}
        auditLogs={auditLogs}
        isOriginHospital={isOriginHospital}
      />
    </Modal>
  );
}