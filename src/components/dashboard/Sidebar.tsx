import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  FileBarChart,
  Settings, 
  User,
  LogOut
} from 'lucide-react';
import { signOut } from '../../lib/services/auth';

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Tableau de bord', 
    href: '/dashboard',
    prefetch: false 
  },
  { 
    icon: Building2, 
    label: 'Hôpitaux', 
    href: '/hospitals',
    prefetch: true 
  },
  { icon: Users, label: 'Utilisateurs', href: '/users' },
  { icon: CreditCard, label: 'Cartes RFID', href: '/rfid' },
  { icon: FileBarChart, label: 'Rapports', href: '/reports' },
  { icon: User, label: 'Mon Profil', href: '/profile' },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
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
    <nav
      className="w-64 bg-white shadow-lg h-screen"
      aria-label="Menu principal"
    >
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  location.pathname === item.href ? 'bg-blue-50 text-blue-600' : ''
                }`}
                aria-current={location.pathname === item.href ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}