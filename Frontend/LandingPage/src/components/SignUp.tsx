// src/components/SignUp.tsx
import React, { useState } from 'react';
import { Handshake, UserPlus } from 'lucide-react'; // Importing role selection icons
import SignUpForm from './SignUpForm'; // Correct import for the default export

interface SignUpProps {
  onClose: () => void;
  onLoginClick: () => void; // Added to switch to Login modal
}

const SignUp: React.FC<SignUpProps> = ({ onClose, onLoginClick }) => {
  const [role, setRole] = useState<'serviceProvider' | 'customer' | null>(null);

  const handleRoleSelection = (selectedRole: 'serviceProvider' | 'customer') => {
    setRole(selectedRole);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 space-y-6 transform transition-all">
        {role === null ? (
          <div>
            <h2 className="text-3xl font-bold text-center mb-6 text-primary">Select Your Role</h2>
            <button
              onClick={() => handleRoleSelection('serviceProvider')}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg mb-4 hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 font-semibold"
            >
              <Handshake className="w-6 h-6" />
              <span>Service Provider</span>
            </button>
            <button
              onClick={() => handleRoleSelection('customer')}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 font-semibold"
            >
              <UserPlus className="w-6 h-6" />
              <span>Customer</span>
            </button>
            <div className="mt-6 py-4 px-4 bg-secondary/50 rounded-lg border border-border">
              <p className="text-center text-sm text-secondary-foreground">
                Already have an account?{' '}
                <button
                  onClick={onLoginClick}
                  className="font-semibold text-primary hover:underline"
                >
                  Log in here
                </button>
              </p>
            </div>
          </div>
        ) : (
          <SignUpForm role={role} onBack={() => setRole(null)} onClose={onClose} />
        )}
        {/* Close button for the main SignUp modal if no role is selected yet */}
        {role === null && (
          <div className="text-center mt-6"> {/* Increased top margin */}
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
