import React, { useState, useEffect } from 'react';
import { Cookie, X, Settings, Check } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be changed
    functional: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences({ ...preferences, ...saved });
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectNonEssential = () => {
    const onlyEssential = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyEssential);
    localStorage.setItem('cookie-consent', JSON.stringify(onlyEssential));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn" />
      )}

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white rounded-t-2xl shadow-2xl border-2 border-gray-200 max-w-6xl mx-auto overflow-hidden">

            {/* Main Banner */}
            {!showSettings ? (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Cookie className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        We Value Your Privacy
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        Alumni Connect uses cookies to enhance your experience on our educational networking platform.
                        We use cookies to keep you logged in, remember your preferences, and understand how you interact with fellow
                        BIT Sindri alumni and students. Your privacy matters to us.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <a
                          href="/privacy-policy"
                          className="text-sky-600 hover:text-sky-700 font-semibold underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>
                        <span className="text-gray-400">•</span>
                        <a
                          href="/cookie-policy"
                          className="text-sky-600 hover:text-sky-700 font-semibold underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Cookie Policy
                        </a>
                        <span className="text-gray-400">•</span>
                        <a
                          href="/terms-of-service"
                          className="text-sky-600 hover:text-sky-700 font-semibold underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms of Service
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Check size={20} />
                    <span>Accept All Cookies</span>
                  </button>
                  <button
                    onClick={handleRejectNonEssential}
                    className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Reject Non-Essential
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex-1 sm:flex-none border-2 border-sky-500 text-sky-600 hover:bg-sky-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Settings size={18} />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Settings Panel */
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Settings className="w-6 h-6 mr-2 text-sky-600" />
                    Cookie Preferences
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  Choose which cookies you want to allow. Essential cookies are required for the platform to work
                  and cannot be disabled.
                </p>

                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-bold text-gray-900">Essential Cookies</h4>
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-semibold">
                            Always Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Required for authentication, security, and core platform functionality. These cannot be disabled.
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className={`border-2 rounded-xl p-4 transition-all ${
                    preferences.functional ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Functional Cookies</h4>
                        <p className="text-sm text-gray-700">
                          Remember your preferences like language, theme, and dashboard layout for a personalized experience.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('functional')}
                        className="ml-4"
                      >
                        <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                          preferences.functional ? 'bg-blue-500' : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                            preferences.functional ? 'ml-auto' : ''
                          }`}></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className={`border-2 rounded-xl p-4 transition-all ${
                    preferences.analytics ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Analytics Cookies</h4>
                        <p className="text-sm text-gray-700">
                          Help us understand how alumni and students use the platform to improve features and user experience.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className="ml-4"
                      >
                        <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                          preferences.analytics ? 'bg-purple-500' : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                            preferences.analytics ? 'ml-auto' : ''
                          }`}></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className={`border-2 rounded-xl p-4 transition-all ${
                    preferences.marketing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Marketing Cookies</h4>
                        <p className="text-sm text-gray-700">
                          Show relevant job opportunities, events, and alumni connections based on your profile and interests.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className="ml-4"
                      >
                        <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-all ${
                          preferences.marketing ? 'bg-orange-500' : 'bg-gray-300'
                        }`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                            preferences.marketing ? 'ml-auto' : ''
                          }`}></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Save My Preferences
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
