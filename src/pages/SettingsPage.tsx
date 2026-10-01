import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOffline } from '../hooks/useOffline';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { canInstall, isStandalone, promptInstall } = usePWAInstall();
  const { isOnline, networkQuality, retryConnection } = useOffline();
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      toast.success('App installation started!');
    } else if (result === 'dismissed') {
      toast('Installation cancelled. You can install anytime from Settings.');
    }
  };

  const handleOpenPWAInfo = () => {
    const event = new CustomEvent('open-pwa-info');
    window.dispatchEvent(event);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure your CRM preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* PWA & App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              PWA & App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">App Status</p>
                  <p className="text-sm text-gray-500">
                    {isStandalone ? 'Installed as standalone app' : 'Running in browser'}
                  </p>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${isStandalone ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  <div className={`w-2 h-2 rounded-full ${isStandalone ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <span>{isStandalone ? 'Installed' : 'Browser'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Network Status</p>
                  <p className="text-sm text-gray-500">
                    {isOnline ? 'Connected to internet' : 'Currently offline'}
                  </p>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${isOnline ? networkQuality === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? networkQuality === 'good' ? 'bg-green-500' : 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span>{isOnline ? (networkQuality === 'good' ? 'Good' : 'Poor') : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* Installation Section */}
            {!isStandalone && (
              <div className="pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Install as App</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Install Outreach CRM as a standalone app for faster access, offline usage,
                    and automatic updates.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {canInstall && (
                    <Button
                      variant="primary"
                      onClick={handleInstall}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Install App
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={handleOpenPWAInfo}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Learn More
                  </Button>
                </div>

                {!canInstall && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                    <p className="font-medium">Installation Not Available</p>
                    <p className="mt-1">
                      Your browser may not support automatic installation. Check your browser menu
                      for "Install" or "Add to Home Screen" options.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Service Worker Controls */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Service Worker Controls</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryConnection}
                  disabled={isOnline}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry Connection
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.ready.then((registration) => {
                        registration.update().then(() => {
                          toast.success('Service worker update check completed');
                        });
                      });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Check for Updates
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/pwa-test')}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Test PWA
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {showDebugInfo ? 'Hide Debug' : 'Show Debug'}
                </Button>
              </div>

              {/* Debug Info */}
              {showDebugInfo && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs font-mono">
                  <pre className="whitespace-pre-wrap break-words">
                    {JSON.stringify({
                      isStandalone,
                      canInstall,
                      isOnline,
                      networkQuality,
                      serviceWorker: 'serviceWorker' in navigator ? 'available' : 'unavailable',
                      localStorage: localStorage.length + ' items',
                      userAgent: navigator.userAgent.substring(0, 80) + '...',
                      platform: navigator.platform,
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Enable Notifications</p>
                <p className="text-sm text-gray-500">
                  Get notified about follow-ups and new messages
                </p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <div className="h-4 w-4 translate-x-1 rounded-full bg-white transition" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-save Drafts</p>
                <p className="text-sm text-gray-500">
                  Automatically save message drafts
                </p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                <div className="h-4 w-4 translate-x-6 rounded-full bg-white transition" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Load Test Data</p>
                <p className="text-sm text-gray-500">
                  Load sample contacts for testing
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                // This would need to be implemented in the store
                toast.success('Test data loaded (feature coming soon)');
              }}>
                Load Test Data
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Export Data</p>
                <p className="text-sm text-gray-500">
                  Download all contacts as JSON
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Import Data</p>
                <p className="text-sm text-gray-500">
                  Import contacts from JSON file
                </p>
              </div>
              <Input type="file" className="w-32" accept=".json" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Clear All Data</p>
                <p className="text-sm text-gray-500">
                  Remove all contacts and reset the CRM
                </p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Developer Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Developer Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Test Classification Engine</p>
                <p className="text-sm text-gray-500">
                  Test and verify classification accuracy
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/test')}
              >
                Open Test Panel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About Outreach CRM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Version</p>
              <p className="text-sm text-gray-500">1.0.0 Beta</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Description</p>
              <p className="text-sm text-gray-500">
                Personal LinkedIn job-search outreach CRM. This application helps organize contacts,
                generate personalized messages, and track communication—all client-side with no
                external data transmission.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Storage</p>
              <p className="text-sm text-gray-500">
                All data is stored locally in your browser. No data leaves your device.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;