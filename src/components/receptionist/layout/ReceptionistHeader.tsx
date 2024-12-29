import React from 'react';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../../../lib/store/authStore';

export default function ReceptionistHeader() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm fixed top-0 right-0 left-64 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Santé+
              </h1>
              {user?.hospitalName && (
                <p className="text-sm text-gray-500">
                  {user.hospitalName}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-gray-700">
              {user?.firstName} {user?.lastName}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}