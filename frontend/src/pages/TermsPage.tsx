import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        isAuthenticated={!!user}
        userRole={user?.role}
        userName={user ? `${user.firstName} ${user.lastName}` : undefined}
        userAvatar={user?.profilePicture}
        unreadNotifications={0}
        unreadMessages={0}
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to Alumni Connect. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using Alumni Connect, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. User Eligibility</h2>
              <p>
                You must be at least 18 years old to use Alumni Connect. By registering, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>You are a BIT Sindri student or alumnus</li>
                <li>You have provided accurate and truthful information</li>
                <li>You will maintain the confidentiality of your account credentials</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Post inappropriate, offensive, or defamatory content</li>
                <li>Engage in harassment, bullying, or discriminatory behavior</li>
                <li>Share personal information without consent</li>
                <li>Attempt to hack or compromise the platform</li>
                <li>Use the platform for commercial purposes without authorization</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
              <p>
                All content, features, and functionality on Alumni Connect, including text, graphics, logos, and software, are the exclusive property of BIT Sindri or its content suppliers and are protected by international copyright laws.
              </p>
              <p className="mt-4">
                By posting content to Alumni Connect, you grant us a non-exclusive, worldwide, royalty-free license to use, distribute, and display your content in connection with the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Limitation of Liability</h2>
              <p>
                Alumni Connect is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Your continued use of Alumni Connect following any such modifications indicates your acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Termination</h2>
              <p>
                We may terminate your account and access to Alumni Connect at any time, in our sole discretion, for violating these Terms or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contact Information</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p>Email: support@alumniconnect.acebits.in</p>
                <p>Address: BIT Sindri, Dhanbad, Jharkhand, India</p>
              </div>
            </section>

            <section>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Updated: January 18, 2026
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;
