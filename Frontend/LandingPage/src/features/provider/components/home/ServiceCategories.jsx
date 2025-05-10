
import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Car, BookOpen, Home, Wrench, Zap } from 'lucide-react';

const services = [
  {
    name: 'Beauty & Wellness',
    description: 'Salon services, spa treatments, personal grooming, and more.',
    icon: Scissors,
    color: 'bg-pink-100 text-pink-600',
    link: '/services?category=beauty'
  },
  {
    name: 'Car Rental',
    description: 'Vehicle rentals, chauffeur services, and transportation solutions.',
    icon: Car,
    color: 'bg-blue-100 text-blue-600',
    link: '/services?category=car-rental'
  },
  {
    name: 'Tuition',
    description: 'Academic tutoring, skill development, and educational services.',
    icon: BookOpen,
    color: 'bg-amber-100 text-amber-600',
    link: '/services?category=tuition'
  },
  {
    name: 'Housekeeping',
    description: 'Home cleaning, maintenance, and property management services.',
    icon: Home,
    color: 'bg-green-100 text-green-600',
    link: '/services?category=housekeeping'
  },
  {
    name: 'Plumbing',
    description: 'Plumbing repairs, installations, and maintenance services.',
    icon: Wrench,
    color: 'bg-indigo-100 text-indigo-600',
    link: '/services?category=plumbing'
  },
  {
    name: 'Electrician',
    description: 'Electrical installations, repairs, and safety inspections.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
    link: '/services?category=electrician'
  }
];

const ServiceCategories = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Service Categories</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Manage and grow your business in any of these service categories
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link 
              to={service.link} 
              key={service.name}
              className="service-card group flex flex-col animate-fade-in card-hover"
            >
              <div className={`p-4 rounded-full w-16 h-16 flex items-center justify-center ${service.color} mb-4`}>
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <p className="mt-2 text-base text-gray-500 flex-grow">
                {service.description}
              </p>
              <div className="mt-4 flex items-center text-primary">
                <span className="text-sm font-medium">View services</span>
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCategories;
