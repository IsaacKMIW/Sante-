import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

import { useDashboardStore } from '../../lib/store/dashboardStore';
import { formatDate } from '../../lib/utils/dateUtils';

const typeStyles = {
  warning: 'bg-yellow-50 text-yellow-700',
  success: 'bg-green-50 text-green-700',
  info: 'bg-blue-50 text-blue-700',
};

export default function NotificationsPanel() {
  const { notifications } = useDashboardStore();

  return (
    <section
      className="bg-white shadow rounded-lg overflow-hidden"
      aria-labelledby="notifications-title"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="notifications-title"
            className="text-lg font-medium text-gray-900 flex items-center"
          >
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </h2>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg ${typeStyles[notification.type]}`}
              role="alert"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <notification.icon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-sm opacity-75">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Aucune notification
            </p>
          )}
        </div>
      </div>
    </section>
  );
}