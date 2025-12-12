import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import alumniConnectLogo from '../../assets/logos/alumni_connect_logo-removebg-preview.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-300 overflow-hidden">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-shift"></div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                <img
                  src={alumniConnectLogo}
                  alt="Alumni Connect Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Alumni Connect</h3>
                <p className="text-sm text-orange-400 font-semibold">ACE BIT Sindri</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting generations of Civil Engineering students and alumni from BIT Sindri. Building a stronger community together.
            </p>
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-2">An initiative of</p>
              <div>
                <p className="text-base font-semibold text-white">ACE BIT Sindri</p>
                <p className="text-xs text-gray-400">Association of Civil Engineers</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/alumni">Alumni Directory</FooterLink>
              <FooterLink to="/opportunities">Opportunities</FooterLink>
              <FooterLink to="/events">Events</FooterLink>
              <FooterLink to="/donations">Donate to ACE</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <FooterLink to="/faq">FAQs</FooterLink>
              <FooterLink to="/help">Help & Support</FooterLink>
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
              <FooterLink to="/cookie-policy">Cookie Policy</FooterLink>
              <li>
                <a
                  href="https://acebits.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center space-x-1"
                >
                  <span>Visit ACE Website</span>
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <span>
                  Department of Civil Engineering<br />
                  BIT Sindri, Dhanbad<br />
                  Jharkhand, India - 828123
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:contact@acebits.in" className="hover:text-primary-400 transition-colors">
                  contact@acebits.in
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-primary-400 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-4">
              <h5 className="text-white font-medium text-sm mb-3">Follow ACE</h5>
              <div className="flex space-x-3">
                <SocialLink href="https://facebook.com/acebitsindri" icon={<Facebook size={20} />} label="Facebook" />
                <SocialLink href="https://twitter.com/acebitsindri" icon={<Twitter size={20} />} label="Twitter" />
                <SocialLink href="https://linkedin.com/company/acebitsindri" icon={<Linkedin size={20} />} label="LinkedIn" />
                <SocialLink href="https://instagram.com/acebitsindri" icon={<Instagram size={20} />} label="Instagram" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              <p>
                © {currentYear} Alumni Connect - ACE BIT Sindri. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                An initiative of the Association of Civil Engineers, BIT Sindri
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-primary-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgment Banner */}
      <div className="bg-primary-900 py-3">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-300">
            Proudly powered by{' '}
            <a
              href="https://acebits.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-300 hover:text-primary-200 font-semibold transition-colors"
            >
              ACE BIT Sindri
            </a>
            {' '}- Association of Civil Engineers
          </p>
        </div>
      </div>

      {/* Gradient Animation Styles */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </footer>
  );
};

// FooterLink Component
const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-gray-400 hover:text-primary-400 transition-colors inline-block"
    >
      {children}
    </Link>
  </li>
);

// SocialLink Component
const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({
  href,
  icon,
  label,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
