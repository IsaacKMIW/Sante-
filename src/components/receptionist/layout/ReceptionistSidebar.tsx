import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BedDouble,
  Bell,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { signOut } from '../../../lib/services/auth';
import { useAuthStore } from '../../../lib/store/authStore';

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Tableau de bord', 
    href: '/receptionist',
    description: 'Vue d\'ensemble des activités'
  },
  { 
    icon: Users, 
    label: 'Patients', 
    href: '/receptionist/patients',
    description: 'Gestion des dossiers patients'
  },
  { 
    icon: Calendar, 
    label: 'Rendez-vous', 
    href: '/receptionist/appointments',
    description: 'Planification et suivi'
  },
  { 
    icon: BedDouble, 
    label: 'Admissions', 
    href: '/receptionist/admissions',
    description: 'Gestion des entrées/sorties'
  },
  { 
    icon: Bell, 
    label: 'Notifications', 
    href: '/receptionist/notifications',
    description: 'Messages et alertes'
  },
  { 
    icon: User, 
    label: 'Mon Profil', 
    href: '/profile',
    description: 'Paramètres du compte'
  }
];

export default function ReceptionistSidebar() {
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
    <aside className="bg-white w-64 min-h-screen shadow-lg fixed left-0 top-0 flex flex-col">
      {/* En-tête de la sidebar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Réceptionniste
            </p>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group relative ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>{item.label}</span>
            
            {/* Info-bulle au survol */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                          pointer-events-none z-50">
              {item.description}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Pied de la sidebar avec bouton de déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 
                     rounded-lg hover:bg-red-50 transition-colors group relative"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Déconnexion</span>
          
          {/* Info-bulle au survol */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                        pointer-events-none z-50">
            Quitter l'application
          </div>
        </button>
      </div>
    </aside>
  );
}