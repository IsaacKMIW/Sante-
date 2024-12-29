import React, { useState, useEffect } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import ReceptionistLayout from '../layout/ReceptionistLayout';
import PatientsList from './PatientsList';
import PatientModal from './PatientModal';
import SearchBar from '../../common/SearchBar';
import { useReceptionistStore } from '../../../lib/store/receptionistStore';
import HeartSpinner from '../../common/HeartSpinner';

export default function PatientsPage() {
  const { initialize, cleanup, loading } = useReceptionistStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);

  if (loading) {
    return (
      <ReceptionistLayout>
        <div className="flex justify-center items-center h-64">
          <HeartSpinner size="lg" />
        </div>
      </ReceptionistLayout>
    );
  }

  return (
    <ReceptionistLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Gestion des Patients
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Patient
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un patient..."
                icon={Search}
              />
            </div>

            <PatientsList searchQuery={searchQuery} />
          </div>
        </div>

        {isModalOpen && (
          <PatientModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </ReceptionistLayout>
  );
}