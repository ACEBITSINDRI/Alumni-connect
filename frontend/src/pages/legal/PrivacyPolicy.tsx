import React from 'react';
import { Shield, Lock, Eye, Database, Users, Mail, Cookie } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isAuthenticated={false} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-sky-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: December 11, 2024</p>
            <p className="text-sm text-gray-500 mt-2">Alumni Connect - ACE BIT Sindri</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-sky-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Alumni Connect, the official alumni networking platform for the Association of Civil Engineers (ACE),
                BIT Sindri. We are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-sky-600" />
                Information We Collect
              </h2>

              <div className="space-y-4">
                <div className="bg-sky-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Personal Information</h3>
                  <p className="text-gray-700 text-sm">
                    When you register on Alumni Connect, we collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                    <li>Full name and profile picture</li>
                    <li>Email address and phone number</li>
                    <li>Academic information (batch year, branch, enrollment number)</li>
                    <li>Professional information (current company, job title, location)</li>
                    <li>Educational qualifications and certifications</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">2. Usage Information</h3>
                  <p className="text-gray-700 text-sm">
                    We automatically collect certain information about your device and how you interact with our platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on platform</li>
                    <li>Posts, comments, and engagement metrics</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">3. Communication Data</h3>
                  <p className="text-gray-700 text-sm">
                    Information from your interactions on the platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                    <li>Messages sent through our platform</li>
                    <li>Connection requests and network information</li>
                    <li>Event registrations and participation</li>
                    <li>Job applications and career-related activities</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-sky-600" />
                How We Use Your Information
              </h2>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span><strong>Facilitate Alumni Networking:</strong> Connect current students with alumni for mentorship and career guidance</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span><strong>Share Opportunities:</strong> Distribute job postings, internship opportunities, and career events</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span><strong>Organize Events:</strong> Coordinate alumni meetups, workshops, and ACE BIT Sindri events</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span><strong>Improve Platform:</strong> Analyze usage patterns to enhance user experience and features</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span><strong>Send Communications:</strong> Notify you about platform updates, new connections, and relevant opportunities</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">•</span>
                  <span><strong>Verify Credentials:</strong> Confirm your association with BIT Sindri Civil Engineering department</span>
                </p>
              </div>
            </section>

            {/* Data Sharing and Disclosure */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-sky-600" />
                Data Sharing and Disclosure
              </h2>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-800 font-semibold mb-2">We do NOT sell your personal information to third parties.</p>
                <p className="text-red-700 text-sm">Your data is only shared in the following circumstances:</p>
              </div>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">1.</span>
                  <span><strong>Within the Platform:</strong> Your profile is visible to other verified BIT Sindri alumni and students</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">2.</span>
                  <span><strong>With Your Consent:</strong> When you apply for jobs or register for events</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">3.</span>
                  <span><strong>Legal Requirements:</strong> If required by law or to protect rights and safety</span>
                </p>
                <p className="flex items-start">
                  <span className="text-sky-600 mr-2">4.</span>
                  <span><strong>ACE BIT Sindri:</strong> Aggregate statistics may be shared with the institution for educational purposes</span>
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-sky-600" />
                Data Security
              </h2>

              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                  <p className="text-sm text-gray-700">All data transmitted is encrypted using SSL/TLS protocols</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Storage</h4>
                  <p className="text-sm text-gray-700">Your data is stored on secure servers with regular backups</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Access Control</h4>
                  <p className="text-sm text-gray-700">Limited staff access with strict authentication requirements</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Regular Audits</h4>
                  <p className="text-sm text-gray-700">Periodic security assessments and vulnerability testing</p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Access:</strong> Request a copy of your personal data</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Correction:</strong> Update or correct inaccurate information</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Deletion:</strong> Request deletion of your account and data</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Opt-out:</strong> Unsubscribe from promotional communications</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Portability:</strong> Receive your data in a structured format</span>
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Cookie className="w-6 h-6 mr-2 text-sky-600" />
                Cookies and Tracking
              </h2>

              <p className="text-gray-700 mb-3">
                We use cookies and similar technologies to enhance your experience. See our{' '}
                <a href="/cookie-policy" className="text-sky-600 hover:text-sky-700 font-semibold underline">
                  Cookie Policy
                </a>{' '}
                for detailed information.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-sky-600" />
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                For any privacy-related questions or concerns, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> ace@bitsindri.ac.in</p>
                <p><strong>Address:</strong> ACE BIT Sindri, Dhanbad, Jharkhand - 828123</p>
                <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
              <p className="text-gray-700 text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
                Policy periodically for any changes.
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
