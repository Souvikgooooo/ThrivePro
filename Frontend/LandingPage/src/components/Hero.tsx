import React from 'react';
import { ArrowRight } from 'lucide-react';
import TypingEffectText from './ui/TypingEffectText'; // Import the new component

interface HeroProps {
  onLoginClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
  return (
    // Added overflow-hidden to prevent animations spilling out
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"> 
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Added animation classes */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}> 
            {/* Text colors made theme aware */}
            <h1 className="text-5xl font-bold text-foreground leading-tight"> 
              Simplify Life,{' '}
              <span className="block">All in One Place!</span>
            </h1>
            {/* Text colors made theme aware */}
            <div className="mt-6 text-xl text-muted-foreground h-20"> {/* Added a fixed height to prevent layout shift during typing */}
              <TypingEffectText text="Easily book trusted local services, stay connected with top providers, and enjoy a seamless experience—all through our all-in-one service booking platform." speed={150} /> {/* Increased speed for testing */}
            </div>
            <button 
              className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-all duration-300 inline-flex items-center group shadow-md hover:shadow-lg transform hover:-translate-y-1" // Added shadow and transform
              onClick={onLoginClick}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          {/* Added animation and hover effect */}
          <div className="relative animate-fade-in group" style={{ animationDelay: '0.4s' }}> 
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-full blur-3xl opacity-40 dark:opacity-50 animate-pulse"></div> {/* Adjusted theme aware gradient */}
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
              alt="Service Illustration"
              className="relative rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105" // Added hover scale and shadow
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
