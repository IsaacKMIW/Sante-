import React from 'react';
import { Bell } from 'lucide-react';
import ReceptionistLayout from '../layout/ReceptionistLayout';
import NotificationsPanel from './NotificationsPanel';

export default function NotificationsPage() {
  return (
    <ReceptionistLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2" />
            Centre de Notifications
          </h1>
        </div>

        <NotificationsPanel />
      </div>
    </ReceptionistLayout>
  );
}