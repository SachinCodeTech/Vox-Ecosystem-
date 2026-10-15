import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewType, ServiceState } from './types';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';
import { AppsView } from './components/AppsView';
import { InfoView } from './components/InfoView';
import { AboutView } from './components/AboutView';
import { VersionsView } from './components/VersionsView';
import { PrivacyView } from './components/PrivacyView';
import { TermsView } from './components/TermsView';
import { AdminView } from './components/AdminView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('apps');
  const [servicesStatus, setServicesStatus] = useState<Record<string, ServiceState>>({});
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vox_admin') === '1';
    } catch {
      return false;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  // Hash-based navigation synced with state
  const parseHash = useCallback((): ViewType => {
    const hash = window.location.hash.replace(/^#/, '');
    const validViews: ViewType[] = [
      'apps',
      'info',
      'about',
      'versions',
      'privacy',
      'terms',
      'admin',
    ];
    if (validViews.includes(hash as ViewType)) {
      if (hash === 'admin' && localStorage.getItem('vox_admin') !== '1') {
        return 'info';
      }
      return hash as ViewType;
    }
    return 'apps';
  }, []);

  const navigateTo = useCallback((view: ViewType) => {
    window.location.hash = `#${view}`;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const view = parseHash();
      setCurrentView(view);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial sync
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [parseHash]);

  // Load status from /services.json
  const loadStatus = useCallback(() => {
    fetch(`/services.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load status');
        return res.json();
      })
      .then((data) => {
        if (data && data.services) {
          setServicesStatus(data.services);
        }
        if (data && data.updated) {
          setUpdatedAt(data.updated);
        }
      })
      .catch(() => {
        // Offline or missing file: fail-safe kept available
      });
  }, []);

  useEffect(() => {
    loadStatus();

    const handleVisibility = () => {
      if (!document.hidden) {
        loadStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    const interval = setInterval(loadStatus, 60000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [loadStatus]);

  // PWA Install prompt handler
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(() => {
      setInstallPrompt(null);
    });
  };

  // Easter egg admin unlock
  const handleUnlockAdmin = () => {
    try {
      localStorage.setItem('vox_admin', '1');
    } catch {}
    setAdminUnlocked(true);
    showToast('Admin console unlocked');
  };

  const handleLockAdmin = () => {
    try {
      localStorage.removeItem('vox_admin');
      localStorage.removeItem('vox_g_token');
    } catch {}
    setAdminUnlocked(false);
    navigateTo('info');
    showToast('Admin locked');
  };

  const handleStatusUpdate = (
    newStatus: Record<string, ServiceState>,
    newUpdatedAt: string
  ) => {
    setServicesStatus(newStatus);
    setUpdatedAt(newUpdatedAt);
  };

  return (
    <div className="app">
      {currentView === 'apps' && (
        <AppsView
          servicesStatus={servicesStatus}
          canInstall={!!installPrompt}
          onInstall={handleInstallClick}
        />
      )}

      {currentView === 'info' && (
        <InfoView
          onNavigate={navigateTo}
          adminUnlocked={adminUnlocked}
          onUnlockAdmin={handleUnlockAdmin}
        />
      )}

      {currentView === 'about' && (
        <AboutView onBack={() => navigateTo('info')} />
      )}

      {currentView === 'versions' && (
        <VersionsView onBack={() => navigateTo('info')} />
      )}

      {currentView === 'privacy' && (
        <PrivacyView onBack={() => navigateTo('info')} />
      )}

      {currentView === 'terms' && (
        <TermsView onBack={() => navigateTo('info')} />
      )}

      {currentView === 'admin' && (
        <AdminView
          servicesStatus={servicesStatus}
          updatedAt={updatedAt}
          onUpdateStatus={handleStatusUpdate}
          onBack={() => navigateTo('info')}
          onLock={handleLockAdmin}
          showToast={showToast}
        />
      )}

      <Toast message={toastMessage} />

      <Navigation currentView={currentView} onNavigate={navigateTo} />
    </div>
  );
};
