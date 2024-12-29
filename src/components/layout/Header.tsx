import React from 'react';
import { Heart } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Santé+</span>
          </div>
          <nav className="flex space-x-4">
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Connexion
            </a>
            <a href="/register" className="text-gray-600 hover:text-gray-900">
              Inscription
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;