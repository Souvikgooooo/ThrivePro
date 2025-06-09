
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  Menu, X, User, Bell, ChevronDown, LogOut 
} from 'lucide-react';
import { useUser } from '../../../../context/UserContext.tsx'; // Adjusted path

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useUser(); // Get user and logout from context
  const navigate = useNavigate(); // For programmatic navigation after logout
  
  const customerBasePath = '/customer';
  const navigation = [
    { name: 'Home', to: `${customerBasePath}/` },
    { name: 'Services', to: `${customerBasePath}/services` },
    { name: 'Orders', to: `${customerBasePath}/orders` },
    { name: 'Reviews & Feedback', to: `${customerBasePath}/feedback` },
  ];
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const isCurrentPath = (path) => {
    // For the base path, allow exact match or match with trailing slash
    if (path === `${customerBasePath}/`) {
      return location.pathname === customerBasePath || location.pathname === `${customerBasePath}/`;
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={customerBasePath} className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">ThrivePro</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:space-x-4 md:items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={isCurrentPath(item.to) ? 'nav-link-active' : 'nav-link'}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* User Profile and Notifications */}
          <div className="hidden md:flex md:items-center">
            {/* <button className="p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors">
              <Bell size={20} />
            </button> */}
            
            <div className="relative ml-3">
              <div>
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 bg-white p-1 rounded-full text-gray-700 hover:text-primary focus:outline-none"
                >
                  <span className="font-medium text-sm hidden sm:block">{user?.name || 'User'}</span>
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <Link to={`${customerBasePath}/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false); // Close dropdown
                      navigate('/'); // Redirect to landing page
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`block pl-3 pr-4 py-2 border-l-4 ${
                  isCurrentPath(item.to)
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name || 'User Name'}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email || 'user@example.com'}</div>
              </div>
              {/*
              <button className="ml-auto p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-100">
                <Bell size={20} />
              </button>
              */}
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to={`${customerBasePath}/profile`}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Your Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false); // Close mobile menu
                  navigate('/'); // Redirect to landing page
                }}
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
