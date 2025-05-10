// src/components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick }) => {
  return (
    <nav className="fixed w-full z-10 px-4 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 flex justify-between items-center shadow-lg border border-border/20">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ThrivePro</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium"
              onClick={onLoginClick}
            >
              Log In
            </button>
            <button
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors font-medium"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
