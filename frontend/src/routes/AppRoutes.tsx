import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import EmailVerificationPage from '../pages/auth/EmailVerificationPage';

// Protected Pages
import DashboardPage from '../pages/DashboardPage';
import AlumniDirectoryPage from '../pages/AlumniDirectoryPage';
import ProfilePage from '../pages/ProfilePage';
import ProfileEditPage from '../pages/ProfileEditPage';
import OpportunitiesPage from '../pages/OpportunitiesPage';
import EventsPage from '../pages/EventsPage';
import NotificationsPage from '../pages/NotificationsPage';
import MessagesPage from '../pages/MessagesPage';
import SettingsPage from '../pages/SettingsPage';
import PostDetailPage from '../pages/PostDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes - Accessible only when not logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage userType="student" />
          </PublicRoute>
        }
      />
      <Route
        path="/login/student"
        element={
          <PublicRoute>
            <LoginPage userType="student" />
          </PublicRoute>
        }
      />
      <Route
        path="/login/alumni"
        element={
          <PublicRoute>
            <LoginPage userType="alumni" />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage userType="student" />
          </PublicRoute>
        }
      />
      <Route
        path="/signup/student"
        element={
          <PublicRoute>
            <SignupPage userType="student" />
          </PublicRoute>
        }
      />
      <Route
        path="/signup/alumni"
        element={
          <PublicRoute>
            <SignupPage userType="alumni" />
          </PublicRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />

      {/* Protected Routes - Require authentication */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/alumni"
        element={
          <PrivateRoute>
            <AlumniDirectoryPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <PrivateRoute>
            <ProfileEditPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/opportunities"
        element={
          <PrivateRoute>
            <OpportunitiesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/events"
        element={
          <PrivateRoute>
            <EventsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <MessagesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings/:section"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/post/:postId"
        element={
          <PrivateRoute>
            <PostDetailPage />
          </PrivateRoute>
        }
      />

      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
