import { useState, useEffect } from 'react';
import { useOffline } from './useOffline';
import toast from 'react-hot-toast';

interface UseOfflineGuardReturn {
  isOnline: boolean;
  checkOnline: (featureName: string, callback?: () => void) => boolean;
  withOfflineCheck: <T extends (...args: any[]) => any>(
    callback: T,
    featureName: string
  ) => (...args: Parameters<T>) => ReturnType<T> | void;
}

export function useOfflineGuard(): UseOfflineGuardReturn {
  const { isOnline } = useOffline();
  const [lastOfflineWarning, setLastOfflineWarning] = useState<number>(0);

  const checkOnline = (featureName: string, callback?: () => void): boolean => {
    if (!isOnline) {
      const now = Date.now();
      // Throttle warnings to avoid spamming
      if (now - lastOfflineWarning > 5000) {
        setLastOfflineWarning(now);
        toast.error(
          `"${featureName}" is unavailable offline. Please reconnect to use this feature.`,
          {
            duration: 5000,
            position: 'top-right',
            icon: '🔴',
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              border: '1px solid #DC2626',
            },
          }
        );
      }

      // Open offline info modal if user tries to use an online-only feature
      const event = new CustomEvent('open-offline-info');
      window.dispatchEvent(event);

      return false;
    }

    if (callback) {
      callback();
    }
    return true;
  };

  const withOfflineCheck = <T extends (...args: any[]) => any>(
    callback: T,
    featureName: string
  ): ((...args: Parameters<T>) => ReturnType<T> | void) => {
    return (...args: Parameters<T>) => {
      if (checkOnline(featureName)) {
        return callback(...args);
      }
    };
  };

  return {
    isOnline,
    checkOnline,
    withOfflineCheck,
  };
}

// Specific offline guard hooks for common features
export function useAddContactGuard() {
  const { checkOnline } = useOfflineGuard();
  
  return {
    canAddContact: () => checkOnline('Add Contact'),
    withAddContactCheck: <T extends (...args: any[]) => any>(callback: T) => 
      useOfflineGuard().withOfflineCheck(callback, 'Add Contact')
  };
}

export function useLinkedInGuard() {
  const { checkOnline } = useOfflineGuard();
  
  return {
    canOpenLinkedIn: () => checkOnline('Open LinkedIn'),
    withLinkedInCheck: <T extends (...args: any[]) => any>(callback: T) => 
      useOfflineGuard().withOfflineCheck(callback, 'Open LinkedIn')
  };
}

export function useExportGuard() {
  const { checkOnline } = useOfflineGuard();
  
  return {
    canExportData: () => checkOnline('Export Data'),
    withExportCheck: <T extends (...args: any[]) => any>(callback: T) => 
      useOfflineGuard().withOfflineCheck(callback, 'Export Data')
  };
}

export function useClassificationGuard() {
  const { checkOnline } = useOfflineGuard();
  
  return {
    canClassify: () => checkOnline('Classify Contact'),
    withClassificationCheck: <T extends (...args: any[]) => any>(callback: T) => 
      useOfflineGuard().withOfflineCheck(callback, 'Classify Contact')
  };
}