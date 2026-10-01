import { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface PWAInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PWAInfoModal({ isOpen, onClose }: PWAInfoModalProps) {
  const { canInstall, promptInstall } = usePWAInstall();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkDisplayMode = () => {
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    };
    
    checkDisplayMode();
    window.addEventListener('appinstalled', checkDisplayMode);
    
    return () => {
      window.removeEventListener('appinstalled', checkDisplayMode);
    };
  }, []);

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      onClose();
    }
  };

  const features = [
    {
      icon: '🚀',
      title: 'Faster Access',
      description: 'Launch directly from your desktop or home screen without opening the browser.'
    },
    {
      icon: '📱',
      title: 'App-Like Experience',
      description: 'Runs in its own window without browser tabs or address bar distractions.'
    },
    {
      icon: '🌐',
      title: 'Offline Access',
      description: 'View and manage your contacts even without an internet connection.'
    },
    {
      icon: '🔄',
      title: 'Automatic Updates',
      description: 'Get the latest features and security updates automatically.'
    },
    {
      icon: '🔔',
      title: 'Desktop Notifications',
      description: 'Receive notifications for follow-ups and important updates.'
    },
    {
      icon: '💾',
      title: 'Local Storage',
      description: 'Your data is stored securely on your device and syncs when online.'
    }
  ];

  const installInstructions = [
    {
      browser: 'Chrome / Edge',
      steps: [
        'Click the "Install App" button below',
        'Click "Install" in the browser prompt',
        'The app will appear on your desktop and in Start Menu'
      ]
    },
    {
      browser: 'Safari',
      steps: [
        'Tap the Share button (📤)',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install'
      ]
    },
    {
      browser: 'Firefox',
      steps: [
        'Click the menu button (≡)',
        'Select "Install" or "Add to Home Screen"',
        'Follow the prompts to complete installation'
      ]
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Install Outreach CRM as an App"
      size="lg"
    >
      <div className="space-y-6">
        {isStandalone ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Already Installed!</h3>
                <p className="text-sm text-green-600">
                  Outreach CRM is already installed as an app on your device.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Benefits section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Why install as an app?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Installation instructions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">How to install</h3>
              <div className="space-y-4">
                {installInstructions.map((browser, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">{browser.browser.split(' ')[0].charAt(0)}</span>
                      </div>
                      <h4 className="font-medium text-gray-900">{browser.browser}</h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {browser.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="pl-1">{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            {/* Install button */}
            {canInstall && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Ready to install? Click the button below to get started.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleInstall}
                    className="px-6"
                  >
                    Install Outreach CRM
                  </Button>
                </div>
              </div>
            )}

            {/* Already installed but not detected */}
            {!canInstall && !isStandalone && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Installation Info</h3>
                    <p className="text-sm text-blue-600">
                      Your browser may not support automatic installation. Check your browser menu for "Install" or "Add to Home Screen" options.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>Questions? Visit our <button className="text-indigo-600 hover:text-indigo-800">Help Center</button></p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}