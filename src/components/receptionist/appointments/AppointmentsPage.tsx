import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Search } from 'lucide-react';
import ReceptionistLayout from '../layout/ReceptionistLayout';
import AppointmentsList from './AppointmentsList';
import AppointmentModal from './AppointmentModal';
import AppointmentCalendar from './AppointmentCalendar';
import SearchBar from '../../common/SearchBar';
import { useReceptionistStore } from '../../../lib/store/receptionistStore';
import HeartSpinner from '../../common/HeartSpinner';

export default function AppointmentsPage() {
  const { initialize, cleanup, loading } = useReceptionistStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

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
            <CalendarIcon className="h-6 w-6 mr-2" />
            Gestion des Rendez-vous
          </h1>
          <div className="flex space-x-4">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-600 border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  viewMode === 'calendar'
                    ? 'bg-blue-50 text-blue-600 border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Calendrier
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Rendez-vous
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un rendez-vous..."
                icon={Search}
              />
            </div>

            {viewMode === 'calendar' ? (
              <AppointmentCalendar />
            ) : (
              <AppointmentsList searchQuery={searchQuery} />
            )}
          </div>
        </div>

        {isModalOpen && (
          <AppointmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </ReceptionistLayout>
  );
}