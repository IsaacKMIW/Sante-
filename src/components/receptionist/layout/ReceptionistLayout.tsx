import React from 'react';
import ReceptionistHeader from './ReceptionistHeader';
import ReceptionistSidebar from './ReceptionistSidebar';

interface ReceptionistLayoutProps {
  children: React.ReactNode;
}

export default function ReceptionistLayout({ children }: ReceptionistLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ReceptionistSidebar />
      <div className="ml-64">
        <ReceptionistHeader />
        <main className="pt-24 px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}