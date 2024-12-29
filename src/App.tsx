import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HeartSpinner from './components/common/HeartSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { initializeAuthListener } from './lib/services/auth';
import { getAppConfig, initializeAppConfig } from './lib/services/config';
import { useAuthStore } from './lib/store/authStore';

// Lazy load components
const Header = lazy(() => import('./components/layout/Header'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const SuperAdminDashboard = lazy(() => import('./components/dashboard/SuperAdminDashboard'));
const SuperAdminSetup = lazy(() => import('./components/auth/SuperAdminSetup'));
const ReceptionistAppointments = lazy(() => import('./components/receptionist/appointments/AppointmentsPage'));
const ReceptionistAdmissions = lazy(() => import('./components/receptionist/admissions/AdmissionsPage'));
const ReceptionistNotifications = lazy(() => import('./components/receptionist/notifications/NotificationsPage'));
const HospitalsPage = lazy(() => import('./components/hospitals/HospitalsPage'));
const ReceptionistPatients = lazy(() => import('./components/receptionist/patients/PatientsPage'));
const ReceptionistDashboard = lazy(() => import('./components/receptionist/ReceptionistDashboard'));
const UsersPage = lazy(() => import('./components/users/UsersPage'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <HeartSpinner size="lg" />
  </div>
);
const App: React.FC = () => {
  const { loading } = useAuthStore();
  const [isInitialSetup, setIsInitialSetup] = useState<boolean | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, []);

  // Check if initial setup is needed
  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        let config = await getAppConfig();
        if (!config) {
          config = await initializeAppConfig();
        }
        setIsInitialSetup(!config.superAdminCreated);
      } catch (error) {
        console.error('Erreur lors de la vérification de la configuration:', error);
      }
    };
    checkInitialSetup();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  // Show super admin setup if needed
  if (isInitialSetup === true) {
    return (
      <Suspense fallback={<PageLoader />}>
        <SuperAdminSetup />
      </Suspense>
    );
  }

  if (user?.role === 'super_admin') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Suspense fallback={<PageLoader />}>
                <SuperAdminDashboard />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/hospitals" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Suspense fallback={<PageLoader />}>
                <HospitalsPage />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Suspense fallback={<PageLoader />}>
                <UsersPage />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/receptionist/appointments" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistAppointments />
            </ProtectedRoute>
          } />
          <Route path="/receptionist/admissions" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistAdmissions />
            </ProtectedRoute>
          } />
          <Route path="/receptionist/notifications" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistNotifications />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
  
  if (user?.role === 'receptionist') {
    return (
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/receptionist" element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            } />
            <Route path="/receptionist/patients" element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistPatients />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/receptionist" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Bienvenue sur Santé+
              </h1>
              <LoginForm />
            </div>
          </main>
          </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
