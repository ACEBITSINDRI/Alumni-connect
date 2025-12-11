import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import alumniConnectLogo from '../../assets/logos/alumni_connect_logo-removebg-preview.png';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        // Show prompt after 3 seconds
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 7 days
    const dismissTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa-install-dismissed', dismissTime.toString());
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn" />

      {/* Install Prompt Card */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50 animate-slideDown">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-sky-100">
          {/* Header with Logo */}
          <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-6 text-center relative">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-300"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="w-24 h-24 mx-auto bg-white rounded-2xl p-3 mb-4 shadow-xl">
              <img
                src={alumniConnectLogo}
                alt="Alumni Connect Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Install Alumni Connect
            </h2>
            <p className="text-sky-50 text-sm">
              ACE BIT Sindri
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Download size={20} className="text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Access</h3>
                  <p className="text-sm text-gray-600">
                    Access Alumni Connect directly from your home screen
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Works Offline</h3>
                  <p className="text-sm text-gray-600">
                    Stay connected even without internet connection
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Faster & Lighter</h3>
                  <p className="text-sm text-gray-600">
                    Native app-like experience with instant loading
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>Install App</span>
              </button>
              <button
                onClick={handleDismiss}
                className="sm:w-auto px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              You can always install later from your browser menu
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstallPrompt;
