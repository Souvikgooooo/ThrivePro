// src/components/LandingPage.tsx
import React, { useState } from 'react';
import { Car, GraduationCap, Home, Lightbulb, Scissors, Wrench } from 'lucide-react';
import SignUp from './SignUp';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Blog from './Blog';
import Contact from './Contact';
import Login from './Login';

function LandingPage() {
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const services = [
    { title: 'Bridal Makeup', description: 'Unveil your most radiant self with the best bridal makeup artistry — where elegance meets perfection.', icon: <Scissors className="w-8 h-8" />, color: 'from-pink-500 to-pink-600' },
    { title: 'Facial Treatment', description: 'Deep cleansing facial to rejuvenate your skin.', icon: <Scissors className="w-8 h-8" />, color: 'from-pink-500 to-pink-600' },
    { title: 'Haircut & Styling', description: 'Professional haircut and styling service tailored to your preferences.', icon: <Scissors className="w-8 h-8" />, color: 'from-pink-500 to-pink-600' },
    { title: 'Home Cleaning', description: 'Comprehensive home cleaning service.', icon: <Home className="w-8 h-8" />, color: 'from-blue-500 to-blue-600' },
    { title: 'Manicure & Pedicure', description: 'Luxury nail care treatment for hands and feet.', icon: <Scissors className="w-8 h-8" />, color: 'from-pink-500 to-pink-600' },
    { title: 'Math Tutoring', description: 'One-on-one math tutoring for students of all levels.', icon: <GraduationCap className="w-8 h-8" />, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <Navbar onLoginClick={() => setLoginOpen(true)} onSignUpClick={() => setSignUpOpen(true)} />
      <div id="home"><Hero onLoginClick={() => setLoginOpen(true)} /></div>
      <div id="about"><About /></div>
      <div id="services"><Services services={services} /></div>
      <Blog />
      <div id="contact"><Contact /></div>

      {isSignUpOpen && <SignUp onClose={() => setSignUpOpen(false)} onLoginClick={() => { setSignUpOpen(false); setLoginOpen(true); }} />}
      {isLoginOpen && <Login onClose={() => setLoginOpen(false)} onSignUpClick={() => { setLoginOpen(false); setSignUpOpen(true); }} onForgotPasswordClick={() => { /* TODO: Implement forgot password logic */ }} />}
    </div>
  );
}

export default LandingPage;
