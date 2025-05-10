
import React from 'react';
import Layout from '../components/layout/Layout.jsx';
import Hero from '../components/home/Hero.jsx';
import ServiceCategories from '../components/home/ServiceCategories.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import AboutSection from '../components/home/AboutSection.jsx';
import ContactSection from '../components/home/ContactSection.jsx';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <ServiceCategories />
      <AboutSection />
      <Testimonials />
      <ContactSection />
    </Layout>
  );
};

export default Home;
