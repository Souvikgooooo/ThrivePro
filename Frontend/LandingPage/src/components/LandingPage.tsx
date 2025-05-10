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
    { title: 'House Keeping', description: 'Professional cleaning...', icon: <Home className="w-8 h-8" />, color: 'from-blue-500 to-blue-600' },
    { title: 'Electrical Services', description: 'Expert electrical...', icon: <Lightbulb className="w-8 h-8" />, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Beauty & Wellness', description: 'Premium beauty...', icon: <Scissors className="w-8 h-8" />, color: 'from-pink-500 to-pink-600' },
    { title: 'Private Tuition', description: 'Personalized education...', icon: <GraduationCap className="w-8 h-8" />, color: 'from-green-500 to-green-600' },
    { title: 'Plumbing Services', description: 'Professional plumbing...', icon: <Wrench className="w-8 h-8" />, color: 'from-purple-500 to-purple-600' },
    { title: 'Car Rental', description: 'Wide range of vehicles...', icon: <Car className="w-8 h-8" />, color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <Navbar onLoginClick={() => setLoginOpen(true)} onSignUpClick={() => setSignUpOpen(true)} />
      <div id="home"><Hero /></div>
      <div id="about"><About /></div>
      <div id="services"><Services services={services} /></div>
      <Blog />
      <Contact />

      {isSignUpOpen && <SignUp />}
      {isLoginOpen && <Login />}
    </div>
  );
}

export default LandingPage;
