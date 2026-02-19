import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

const PrivacyPage: React.FC = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p>
                Alumni Connect is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
              <p>We collect information you provide directly, including:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Educational details (batch year, degree, branch)</li>
                <li>Professional information (company, designation, skills)</li>
                <li>Profile picture and biographical information</li>
                <li>Messages and communications with other users</li>
                <li>Connection requests and relationship data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Create and maintain your account</li>
                <li>Facilitate connections between alumni and students</li>
                <li>Send notifications about platform activities</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate important updates and announcements</li>
                <li>Detect and prevent fraudulent activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Information Sharing</h2>
              <p>
                We do not sell your personal information. However, we may share information with:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Other registered users of Alumni Connect (as per your privacy settings)</li>
                <li>Service providers who assist in platform operation</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your data.
              </p>
              <p className="mt-4">
                Your account is protected by a password. You are responsible for maintaining the confidentiality of your password and are responsible for all activities under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. User Privacy Controls</h2>
              <p>
                You can control your privacy settings to manage who can view your profile, send messages, and connect with you. You may also update or delete your personal information at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Cookies and Tracking</h2>
              <p>
                Alumni Connect uses cookies and similar technologies to enhance your experience. These may include:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Session cookies to maintain your login</li>
                <li>Preference cookies to remember your settings</li>
                <li>Analytics cookies to understand usage patterns</li>
              </ul>
              <p className="mt-4">
                You can disable cookies in your browser settings, though some features may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Your Rights</h2>
              <p>
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Retention of Information</h2>
              <p>
                We retain your personal information for as long as your account is active. If you delete your account, we will remove your personal information within 30 days, except where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Third-Party Links</h2>
              <p>
                Alumni Connect may contain links to third-party websites. We are not responsible for the privacy practices of external websites. We encourage you to review their privacy policies before sharing any information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Children's Privacy</h2>
              <p>
                Alumni Connect is not intended for children under 18 years old. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date below. Your continued use of Alumni Connect indicates your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p>Email: privacy@alumniconnect.acebits.in</p>
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

export default PrivacyPage;
