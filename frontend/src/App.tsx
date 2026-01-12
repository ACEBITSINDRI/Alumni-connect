import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import InstallPrompt from './components/pwa/InstallPrompt';
import CookieConsent from './components/legal/CookieConsent';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000, // 1 minute
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DarkModeProvider>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <AppRoutes />
                <InstallPrompt />
                <CookieConsent />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </DarkModeProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
