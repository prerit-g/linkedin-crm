import React, { useState, useEffect } from 'react';
import { useOffline } from '../../hooks/useOffline';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface OfflineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineInfoModal: React.FC<OfflineInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isOnline, networkQuality, lastOnline, retryConnection } = useOffline();
  const [storageUsage, setStorageUsage] = useState<number>(0);

  useEffect(() => {
    // Calculate localStorage usage
    const calculateStorageUsage = () => {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          total += key.length + value.length;
        }
      }
      // Convert to KB
      setStorageUsage(Math.round((total / 1024) * 100) / 100);
    };

    calculateStorageUsage();
    const interval = setInterval(calculateStorageUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  const offlineFeatures = [
    {
      icon: '👤',
      title: 'View Contacts',
      description: 'Access all saved contact profiles',
      available: true
    },
    {
      icon: '📊',
      title: 'View Dashboard',
      description: 'See your outreach metrics and statistics',
      available: true
    },
    {
      icon: '💬',
      title: 'View Messages',
      description: 'Read and copy previously generated messages',
      available: true
    },
    {
      icon: '📝',
      title: 'Edit Contacts',
      description: 'Update contact information and notes',
      available: true
    },
    {
      icon: '🔍',
      title: 'Search & Filter',
      description: 'Search and filter through your contacts',
      available: true
    },
    {
      icon: '📋',
      title: 'Classification Review',
      description: 'Review and modify classification results',
      available: true
    }
  ];

  const onlineOnlyFeatures = [
    {
      icon: '➕',
      title: 'Add New Contacts',
      description: 'Classify and generate messages for new LinkedIn profiles',
      reason: 'Requires classification engine processing'
    },
    {
      icon: '🔄',
      title: 'Sync Data',
      description: 'Backup or sync data between devices',
      reason: 'Requires network connection'
    },
    {
      icon: '📤',
      title: 'Export Data',
      description: 'Download data as JSON files',
      reason: 'Requires file system access'
    },
    {
      icon: '🌐',
      title: 'Open LinkedIn',
      description: 'Open LinkedIn profiles in browser',
      reason: 'Requires network connection'
    }
  ];

  const tips = [
    'Add all your contacts while online to have them available offline',
    'Generate messages for contacts before going offline',
    'Use the classification test page to verify offline functionality',
    'Your data is automatically saved locally every time you make changes',
    'When you reconnect, you can continue working where you left off'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Offline Mode Information"
      size="lg"
    >
      <div className="space-y-6">
        {/* Current Status */}
        <div className={`p-4 rounded-lg ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOnline ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {isOnline ? '🟢' : '🟡'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isOnline ? 'Currently Online' : 'Currently Offline'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isOnline 
                    ? `Network quality: ${networkQuality === 'good' ? 'Good' : 'Poor'}`
                    : 'Working in offline mode'
                  }
                </p>
              </div>
            </div>
            {isOnline ? (
              <div className="text-sm text-green-600 font-medium">
                All features available
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={retryConnection}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
              >
                Retry Connection
              </Button>
            )}
          </div>
          {lastOnline && !isOnline && (
            <div className="mt-2 text-sm text-gray-500">
              Last online: {lastOnline.toLocaleString()}
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Local Storage</h4>
              <p className="text-sm text-gray-600">
                {storageUsage} KB used • Data persists between sessions
              </p>
            </div>
            <div className="w-32">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full" 
                  style={{ width: `${Math.min(storageUsage / 10, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {Math.min(storageUsage / 10, 100).toFixed(1)}% of estimated limit
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Offline */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Available Offline
            </h3>
            <div className="space-y-3">
              {offlineFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                  <div className="text-green-600 font-medium">✓</div>
                </div>
              ))}
            </div>
          </div>

          {/* Online Only */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-red-600">✗</span>
              Online Only
            </h3>
            <div className="space-y-3">
              {onlineOnlyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg opacity-70">
                  <div className="text-xl flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    <p className="text-xs text-red-600 mt-1">Requires: {feature.reason}</p>
                  </div>
                  <div className="text-red-600 font-medium">✗</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Offline Tips
          </h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Need help? Visit the{' '}
              <button 
                onClick={() => {
                  onClose();
                  const event = new CustomEvent('open-pwa-info');
                  window.dispatchEvent(event);
                }}
                className="text-indigo-600 hover:text-indigo-800"
              >
                PWA Installation Guide
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open('/test-pwa.html', '_blank')}
              >
                Test PWA
              </Button>
              <Button
                variant="primary"
                onClick={onClose}
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};