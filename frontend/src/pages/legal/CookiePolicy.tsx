import React from 'react';
import { Cookie, Settings, BarChart, Shield, Trash2 } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar isAuthenticated={false} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Cookie className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-gray-600">Last Updated: December 11, 2024</p>
            <p className="text-sm text-gray-500 mt-2">Alumni Connect - ACE BIT Sindri</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files stored on your device when you visit our platform. They help us provide you with
                a better experience by remembering your preferences, keeping you logged in, and understanding how you use Alumni Connect.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This Cookie Policy is part of our Privacy Policy. By using Alumni Connect, you consent
                  to our use of cookies as described in this policy.
                </p>
              </div>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>

              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">1. Essential Cookies (Required)</h3>
                      <p className="text-gray-700 text-sm mb-2">
                        These cookies are necessary for the platform to function and cannot be disabled.
                      </p>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                        <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                        <li><strong>Session Management:</strong> Remember your current session and prevent loss of data</li>
                        <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
                      </ul>
                      <p className="text-green-700 text-xs mt-2 font-semibold">Duration: Session or up to 30 days</p>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Settings className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">2. Functional Cookies (Optional)</h3>
                      <p className="text-gray-700 text-sm mb-2">
                        These cookies enable enhanced functionality and personalization.
                      </p>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        <li><strong>Preferences:</strong> Remember your language, theme, and display settings</li>
                        <li><strong>Notifications:</strong> Store notification preferences</li>
                        <li><strong>Feature Settings:</strong> Remember your dashboard layout choices</li>
                        <li><strong>Recent Searches:</strong> Save your search history for quick access</li>
                      </ul>
                      <p className="text-blue-700 text-xs mt-2 font-semibold">Duration: Up to 1 year</p>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <BarChart className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">3. Analytics Cookies (Optional)</h3>
                      <p className="text-gray-700 text-sm mb-2">
                        These cookies help us understand how you use the platform to improve user experience.
                      </p>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        <li><strong>Usage Statistics:</strong> Track page views, clicks, and navigation patterns</li>
                        <li><strong>Performance Metrics:</strong> Measure page load times and errors</li>
                        <li><strong>Feature Adoption:</strong> Understand which features are most useful</li>
                        <li><strong>User Journey:</strong> Analyze how students and alumni interact with the platform</li>
                      </ul>
                      <p className="text-purple-700 text-xs mt-2 font-semibold">Duration: Up to 2 years</p>
                      <p className="text-purple-600 text-xs mt-1">We use anonymized data and do not track individual users</p>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Cookie className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">4. Marketing Cookies (Optional)</h3>
                      <p className="text-gray-700 text-sm mb-2">
                        These cookies are used to show relevant content and opportunities.
                      </p>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        <li><strong>Job Recommendations:</strong> Suggest relevant job postings based on your profile</li>
                        <li><strong>Event Suggestions:</strong> Show alumni events you might be interested in</li>
                        <li><strong>Connection Recommendations:</strong> Suggest alumni in your field</li>
                        <li><strong>Content Personalization:</strong> Customize feed based on your interests</li>
                      </ul>
                      <p className="text-orange-700 text-xs mt-2 font-semibold">Duration: Up to 1 year</p>
                      <p className="text-orange-600 text-xs mt-1">All recommendations stay within the platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>

              <div className="space-y-3">
                <p className="text-gray-700">
                  We may use limited third-party services that set cookies:
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Cloudinary (Image Hosting)</h4>
                  <p className="text-sm text-gray-700">
                    Used to host and optimize profile pictures and post images. Essential for platform functionality.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Email Service Provider</h4>
                  <p className="text-sm text-gray-700">
                    Used for sending verification emails and notifications. Does not track your behavior on our platform.
                  </p>
                </div>

                <p className="text-gray-600 text-sm italic">
                  Note: We do not use advertising networks or social media trackers on Alumni Connect.
                </p>
              </div>
            </section>

            {/* Managing Cookies */}
            <section className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-sky-600" />
                Managing Your Cookie Preferences
              </h2>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">On Our Platform</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    You can manage your cookie preferences through our Cookie Consent banner that appears on your first visit.
                    You can also change your preferences anytime from your account settings.
                  </p>
                  <button className="text-sky-600 hover:text-sky-700 font-semibold text-sm underline">
                    Open Cookie Settings
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">In Your Browser</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Most browsers allow you to control cookies through settings:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                    <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-800 text-sm flex items-start">
                    <Trash2 className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> Disabling essential cookies will prevent you from logging in and using
                      core platform features. We recommend keeping essential cookies enabled for the best experience.
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Data Retention</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Retention Period</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Can Opt Out?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Essential</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Session - 30 days</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-semibold">No</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Functional</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 1 year</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">Yes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Analytics</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 2 years</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">Yes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Marketing</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 1 year</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Updates */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Updates to This Policy</h2>
              <p className="text-gray-700 text-sm">
                We may update this Cookie Policy to reflect changes in technology or legal requirements. We will notify you
                of significant changes through the platform or via email. Continued use after changes indicates acceptance.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> ace@bitsindri.ac.in</p>
                <p><strong>Address:</strong> ACE BIT Sindri, Dhanbad, Jharkhand - 828123</p>
              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
