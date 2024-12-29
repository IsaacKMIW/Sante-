import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useReceptionistStore } from '../../../lib/store/receptionistStore';
import { formatDate } from '../../../lib/utils/dateUtils';

const typeStyles = {
  warning: 'bg-yellow-50 text-yellow-700',
  success: 'bg-green-50 text-green-700',
  info: 'bg-blue-50 text-blue-700',
};

const typeIcons = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

export default function NotificationsPanel() {
  const { messages } = useReceptionistStore();

  const notifications = messages.map(message => ({
    id: message.id,
    type: message.type === 'announcement' ? 'warning' : 'info',
    message: message.content,
    time: formatDate(message.createdAt),
    read: message.read,
  }));

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
          {notifications.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length} nouvelle(s)
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type as keyof typeof typeIcons];
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${typeStyles[notification.type as keyof typeof typeStyles]} ${
                  !notification.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-sm opacity-75">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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