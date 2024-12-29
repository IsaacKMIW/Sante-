import React from 'react';
import { User } from 'lucide-react';
import DashboardHeader from '../dashboard/DashboardHeader';
import Sidebar from '../dashboard/Sidebar';
import ProfileForm from './ProfileForm';
import { useAuthStore } from '../../lib/store/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <User className="h-6 w-6 mr-2" />
                Mon Profil
              </h1>
            </div>
            <ProfileForm />
          </div>
        </main>
      </div>
    </div>
  );
}