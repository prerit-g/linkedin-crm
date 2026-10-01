import { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/Button';

interface PWAInstallBannerProps {
  className?: string;
  showOnPages?: string[];
  hideAfterDismiss?: boolean;
}

export function PWAInstallBanner({ 
  className = '',
  showOnPages = ['/', '/contacts', '/messages', '/review', '/followups', '/dashboard'],
  hideAfterDismiss = true
}: PWAInstallBannerProps) {
  const { canInstall, isStandalone, promptInstall } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Check if we should show the banner
    const shouldShowBanner = () => {
      if (!canInstall || isStandalone) return false;
      if (hideAfterDismiss && isDismissed) return false;
      
      // Check if current page is in allowed pages
      const path = window.location.pathname;
      return showOnPages.some(page => path === page || path.startsWith(page + '/'));
    };

    setCurrentPath(window.location.pathname);
    setIsVisible(shouldShowBanner());

    // Listen for route changes
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
      setIsVisible(shouldShowBanner());
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [canInstall, isStandalone, isDismissed, showOnPages, hideAfterDismiss]);

  useEffect(() => {
    // Check localStorage for dismissal state
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      setIsVisible(false);
      localStorage.setItem('pwa-banner-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleLearnMore = () => {
    // Open help modal or navigate to settings
    const event = new CustomEvent('open-pwa-info');
    window.dispatchEvent(event);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`pwa-install-banner ${className} fixed top-0 left-0 right-0 z-50`}>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base truncate">
                  Install Outreach CRM as an app
                </h3>
                <p className="text-xs md:text-sm text-indigo-100 truncate">
                  Get faster access, work offline, and receive updates automatically
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLearnMore}
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white text-xs"
              >
                Learn More
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstall}
                className="bg-white text-indigo-600 hover:bg-gray-100 text-xs"
              >
                Install App
              </Button>
              
              <button
                onClick={handleDismiss}
                className="ml-1 text-white/70 hover:text-white p-1"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}