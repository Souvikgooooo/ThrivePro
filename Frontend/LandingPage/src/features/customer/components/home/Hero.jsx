
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TypingEffectText from '../../../../components/ui/TypingEffectText'; // Corrected import path

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-primary">
              Experience hassle-free service booking anytime, anywhere
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-gray-900">Local Service</span>
                <span className="block text-primary">Provider Platform</span>
              </span>
            </h1>
            <div className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl h-24"> {/* Added fixed height */}
              <TypingEffectText text="Easily book trusted local services, stay connected with top providers, and enjoy a seamless experience—all through our all-in-one service booking platform." speed={50} />
            </div>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start sm:justify-center lg:justify-start">
                <Link to="/customer/services" className="btn-primary inline-flex items-center">
                  Book Services Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  to="/customer/about" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-yellow-400 text-base font-medium rounded-md shadow-sm text-yellow-500 bg-transparent hover:bg-yellow-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transform transition-all duration-300 ease-in-out hover:scale-105 group"
                >
                  <b>Learn More</b>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Service provider dashboard on laptop"
                />
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <div className="bg-white bg-opacity-75 rounded-full p-3">
                    <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
