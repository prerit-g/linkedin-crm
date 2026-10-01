import { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/Button';

interface PWAStatusProps {
  className?: string;
}

export function PWAStatus({ className = '' }: PWAStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<string>('checking');
  const { canInstall, isStandalone, promptInstall } = usePWAInstall();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setServiceWorkerStatus('active');
      }).catch(() => {
        setServiceWorkerStatus('inactive');
      });
    } else {
      setServiceWorkerStatus('unsupported');
    }
  }, []);

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      console.log('PWA installation accepted');
    }
  };

  const handleRefresh = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleCheckForUpdates = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().then(() => {
          console.log('Service worker update check completed');
        });
      });
    }
  };

  return (
    <div className={`pwa-status ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        {/* Connection status */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Service Worker status */}
        {serviceWorkerStatus === 'active' && (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>PWA Ready</span>
          </div>
        )}

        {serviceWorkerStatus === 'inactive' && (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>PWA Disabled</span>
          </div>
        )}

        {/* Install button */}
        {canInstall && !isStandalone && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstall}
            className="px-3 py-1 text-xs"
          >
            Install App
          </Button>
        )}

        {/* Refresh for updates button */}
        {serviceWorkerStatus === 'active' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="px-2 py-1 text-xs text-gray-600"
            title="Check for updates"
          >
            ↻
          </Button>
        )}
      </div>

      {/* Offline warning */}
      {!isOnline && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <p className="font-medium">You are currently offline.</p>
          <p className="text-xs mt-1">
            Some features may be unavailable. Your data is saved locally and will sync when you reconnect.
          </p>
        </div>
      )}

      {/* Debug info (hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2 text-xs text-gray-500">
          <summary className="cursor-pointer">Debug Info</summary>
          <div className="mt-1 space-y-1">
            <div>Online: {isOnline ? 'Yes' : 'No'}</div>
            <div>Service Worker: {serviceWorkerStatus}</div>
            <div>Can Install: {canInstall ? 'Yes' : 'No'}</div>
            <div>Is Standalone: {isStandalone ? 'Yes' : 'No'}</div>
            <div>Display Mode: {window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}</div>
          </div>
        </details>
      )}
    </div>
  );
}