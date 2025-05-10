// src/components/Services.tsx
import React from 'react';

// Define the type for each service
interface Service {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

// Define the props for the Services component
interface ServicesProps {
  services: Service[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  // Helper function to extract the 'from' color for border
  const getBorderColorClass = (colorString: string): string => {
    const match = colorString.match(/from-([a-z]+)-(\d+)/);
    return match ? `border-${match[1]}-${match[2]}` : 'border-primary'; // Default to primary if parse fails
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8"> {/* Added padding */}
      <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Services</h2> {/* Added section title */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Adjusted grid and gap */}
        {services.map((service, index) => {
          const borderColorClass = getBorderColorClass(service.color);
          return (
            <div 
              key={index} 
              // Added animation and hover transform
              className={`bg-card p-6 rounded-lg shadow-lg border-t-4 ${borderColorClass} hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-2 animate-fade-in`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }} // Staggered delay
            >
              {/* Added hover scale to icon container */}
              <div className={`mb-4 p-3 rounded-full bg-primary/10 dark:bg-primary/20 ${borderColorClass.replace('border-', 'text-')} group-hover:scale-110 transition-transform duration-300`}> 
                {React.cloneElement(service.icon, { className: "w-8 h-8" })} 
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.description}</p> {/* Use muted-foreground */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
