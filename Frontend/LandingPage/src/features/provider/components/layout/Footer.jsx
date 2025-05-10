
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-bold text-primary mb-4">ThrivePro</h3>
            <p className="text-gray-600 text-sm mb-4">
              Connecting customers with quality local service providers since 2023.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Beauty & Wellness</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Car Rental</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Tuition</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Housekeeping</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Plumbing</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Electrician</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary text-sm">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-primary text-sm">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary text-sm">Blog</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={16} className="text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">support@thrivepro.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  123 Business Avenue, Suite 100<br />
                  San Francisco, CA 94107
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} ThrivePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
