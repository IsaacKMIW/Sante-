import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  CreditCard, 
  ClipboardList,
  Activity,
  AlertCircle,
  Heart,
  Phone,
  Mail,
  MapPin,
  History
} from 'lucide-react';
import { PatientBase, PatientMedicalData, PatientAuditLog } from '../../types/patient';
import { formatDate } from '../../lib/utils/dateUtils';

interface PatientDetailsProps {
  patient: PatientBase;
  medicalData?: PatientMedicalData;
  auditLogs?: PatientAuditLog[];
  isOriginHospital: boolean;
}

export default function PatientDetails({
  patient,
  medicalData,
  auditLogs,
  isOriginHospital
}: PatientDetailsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'medical' | 'history'>('info');

  const tabs = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'medical', label: 'Dossier médical', icon: Heart },
    { id: 'history', label: 'Historique', icon: History }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      {/* En-tête avec informations essentielles */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                ID Patient: {patient.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              Créé le {formatDate(patient.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className={`-ml-1 mr-2 h-5 w-5 ${
                activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Informations personnelles
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Carte RFID: {patient.rfidCardId || 'Non assignée'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {patient.email || 'Aucun email'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {patient.phone}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {patient.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Contact d'urgence
              </h3>
              
              {medicalData?.emergencyContact ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nom:</span> {medicalData.emergencyContact.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Relation:</span> {medicalData.emergencyContact.relationship}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Téléphone:</span> {medicalData.emergencyContact.phone}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Aucun contact d'urgence enregistré
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'medical' && isOriginHospital && medicalData && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informations médicales
              </h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    Allergies
                  </h4>
                  {medicalData.allergies.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {medicalData.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucune allergie connue</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Activity className="h-5 w-5 text-yellow-500 mr-2" />
                    Conditions chroniques
                  </h4>
                  {medicalData.chronicConditions.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {medicalData.chronicConditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucune condition chronique</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ClipboardList className="h-5 w-5 text-green-500 mr-2" />
                Médications actuelles
              </h4>
              {medicalData.currentMedications.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {medicalData.currentMedications.map((medication, index) => (
                    <li key={index}>{medication}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Aucune médication en cours</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && auditLogs && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Historique des accès
            </h3>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {auditLogs.map((log, index) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {index < auditLogs.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div className="flex items-center">
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              {log.action === 'create' && 'Création'}
                              {log.action === 'view' && 'Consultation'}
                              {log.action === 'update' && 'Modification'}
                              {log.action === 'delete' && 'Suppression'}
                              {' par '}
                              <span className="font-medium">{log.userRole}</span>
                            </p>
                            {log.details && (
                              <p className="mt-1 text-sm text-gray-500">
                                {log.details}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(log.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}