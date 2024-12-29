import React, { useState } from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useUsersStore } from '../../lib/store/usersStore';
import { User } from '../../types';
import { formatDate } from '../../lib/utils/dateUtils';
import Modal from '../common/Modal';

interface UsersListProps {
  searchQuery: string;
  filters: {
    role: string;
    status: string;
    hospital: string;
  };
  onEdit: (user: User) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
  };

  const statusText = {
    active: 'Actif',
    inactive: 'Inactif',
    suspended: 'Suspendu',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      statusStyles[status as keyof typeof statusStyles]
    }`}>
      {statusText[status as keyof typeof statusText]}
    </span>
  );
};

export default function UsersList({ searchQuery, filters, onEdit }: UsersListProps) {
  const { users, deleteUser } = useUsersStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.hospitalName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || (user.status || 'active') === filters.status;
    const matchesHospital = !filters.hospital || user.hospitalId === filters.hospital;

    return matchesSearch && matchesRole && matchesStatus && matchesHospital;
  });

  const handleDelete = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const confirmDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression complète:', error);
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de la suppression de l\'utilisateur. Veuillez réessayer.');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  if (filteredUsers.length === 0) {
    return (
      <div className="bg-white p-8 text-center rounded-lg shadow">
        <p className="text-gray-500">Aucun utilisateur trouvé pour cet hôpital</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hôpital
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={`user-row-${user.id}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.role === 'admin_hospital' && 'Admin d\'hôpital'}
                    {user.role === 'doctor' && 'Médecin(e)'}
                    {user.role === 'nurse' && 'Infirmier(ère)'}
                    {user.role === 'receptionist' && 'Réceptionniste'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.hospitalName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status || 'active'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label="Modifier l'utilisateur"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Supprimer l'utilisateur"
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
          title="Supprimer l'utilisateur"
        >
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
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