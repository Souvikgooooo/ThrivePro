import React from 'react';
import { Shield, Clock, Users, Award } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: 'Trusted Services',
      description: 'All our service providers are thoroughly vetted and verified for your peace of mind.'
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      title: '24/7 Availability',
      description: "Access our services anytime, anywhere. We're here when you need us."
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: 'Expert Professionals',
      description: 'Work with skilled and experienced professionals in every service category.'
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      title: 'Quality Guaranteed',
      description: 'We stand behind our service quality with satisfaction guarantee.'
    }
  ];

  return (
    // Added overflow-hidden
    <div className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"> 
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Added animation and hover effect */}
          <div className="relative animate-fade-in group" style={{ animationDelay: '0.2s' }}> 
            {/* Decorative background made theme aware */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-3xl blur-3xl opacity-40 dark:opacity-50"></div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
                alt="Team working"
                className="rounded-3xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-300 transform group-hover:scale-105" // Added hover scale/shadow
              />
              {/* Floating card made theme aware, added hover effect */}
              <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-xl p-6 max-w-xs border border-border/10 group-hover:shadow-2xl transition-shadow duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1"> 
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl">
                    <Award className="w-8 h-8 text-primary" /> {/* Icon color changed */}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">5+ Years</p>
                    <p className="text-muted-foreground">of Excellence</p> {/* Text color changed */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Main text made theme aware */}
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              Transforming Service
              <span className="block text-primary">Delivery Excellence</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground"> {/* Text color changed */}
              At ThrivePro, we're committed to revolutionizing how services are delivered. Our platform connects you with trusted professionals who are passionate about delivering exceptional service experiences.
            </p>
            
            {/* Added animation to features */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 animate-fade-in group hover:bg-secondary/50 dark:hover:bg-secondary/10 p-4 rounded-lg transition-colors duration-300" // Added animation, hover bg, padding
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }} // Staggered delay
                >
                  {/* Feature icon background and color made theme aware */}
                  <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"> {/* Added hover scale */}
                    {React.cloneElement(feature.icon, { className: "w-6 h-6 text-primary" })} {/* Icon color changed */}
                  </div>
                  <div>
                    {/* Feature text made theme aware */}
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-muted-foreground">{feature.description}</p> {/* Text color changed */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
