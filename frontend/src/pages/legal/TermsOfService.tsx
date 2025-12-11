import React from 'react';
import { FileText, AlertCircle, Users, Shield, Ban, Scale } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isAuthenticated={false} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last Updated: December 11, 2024</p>
            <p className="text-sm text-gray-500 mt-2">Alumni Connect - ACE BIT Sindri</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">

            {/* Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-blue-600" />
                Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Alumni Connect! By accessing or using our platform, you agree to be bound by these Terms of Service.
                If you do not agree with any part of these terms, please do not use our services.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-blue-800 font-semibold">Important Note:</p>
                <p className="text-blue-700 text-sm mt-1">
                  Alumni Connect is exclusively for BIT Sindri Civil Engineering students and alumni. Registration requires
                  verification of your association with the institution.
                </p>
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                Eligibility
              </h2>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Who Can Use Alumni Connect</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Current students of Civil Engineering at BIT Sindri</li>
                    <li>Alumni of BIT Sindri Civil Engineering department</li>
                    <li>Faculty and staff associated with ACE BIT Sindri</li>
                    <li>Individuals must be at least 16 years of age</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Account Verification Required</h3>
                  <p className="text-gray-700 text-sm">
                    All accounts are subject to verification. You must provide accurate enrollment numbers, batch years,
                    and institutional email addresses. False information may result in account suspension.
                  </p>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                User Responsibilities
              </h2>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials</span>
                </p>
                <p className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Accurate Information:</strong> Provide truthful and up-to-date profile information</span>
                </p>
                <p className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Professional Conduct:</strong> Maintain professional and respectful behavior in all interactions</span>
                </p>
                <p className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Content Ownership:</strong> Ensure you have rights to any content you post (photos, documents, etc.)</span>
                </p>
                <p className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Legal Compliance:</strong> Use the platform in accordance with all applicable laws and regulations</span>
                </p>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Ban className="w-6 h-6 mr-2 text-red-600" />
                Prohibited Activities
              </h2>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-800 font-semibold mb-2">The following activities are strictly prohibited:</p>
              </div>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span><strong>Harassment:</strong> Bullying, threatening, or harassing other users</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span><strong>Spam:</strong> Posting unsolicited advertisements or promotional content</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span><strong>Fraud:</strong> Impersonating others or providing false credentials</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span><strong>Illegal Content:</strong> Sharing content that violates laws or infringes copyrights</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span><strong>System Abuse:</strong> Attempting to hack, disrupt, or damage the platform</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span><strong>Discrimination:</strong> Content that discriminates based on caste, religion, gender, or other protected characteristics</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span><strong>Scraping:</strong> Automated data collection or crawling of the platform</span>
                </p>
              </div>
            </section>

            {/* Content Guidelines */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Content and Intellectual Property</h2>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
                  <p className="text-gray-700 text-sm">
                    You retain ownership of content you post. By posting, you grant Alumni Connect a non-exclusive license
                    to use, display, and distribute your content within the platform for the purpose of connecting alumni and students.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Platform Content</h3>
                  <p className="text-gray-700 text-sm">
                    All platform features, design, logos, and original content are the property of ACE BIT Sindri and protected
                    by intellectual property laws.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Content Moderation</h3>
                  <p className="text-gray-700 text-sm">
                    We reserve the right to remove any content that violates these terms or is deemed inappropriate for an
                    educational and professional networking platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Jobs and Opportunities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Postings and Opportunities</h2>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Alumni may post genuine job openings and internship opportunities</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>All job postings must be legitimate and not misleading</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Alumni Connect does not guarantee employment or verify all job postings</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Users should exercise due diligence when applying for opportunities</span>
                </p>
              </div>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Privacy Policy
                </a>{' '}
                to understand how we collect, use, and protect your personal information.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2 text-orange-600" />
                Limitation of Liability
              </h2>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <p className="text-gray-700 text-sm mb-2">
                  Alumni Connect is provided "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  <li>Content posted by users</li>
                  <li>Employment outcomes from job postings</li>
                  <li>Interactions between users outside the platform</li>
                  <li>Technical issues or data loss</li>
                  <li>Third-party links or services</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Termination</h2>

              <div className="space-y-3 text-gray-700">
                <p>We reserve the right to suspend or terminate your account if:</p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>You violate these Terms of Service</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Your account is used for fraudulent activities</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>You provide false information during registration</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Your actions harm other users or the platform</span>
                </p>
                <p className="mt-3">
                  You may also delete your account at any time from your profile settings.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns?</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> ace@bitsindri.ac.in</p>
                <p><strong>Address:</strong> ACE BIT Sindri, Dhanbad, Jharkhand - 828123</p>
              </div>
            </section>

            {/* Changes */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to Terms</h2>
              <p className="text-gray-700 text-sm">
                We may modify these Terms of Service at any time. Continued use of the platform after changes constitutes
                acceptance of the new terms. We will notify users of significant changes via email or platform notifications.
              </p>
            </section>

            {/* Governing Law */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Governing Law</h2>
              <p className="text-gray-700 text-sm">
                These Terms of Service are governed by the laws of India. Any disputes shall be subject to the exclusive
                jurisdiction of courts in Dhanbad, Jharkhand.
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
