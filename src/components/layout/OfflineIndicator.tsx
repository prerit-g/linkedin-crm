import React from 'react';
import { useOffline } from '../../hooks/useOffline';
import { Button } from '../ui/Button';

interface OfflineIndicatorProps {
  showDetails?: boolean;
  position?: 'top' | 'bottom' | 'inline';
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showDetails = false,
  position = 'top',
  className = '',
}) => {
  const { isOnline, isOffline, networkQuality, retryConnection, lastOnline } = useOffline();

  if (isOnline && !showDetails) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50';
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-50';
      case 'inline':
        return 'w-full';
      default:
        return '';
    }
  };

  const getIndicatorContent = () => {
    if (isOnline && showDetails) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium text-green-800">You are online</p>
                <p className="text-sm text-green-600">
                  Network quality: {networkQuality === 'good' ? 'Good' : 'Poor'}
                  {lastOnline && <span className="ml-2">• Last seen: {lastOnline.toLocaleTimeString()}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isOffline) {
      return (
        <div className="bg-yellow-50 border border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-yellow-800 text-sm md:text-base">
                    You are currently offline
                  </h3>
                  <p className="text-sm text-yellow-700 truncate">
                    Some features may be unavailable. Your data is saved locally and will sync when you reconnect.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryConnection}
                  className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800 text-xs"
                >
                  Retry Connection
                </Button>
                
                {showDetails && (
                  <button
                    className="ml-1 text-yellow-700 hover:text-yellow-800 p-1"
                    aria-label="More info"
                    onClick={() => {
                      const event = new CustomEvent('open-offline-info');
                      window.dispatchEvent(event);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`offline-indicator ${getPositionClasses()} ${className}`}>
      {getIndicatorContent()}
    </div>
  );
};