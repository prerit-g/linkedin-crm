import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

interface ServiceWorkerUpdateProps {
  className?: string;
}

export function ServiceWorkerUpdate({ className = '' }: ServiceWorkerUpdateProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Listen for the controlling service worker changing
      // and reload the page
      let refreshing = false;
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // Listen for service worker updates
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker installed and waiting
                setUpdateAvailable(true);
                setWaitingServiceWorker(newWorker);
              }
            });
          }
        });

        // Check for updates periodically
        const checkForUpdates = () => {
          registration.update().catch((error) => {
            console.log('Service worker update check failed:', error);
          });
        };

        // Check for updates every hour
        const updateInterval = setInterval(checkForUpdates, 60 * 60 * 1000);
        
        // Also check when the app gains focus
        const handleVisibilityChange = () => {
          if (!document.hidden) {
            checkForUpdates();
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          clearInterval(updateInterval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingServiceWorker) {
      // Send skip waiting message to the waiting service worker
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Close the update prompt
      setUpdateAvailable(false);
      setWaitingServiceWorker(null);
      
      // The page will reload automatically due to the controllerchange event listener
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
    setWaitingServiceWorker(null);
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className={`service-worker-update ${className} fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50`}>
      <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">Update Available</h3>
            <p className="text-sm text-gray-600 mb-3">
              A new version of Outreach CRM is available. Update to get the latest features and improvements.
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdate}
                className="flex-1"
              >
                Update Now
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}