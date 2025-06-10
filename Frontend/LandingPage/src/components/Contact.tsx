import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../features/customer/hooks/use-toast'; // Corrected path

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const developers = [
    { name: 'Souvik Ghosh', email: 'sg@lsp.com' },
    { name: 'Soumyadip Paul', email: 'sp@lsp.com' },
    { name: 'Sourav Kumar', email: 'sk@lsp.com' },
    { name: 'Priyanath Bhukta', email: 'pb@lsp.com' },
    { name: 'Trisha Ghosh', email: 'tg@lsp.com' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8000/api/contact', formData);
      if (response.data.status === 'success') {
        toast({
          title: 'Message Sent!',
          description: 'Your message has been successfully sent to the development team.',
          variant: 'default',
        });
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        toast({
          title: 'Failed to Send Message',
          description: response.data.message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast({
        title: 'Error',
        description: 'There was an error sending your message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {/* Section text made theme aware */}
          <h2 className="text-4xl font-bold text-foreground">Get in Touch</h2>
          <p className="mt-4 text-xl text-muted-foreground">Have questions? We're here to help!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Dev team card made theme aware, added animation */}
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-semibold text-card-foreground mb-6">Our Development Team</h3>
            <div className="space-y-6">
              {developers.map((dev, index) => (
                // Individual dev item made theme aware, added hover effect
                <div key={index} className="flex items-center space-x-4 p-4 bg-background rounded-lg hover:bg-secondary/50 dark:hover:bg-secondary/10 transition-all duration-300 border border-border hover:shadow-md hover:border-primary/20">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-primary" /> {/* Icon color changed */}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{dev.name}</h4> {/* Text color changed */}
                    <p className="text-primary text-sm">{dev.email}</p> {/* Text color changed */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form made theme aware, added animation */}
          <div className="bg-primary rounded-2xl shadow-lg p-8 text-primary-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-primary-foreground/80">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 focus:border-primary-foreground focus:ring-2 focus:ring-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/60"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-primary-foreground/80">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 focus:border-primary-foreground focus:ring-2 focus:ring-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/60"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-primary-foreground/80">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 focus:border-primary-foreground focus:ring-2 focus:ring-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/60"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-foreground text-primary py-2 px-4 rounded-lg font-medium hover:bg-primary-foreground/90 transition-colors flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="ml-2 w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
