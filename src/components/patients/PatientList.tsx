import React from 'react';
import { Edit2, Eye, Trash2, Building2 } from 'lucide-react';
import { PatientBase } from '../../types/patient';
import { formatDate } from '../../lib/utils/dateUtils';

interface PatientListProps {
  patients: PatientBase[];
  onEdit: (patient: PatientBase) => void;
  onView: (patient: PatientBase) => void;
  onDelete: (patient: PatientBase) => void;
  currentHospitalId?: string;
}

export default function PatientList({
  patients,
  onEdit,
  onView,
  onDelete,
  currentHospitalId
}: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Aucun patient trouvé
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hôpital d'origine
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {patient.firstName} {patient.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  Né(e) le {formatDate(patient.dateOfBirth)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{patient.email}</div>
                <div className="text-sm text-gray-500">{patient.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <span className={`text-sm ${
                    patient.originHospitalId === currentHospitalId
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-900'
                  }`}>
                    {patient.originHospitalId === currentHospitalId ? 'Cet hôpital' : 'Autre hôpital'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  patient.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {patient.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onView(patient)}
                    className="text-blue-600 hover:text-blue-900"
                    aria-label="Voir le dossier"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {patient.originHospitalId === currentHospitalId && (
                    <>
                      <button
                        onClick={() => onEdit(patient)}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label="Modifier le patient"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(patient)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Supprimer le patient"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}