import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, MessageCircle, User, Home, Users, Briefcase, Calendar, LogOut, Settings, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: 'student' | 'alumni';
  userName?: string;
  userAvatar?: string;
  unreadNotifications?: number;
  unreadMessages?: number;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  userRole,
  userName,
  userAvatar,
  unreadNotifications = 0,
  unreadMessages = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchExpanded(!isSearchExpanded);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = async () => {
    try {
      await logout();
      // Logout function in AuthContext will handle redirect
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login even if API call fails
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo & Nav Links */}
          <div className="flex items-center space-x-8">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Alumni Connect</h1>
                <p className="text-xs text-gray-500">by ACE BIT Sindri</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-1">
                <NavLink to="/dashboard" icon={<Home size={18} />}>
                  Home
                </NavLink>
                <NavLink to="/alumni" icon={<Users size={18} />}>
                  Alumni
                </NavLink>
                <NavLink to="/opportunities" icon={<Briefcase size={18} />}>
                  Opportunities
                </NavLink>
                <NavLink to="/events" icon={<Calendar size={18} />}>
                  Events
                </NavLink>
              </div>
            )}
          </div>

          {/* Center Section: Search Bar (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search alumni, posts, jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Right Section: Actions & Profile */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Search Icon (Mobile) */}
                <button
                  className="md:hidden p-2 text-gray-600 hover:text-primary-600 focus:outline-none"
                  onClick={toggleSearch}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Notifications */}
                <button
                  className="relative p-2 text-gray-600 hover:text-primary-600 focus:outline-none"
                  aria-label="Notifications"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Messages (Optional) */}
                <button
                  className="relative p-2 text-gray-600 hover:text-primary-600 focus:outline-none hidden sm:block"
                  aria-label="Messages"
                  onClick={() => navigate('/messages')}
                >
                  <MessageCircle size={20} />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 focus:outline-none"
                    onClick={toggleProfileDropdown}
                    aria-label="Profile menu"
                  >
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-primary-600" />
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700">{userName}</span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={toggleProfileDropdown}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-3 border-b border-gray-200">
                          <p className="font-medium text-gray-900">{userName}</p>
                          <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                        </div>
                        <div className="py-1">
                          <DropdownItem icon={<User size={16} />} onClick={() => navigate('/profile')}>
                            View Profile
                          </DropdownItem>
                          <DropdownItem icon={<Settings size={16} />} onClick={() => navigate('/settings')}>
                            Settings
                          </DropdownItem>
                          <DropdownItem icon={<HelpCircle size={16} />} onClick={() => navigate('/help')}>
                            Help & Support
                          </DropdownItem>
                        </div>
                        <div className="border-t border-gray-200 py-1">
                          <DropdownItem icon={<LogOut size={16} />} onClick={handleLogout} className="text-red-600">
                            Logout
                          </DropdownItem>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              // Not Authenticated: Login Buttons
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search (Expanded) */}
        {isAuthenticated && isSearchExpanded && (
          <div className="md:hidden py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search alumni, posts, jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu (Slide-in Sidebar) */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:text-primary-600">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <MobileNavLink to="/dashboard" icon={<Home size={20} />} onClick={toggleMobileMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/alumni" icon={<Users size={20} />} onClick={toggleMobileMenu}>
                Alumni Directory
              </MobileNavLink>
              <MobileNavLink to="/opportunities" icon={<Briefcase size={20} />} onClick={toggleMobileMenu}>
                Opportunities
              </MobileNavLink>
              <MobileNavLink to="/events" icon={<Calendar size={20} />} onClick={toggleMobileMenu}>
                Events
              </MobileNavLink>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

// NavLink Component for Desktop
const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  to,
  icon,
  children,
}) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

// MobileNavLink Component
const MobileNavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  >
    {icon}
    <span className="font-medium">{children}</span>
  </Link>
);

// DropdownItem Component
const DropdownItem: React.FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}> = ({ icon, children, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors',
      className
    )}
  >
    {icon}
    <span>{children}</span>
  </button>
);

export default Navbar;
