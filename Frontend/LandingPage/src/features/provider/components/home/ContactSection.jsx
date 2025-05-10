
import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

const ContactSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Have questions or need assistance? Our support team is here to help.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Phone Support</h3>
            <p className="mt-2 text-base text-gray-500">
              Call us directly for immediate assistance
            </p>
            <a 
              href="tel:+15551234567" 
              className="mt-3 inline-block text-primary font-medium hover:underline"
            >
              +91 9163620567
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Email Support</h3>
            <p className="mt-2 text-base text-gray-500">
              Send us an email and we'll respond within 24 hours
            </p>
            <a 
              href="mailto:support@thrivepro.com" 
              className="mt-3 inline-block text-primary font-medium hover:underline"
            >
              support@thrivepro.com
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center md:col-span-2 lg:col-span-1">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Business Hours</h3>
            <p className="mt-2 text-base text-gray-500">
              Monday - Friday: 9am - 6pm IST<br />
              Saturday: 10am - 2pm IST<br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* <div className="mt-12 max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Send us a message</h3>
            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-input mt-1" 
                  placeholder="Your name" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-input mt-1" 
                  placeholder="Your email" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  className="form-input mt-1" 
                  placeholder="How can we help you?" 
                ></textarea>
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full btn-primary"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ContactSection;
