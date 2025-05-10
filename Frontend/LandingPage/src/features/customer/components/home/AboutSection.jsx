
import React from 'react';
import { Check } from 'lucide-react';

const AboutSection = () => {
  const features = [
    'Easy service management',
    'Customer booking system',
    'Flexible payment system with online and offline modes',
    'Service request management',
    'Order history and analytics'
  ];

  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                About ThrivePro
              </h3>
              <p className="mt-3 text-lg text-gray-500">
              ThrivePro is your one-stop destination for booking trusted local service providers—making it easy to get quality services at your convenience, right when you need them.
              </p>

              <dl className="mt-10 space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <dt className="text-base font-medium text-gray-900">{feature}</dt>
                    </div>
                  </div>
                ))}
              </dl>
              
              <div className="mt-10">
                <a href="#" className="text-primary font-medium hover:underline flex items-center">
                  Learn more about our platform
                  <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0 relative lg:pl-10">
              <div className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden lg:max-w-md">
                <img 
                  className="w-full object-cover" 
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Business management software on tablet" 
                />
              </div>
              <div className="absolute -bottom-6 -right-12 w-48 h-48 bg-indigo-100 rounded-full z-0 opacity-70"></div>
              <div className="absolute -top-12 -left-8 w-40 h-40 bg-blue-100 rounded-full z-0 opacity-70"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
