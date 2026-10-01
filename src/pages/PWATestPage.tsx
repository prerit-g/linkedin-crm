import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOffline } from '../hooks/useOffline';

const PWATestPage: React.FC = () => {
  const navigate = useNavigate();
  const { canInstall, isStandalone, promptInstall } = usePWAInstall();
  const { isOnline, networkQuality, lastOnline, retryConnection } = useOffline();
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<string>('checking');
  const [cacheStatus, setCacheStatus] = useState<string>('checking');
  const [testResults, setTestResults] = useState<Array<{name: string, passed: boolean, message: string}>>([]);

  useEffect(() => {
    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setServiceWorkerStatus('active');
      }).catch(() => {
        setServiceWorkerStatus('inactive');
      });
    } else {
      setServiceWorkerStatus('unsupported');
    }

    // Check cache status
    if ('caches' in window) {
      caches.has('vite-pwa-assets').then((hasCache) => {
        setCacheStatus(hasCache ? 'cached' : 'not cached');
      }).catch(() => {
        setCacheStatus('error');
      });
    } else {
      setCacheStatus('unsupported');
    }

    // Run tests
    runTests();
  }, []);

  const runTests = () => {
    const results = [];

    // Test 1: Service Worker Support
    results.push({
      name: 'Service Worker Support',
      passed: 'serviceWorker' in navigator,
      message: 'serviceWorker' in navigator ? 
        'Service workers are supported' : 
        'Service workers not supported in this browser'
    });

    // Test 2: Cache API Support
    results.push({
      name: 'Cache API Support',
      passed: 'caches' in window,
      message: 'caches' in window ? 
        'Cache API is supported' : 
        'Cache API not supported in this browser'
    });

    // Test 3: PWA Install Support
    results.push({
      name: 'PWA Install Support',
      passed: canInstall || isStandalone,
      message: canInstall ? 
        'Can install as PWA' : 
        isStandalone ? 'Already installed as PWA' : 'Cannot install as PWA'
    });

    // Test 4: Manifest Detection
    const manifestLink = document.querySelector('link[rel="manifest"]');
    results.push({
      name: 'Manifest Detection',
      passed: !!manifestLink,
      message: manifestLink ? 
        'Web app manifest found' : 
        'Web app manifest not found'
    });

    // Test 5: Display Mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    results.push({
      name: 'Display Mode',
      passed: isStandaloneMode,
      message: isStandaloneMode ? 
        'Running in standalone mode' : 
        'Running in browser mode'
    });

    // Test 6: Offline Capability
    results.push({
      name: 'Offline Capability',
      passed: 'serviceWorker' in navigator && serviceWorkerStatus === 'active',
      message: serviceWorkerStatus === 'active' ? 
        'Offline capability enabled' : 
        'Offline capability not enabled'
    });

    setTestResults(results);
  };

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      runTests(); // Re-run tests after installation
    }
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        setCacheStatus('cleared');
        setTimeout(() => {
          runTests(); // Re-run tests
        }, 500);
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }
  };

  const handleUpdateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().then(() => {
          alert('Service worker update check completed');
          runTests(); // Re-run tests
        });
      });
    }
  };

  const handleSimulateOffline = () => {
    // Note: This just shows the UI effect, doesn't actually go offline
    alert('In a real test, you would turn off your network connection to test offline functionality.');
  };

  const passedTests = testResults.filter(test => test.passed).length;
  const totalTests = testResults.length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PWA Test Center</h1>
            <p className="mt-1 text-sm text-gray-600">
              Test and verify PWA installation and offline functionality
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/settings')}>
            Back to Settings
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{passedTests}/{totalTests}</div>
              <div className="text-sm text-gray-600">Tests Passed</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{passRate}%</div>
              <div className="text-sm text-gray-600">Pass Rate</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{serviceWorkerStatus}</div>
              <div className="text-sm text-gray-600">Service Worker</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">{cacheStatus}</div>
              <div className="text-sm text-gray-600">Cache Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>PWA Feature Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{test.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{test.message}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {test.passed ? 'PASS' : 'FAIL'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Installation Test */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h3 className="font-medium text-indigo-900 mb-2">Installation Test</h3>
                <p className="text-sm text-indigo-700 mb-3">
                  Test if the app can be installed as a PWA on your device.
                </p>
                {canInstall ? (
                  <Button variant="primary" onClick={handleInstall} className="w-full">
                    Install Outreach CRM
                  </Button>
                ) : isStandalone ? (
                  <div className="text-center py-2 text-sm text-green-600 font-medium">
                    ✓ Already installed as standalone app
                  </div>
                ) : (
                  <div className="text-center py-2 text-sm text-yellow-600">
                    Your browser doesn't support automatic installation
                  </div>
                )}
              </div>

              {/* Offline Test */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Offline Test</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Current status: {isOnline ? 'Online' : 'Offline'}
                  {lastOnline && <span className="ml-2 text-blue-600">Last online: {lastOnline.toLocaleTimeString()}</span>}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleSimulateOffline} className="w-full">
                    Simulate Offline
                  </Button>
                  <Button variant="outline" onClick={retryConnection} className="w-full" disabled={isOnline}>
                    Retry Connection
                  </Button>
                </div>
              </div>

              {/* Cache Management */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cache Management</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Manage service worker cache and updates.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleClearCache} className="w-full">
                    Clear Cache
                  </Button>
                  <Button variant="outline" onClick={handleUpdateServiceWorker} className="w-full">
                    Update Service Worker
                  </Button>
                </div>
              </div>

              {/* Run Tests */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Test Suite</h3>
                <p className="text-sm text-green-700 mb-3">
                  Run all tests to verify PWA functionality.
                </p>
                <Button variant="outline" onClick={runTests} className="w-full">
                  Run All Tests
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Browser Information</h4>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                <pre className="whitespace-pre-wrap break-words">
                  User Agent: {navigator.userAgent}
                  Platform: {navigator.platform}
                  Online: {navigator.onLine ? 'Yes' : 'No'}
                  Network Quality: {networkQuality}
                  Connection: {'connection' in navigator ? 
                    JSON.stringify((navigator as any).connection, null, 2) : 
                    'Not available'}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">PWA Configuration</h4>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                <pre className="whitespace-pre-wrap break-words">
                  Display Mode: {window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}
                  Can Install: {canInstall ? 'Yes' : 'No'}
                  Is Standalone: {isStandalone ? 'Yes' : 'No'}
                  Service Worker: {serviceWorkerStatus}
                  Cache Status: {cacheStatus}
                  Manifest: {document.querySelector('link[rel="manifest"]') ? 'Found' : 'Not found'}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-900 mb-2">Testing Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-1">Offline Testing</h4>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>Disconnect from the internet</li>
              <li>Refresh the page to test offline loading</li>
              <li>Navigate between pages while offline</li>
              <li>Verify data is still accessible</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-1">Installation Testing</h4>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>Click "Install App" if available</li>
              <li>Verify app opens in standalone window</li>
              <li>Check app appears in Start Menu/Taskbar</li>
              <li>Test offline functionality after installation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWATestPage;