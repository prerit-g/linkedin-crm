import { useState, useEffect, useCallback } from 'react';

interface UseOfflineReturn {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline: Date | null;
  networkQuality: 'good' | 'poor' | 'offline';
  retryConnection: () => void;
}

export function useOffline(): UseOfflineReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );
  const [networkQuality, setNetworkQuality] = useState<'good' | 'poor' | 'offline'>(
    navigator.onLine ? 'good' : 'offline'
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
      setNetworkQuality('good');
      
      // Show toast notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('offline-status-changed', {
          detail: { online: true }
        });
        window.dispatchEvent(event);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkQuality('offline');
      
      // Show toast notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('offline-status-changed', {
          detail: { online: false }
        });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor network quality if supported
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const handleChange = () => {
        if (!isOnline) {
          setNetworkQuality('offline');
          return;
        }

        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;
        const rtt = connection.rtt;

        // Determine network quality
        if (effectiveType === '4g' && downlink > 5 && rtt < 100) {
          setNetworkQuality('good');
        } else if (effectiveType === '3g' || (effectiveType === '4g' && downlink <= 5)) {
          setNetworkQuality('poor');
        } else {
          setNetworkQuality('poor');
        }
      };

      handleChange(); // Initial check
      connection.addEventListener('change', handleChange);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  const retryConnection = useCallback(() => {
    if (!isOnline) {
      // Simulate a connection retry
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        setLastOnline(new Date());
        setNetworkQuality('good');
      }
    }
  }, [isOnline]);

  return {
    isOnline,
    isOffline: !isOnline,
    lastOnline,
    networkQuality,
    retryConnection,
  };
}