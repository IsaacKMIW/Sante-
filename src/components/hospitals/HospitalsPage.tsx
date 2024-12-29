import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import DashboardHeader from '../dashboard/DashboardHeader';
import Sidebar from '../dashboard/Sidebar';
import HospitalsList from './HospitalsList';
import HospitalModal from './HospitalModal';
import SearchBar from '../common/SearchBar';
import HeartSpinner from '../common/HeartSpinner';
import { Hospital } from '../../types';
import { useHospitalsStore } from '../../lib/store/hospitalsStore';
import { useAuthStore } from '../../lib/store/authStore';

export default function HospitalsPage() {
  const { user } = useAuthStore();
  const { loading, fetchHospitals } = useHospitalsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Charger les données si elles ne sont pas déjà chargées
    fetchHospitals();
  }, [fetchHospitals]);

  const handleOpenModal = (hospital?: Hospital) => {
    setSelectedHospital(hospital || null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HeartSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Building2 className="h-6 w-6 mr-2" />
                  Gestion des Hôpitaux
                </h1>
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Ajouter un hôpital"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un hôpital
                </button>
              </div>

              <div className="mt-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Rechercher un hôpital..."
                  icon={Search}
                />
              </div>
            </div>

            <HospitalsList
              searchQuery={searchQuery}
              onEdit={handleOpenModal}
            />

            {isModalOpen && (
              <HospitalModal
                hospital={selectedHospital}
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedHospital(null);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}