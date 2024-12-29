import React, { useState, useEffect } from 'react';
import { useUsersStore } from '../../lib/store/usersStore';
import { useHospitalsStore } from '../../lib/store/hospitalsStore';
import { User } from '../../types';
import { validateHospitalStatus, validateUserData } from '../../lib/services/users';
import Modal from '../common/Modal';
import PasswordInput from '../common/PasswordInput';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserModal({ user, isOpen, onClose }: UserModalProps) {
  const { addUser, updateUser } = useUsersStore();
  const { hospitals } = useHospitalsStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    hospitalId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        role: user.role,
        hospitalId: user.hospitalId || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let success = false;
    setLoading(true);

    try {
      await validateUserData({
        ...formData,
        id: user?.id
      });

      // Trouver le nom de l'hôpital sélectionné
      const selectedHospital = hospitals.find(h => h.id === formData.hospitalId);
      if (!selectedHospital) {
        setError('Hôpital invalide');
        setLoading(false);
        return;
      }

      // Vérifier que l'hôpital est valide et actif
      await validateHospitalStatus(formData.hospitalId);

      try {
        if (user) {
          await updateUser(user.id, {
            ...formData,
            hospitalName: selectedHospital.name,
            updatedAt: new Date().toISOString()
          });
        } else {
          await addUser({
            ...formData,
            hospitalName: selectedHospital.name,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        success = true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(errorMessage);
        console.error('Erreur lors de la soumission:', errorMessage);
      } finally {
        setLoading(false);
        if (success) {
          onClose();
        }
      }
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : 'Erreur de validation');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {!user && (
          <PasswordInput
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            label="Mot de passe"
          />
        )}

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionner un rôle</option>
            <option value="admin_hospital">Admin d'hôpital</option>
            <option value="doctor">Médecin(e)</option>
            <option value="nurse">Infirmier(ère)</option>
            <option value="receptionist">Réceptionniste</option>
          </select>
        </div>

        <div>
          <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700">
            Hôpital
          </label>
          <select
            id="hospitalId"
            name="hospitalId"
            value={formData.hospitalId}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionner un hôpital</option>
            {hospitals
              .filter(hospital => hospital.isActive)
              .map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
          {formData.hospitalId && (
            <p className="mt-1 text-sm text-gray-500">
              L'utilisateur sera rattaché à cet hôpital et pourra accéder à ses données
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Chargement...' : user ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
}