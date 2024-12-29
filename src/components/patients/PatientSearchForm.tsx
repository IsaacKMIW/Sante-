import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { PatientSearchFilters } from '../../types/patient';

interface PatientSearchFormProps {
  onSearch: (filters: PatientSearchFilters) => void;
  isGlobalSearchEnabled?: boolean;
  currentHospitalId?: string;
}

export default function PatientSearchForm({
  onSearch,
  isGlobalSearchEnabled = false,
  currentHospitalId
}: PatientSearchFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<PatientSearchFilters>({
    query: '',
    hospitalId: currentHospitalId,
    isGlobalSearch: false,
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleInputChange}
            placeholder="Rechercher un patient..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Filtres avancés"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {isGlobalSearchEnabled && (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isGlobalSearch"
                  checked={filters.isGlobalSearch}
                  onChange={handleInputChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Recherche globale
                </span>
              </label>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Statut
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de début
            </label>
            <input
              type="date"
              name="dateRange.start"
              value={filters.dateRange?.start || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de fin
            </label>
            <input
              type="date"
              name="dateRange.end"
              value={filters.dateRange?.end || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}