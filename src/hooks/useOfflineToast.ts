import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useOfflineToast() {
  useEffect(() => {
    const handleOfflineStatusChange = (event: CustomEvent<{ online: boolean }>) => {
      const { online } = event.detail;
      
      if (online) {
        toast.success('Connection restored', {
          duration: 3000,
          position: 'top-right',
          icon: '🟢',
          style: {
            background: '#D1FAE5',
            color: '#065F46',
            border: '1px solid #10B981',
          },
        });
      } else {
        toast.error('You are offline', {
          duration: 5000,
          position: 'top-right',
          icon: '🔴',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #DC2626',
          },
        });
      }
    };

    // Add event listener for custom offline status events
    window.addEventListener('offline-status-changed', handleOfflineStatusChange as EventListener);

    return () => {
      window.removeEventListener('offline-status-changed', handleOfflineStatusChange as EventListener);
    };
  }, []);
}