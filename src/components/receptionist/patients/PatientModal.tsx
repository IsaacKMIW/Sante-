import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { validateRFIDCard } from '../../lib/services/rfid';
import { useAuthStore } from '../../lib/store/authStore';

interface RFIDScannerProps {
  value: string;
  onChange: (value: string) => void;
  onError?: (error: string) => void;
  required?: boolean;
}

export default function RFIDScanner({
  value,
  onChange,
  onError,
  required = false
}: RFIDScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const simulateRFIDScan = async () => {
    if (!user?.hospitalId) {
      setError('Erreur d\'authentification');
      if (onError) onError('Erreur d\'authentification');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      // Simuler une lecture RFID (à remplacer par une vraie lecture)
      const uid = Math.random().toString(36).substring(2, 15).toUpperCase();
      
      // Vérifier si la carte est déjà utilisée
      const isValid = await validateRFIDCard(uid, user.hospitalId);
      
      if (!isValid) {
        throw new Error('Cette carte RFID est déjà associée à un patient');
      }
      
      // Mettre à jour la valeur
      onChange(uid);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de lecture RFID';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Carte RFID {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="text"
          value={value}
          readOnly
          required={required}
          className="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
          placeholder="Scanner une carte RFID..."
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={simulateRFIDScan}
          disabled={isScanning}
          className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md ${
            isScanning
              ? 'bg-gray-100 cursor-not-allowed'
              : 'bg-gray-50 hover:bg-gray-100'
          } text-gray-700`}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          {isScanning ? 'Lecture...' : 'Scanner'}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      <p className="mt-1 text-sm text-gray-500">
        Cliquez sur "Scanner" pour lire une carte RFID
      </p>
    </div>
  );
}