import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '../../../types/receptionist';
import { useReceptionistStore } from '../../../lib/store/receptionistStore';
import { formatDate } from '../../../lib/utils/dateUtils';

const ViewTypes = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
} as const;

type ViewType = typeof ViewTypes[keyof typeof ViewTypes];

export default function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>(ViewTypes.WEEK);
  const { appointments } = useReceptionistStore();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case ViewTypes.DAY:
        newDate.setDate(newDate.getDate() - 1);
        break;
      case ViewTypes.WEEK:
        newDate.setDate(newDate.getDate() - 7);
        break;
      case ViewTypes.MONTH:
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case ViewTypes.DAY:
        newDate.setDate(newDate.getDate() + 1);
        break;
      case ViewTypes.WEEK:
        newDate.setDate(newDate.getDate() + 7);
        break;
      case ViewTypes.MONTH:
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevious}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {formatDate(currentDate.toISOString())}
            </h2>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewType(ViewTypes.DAY)}
              className={`px-3 py-1 rounded-md ${
                viewType === ViewTypes.DAY
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setViewType(ViewTypes.WEEK)}
              className={`px-3 py-1 rounded-md ${
                viewType === ViewTypes.WEEK
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewType(ViewTypes.MONTH)}
              className={`px-3 py-1 rounded-md ${
                viewType === ViewTypes.MONTH
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              Mois
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {/* Contenu du calendrier selon le type de vue */}
        {/* À implémenter selon le design souhaité */}
      </div>
    </div>
  );
}