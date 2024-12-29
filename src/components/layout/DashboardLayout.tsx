import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../lib/store/authStore';
import { signOut } from '../../lib/services/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Santé+</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </div>
              
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Menu utilisateur"
                  aria-haspopup="true"
                >
                  <User className="h-6 w-6 text-gray-600" />
                </button>
                
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg hidden group-hover:block">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}