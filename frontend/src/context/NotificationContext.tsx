import React, { createContext, useContext, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useNotifications as useNotificationsApi } from '@/hooks/use-order-api';
import { useAuthStore } from '@/store/useAuthStore';

interface NotificationContextType {
  notify: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const { data: notifications } = useNotificationsApi(isAuthenticated);
  const processedIds = useRef<Set<string>>(new Set());

  const notify = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    toast[type](title, {
      description: message,
    });
  };

  useEffect(() => {
    if (isAuthenticated && notifications) {
      notifications.forEach((notif: any) => {
        if (!notif.is_read && !processedIds.current.has(notif.id)) {
          notify(notif.title, notif.message, 'info');
          processedIds.current.add(notif.id);
        }
      });
    }
  }, [notifications, isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
