import React, { useState, useEffect } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setShowInstall(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la app');
    }
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (isInstalled || !showInstall) return null;

  return (
    <button
      onClick={handleInstallClick}
      data-testid="install-app-btn"
      className="fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all z-50 flex items-center gap-2"
    >
      <span>📲</span>
      Instalar app
    </button>
  );
};

export default InstallButton;
