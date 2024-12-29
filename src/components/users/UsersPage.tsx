import React, { useState, useEffect } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import DashboardHeader from '../dashboard/DashboardHeader';
import Sidebar from '../dashboard/Sidebar';
import UsersList from './UsersList';
import UserModal from './UserModal';
import SearchBar from '../common/SearchBar';
import HeartSpinner from '../common/HeartSpinner';
import { useUsersStore } from '../../lib/store/usersStore';
import { useHospitalsStore } from '../../lib/store/hospitalsStore';
import { useAuthStore } from '../../lib/store/authStore';
import { User } from '../../types';

export default function UsersPage() {
  const { user } = useAuthStore();
  const { loading, fetchUsers } = useUsersStore();
  const { hospitals, fetchHospitals } = useHospitalsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    hospital: ''
  });

  useEffect(() => {
    // Fetch initial data
    fetchUsers();
    fetchHospitals();
  }, [fetchUsers, fetchHospitals]);

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user || null);
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
                  <Users className="h-6 w-6 mr-2" />
                  Gestion des Utilisateurs
                </h1>
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Ajouter un utilisateur"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Rechercher un utilisateur..."
                  icon={Search}
                />
                <div className="flex flex-wrap gap-4">
                  <select
                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  >
                    <option value="">Tous les rôles</option>
                    <option value="admin_hospital">Admin d'hôpital</option>
                    <option value="doctor">Médecin(e)</option>
                    <option value="nurse">Infirmier(ère)</option>
                    <option value="receptionist">Réceptionniste</option>
                  </select>
                  <select
                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                  <select
                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={filters.hospital}
                    onChange={(e) => setFilters({ ...filters, hospital: e.target.value })}
                  >
                    <option value="">Tous les hôpitaux</option>
                    {hospitals
                      .filter(hospital => hospital.isActive)
                      .map((hospital) => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <UsersList
              searchQuery={searchQuery}
              filters={filters}
              onEdit={handleOpenModal}
            />

            {isModalOpen && (
              <UserModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}