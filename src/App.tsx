import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { PWAStatus } from './components/layout/PWAStatus';
import { ServiceWorkerUpdate } from './components/layout/ServiceWorkerUpdate';
import { PWAInstallBanner } from './components/layout/PWAInstallBanner';
import { PWAInfoModal } from './components/layout/PWAInfoModal';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { OfflineInfoModal } from './components/layout/OfflineInfoModal';
import { useOfflineToast } from './hooks/useOfflineToast';

// ─── Page components ─────────────────────────────────────────────────────────

import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import AddContactPage from './pages/AddContactPage';
import ContactDetailPage from './pages/ContactDetailPage';
import MessageQueuePage from './pages/MessageQueuePage';
import ManualReviewPage from './pages/ManualReviewPage';
import FollowUpsPage from './pages/FollowUpsPage';
import SettingsPage from './pages/SettingsPage';
import TestClassificationPage from './pages/TestClassificationPage';
import PWATestPage from './pages/PWATestPage';

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'contacts',
        element: <ContactsPage />,
      },
      {
        path: 'contacts/add',
        element: <AddContactPage />,
      },
      {
        path: 'contacts/:id',
        element: <ContactDetailPage />,
      },
      {
        path: 'messages',
        element: <MessageQueuePage />,
      },
      {
        path: 'review',
        element: <ManualReviewPage />,
      },
      {
        path: 'followups',
        element: <FollowUpsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'test',
        element: <TestClassificationPage />,
      },
      {
        path: 'pwa-test',
        element: <PWATestPage />,
      },
    ],
  },
  {
    // Catch-all — redirect to dashboard
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  // Initialize offline toast notifications
  useOfflineToast();
  
  // State for modals
  const [showPWAInfoModal, setShowPWAInfoModal] = useState(false);
  const [showOfflineInfoModal, setShowOfflineInfoModal] = useState(false);

  useEffect(() => {
    // Listen for custom event to open PWA info modal
    const handleOpenPWAInfo = () => {
      setShowPWAInfoModal(true);
    };

    // Listen for custom event to open offline info modal
    const handleOpenOfflineInfo = () => {
      setShowOfflineInfoModal(true);
    };

    window.addEventListener('open-pwa-info', handleOpenPWAInfo);
    window.addEventListener('open-offline-info', handleOpenOfflineInfo);
    
    return () => {
      window.removeEventListener('open-pwa-info', handleOpenPWAInfo);
      window.removeEventListener('open-offline-info', handleOpenOfflineInfo);
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            maxWidth: '380px',
          },
        }}
      />
      {/* Global PWA Status Indicator (hidden in production by default) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <PWAStatus className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200" />
        </div>
      )}
      {/* Offline Indicator */}
      <OfflineIndicator position="top" />
      {/* Service Worker Update Prompt */}
      <ServiceWorkerUpdate />
      {/* PWA Installation Banner */}
      <PWAInstallBanner />
      {/* PWA Info Modal */}
      <PWAInfoModal 
        isOpen={showPWAInfoModal}
        onClose={() => setShowPWAInfoModal(false)}
      />
      {/* Offline Info Modal */}
      <OfflineInfoModal 
        isOpen={showOfflineInfoModal}
        onClose={() => setShowOfflineInfoModal(false)}
      />
    </>
  );
}
