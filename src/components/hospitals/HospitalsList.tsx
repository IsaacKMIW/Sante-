import React, { useState } from 'react';
import { Edit2, Trash2, ToggleLeft } from 'lucide-react';
import { useHospitalsStore } from '../../lib/store/hospitalsStore';
import { Hospital } from '../../types';
import { formatDate } from '../../lib/utils/dateUtils';
import Modal from '../common/Modal';

interface HospitalsListProps {
  searchQuery: string;
  onEdit: (hospital: Hospital) => void;
}

export default function HospitalsList({ searchQuery, onEdit }: HospitalsListProps) {
  const { hospitals, toggleHospitalStatus, deleteHospital } = useHospitalsStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (hospitalId: string) => {
    setShowDeleteConfirm(hospitalId);
  };

  const confirmDelete = async (hospitalId: string) => {
    try {
      await deleteHospital(hospitalId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hôpital
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localisation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateurs
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                État
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredHospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{hospital.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(hospital.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{hospital.userCount || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    hospital.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {hospital.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(hospital)}
                      className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label="Modifier l'hôpital"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleHospitalStatus(hospital.id)}
                      className="text-yellow-600 hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      aria-label={hospital.isActive ? 'Désactiver l\'hôpital' : 'Activer l\'hôpital'}
                    >
                      <ToggleLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hospital.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      aria-label="Supprimer l'hôpital"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteConfirm(null)}
          title="Supprimer l'hôpital"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer cet hôpital ? Cette action est irréversible.
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => showDeleteConfirm && confirmDelete(showDeleteConfirm)}
            >
              Supprimer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}