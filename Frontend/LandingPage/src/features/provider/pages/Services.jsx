import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/services/ServiceCard';
import ServiceForm from '../components/services/ServiceForm';
import ServiceFilters from '../components/services/ServiceFilters';
import RecommendProviderForm from '../components/services/RecommendProviderForm'; // New import
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../../context/UserContext'; // Corrected import path

// Mock service data
const initialServices = [
  {
    id: 1,
    name: 'Haircut & Styling',
    description: 'Professional haircut and styling service tailored to your preferences.',
    price: 30.00,
    duration: '45 mins',
    category: 'Hairstyling', // Changed from Beauty & Wellness
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO5PomSrHN8seQMf5xmDn0uWpbESNBRqIZlg&s',
    availability: true
  },
  {
    id: 2,
    name: 'Manicure & Pedicure',
    description: 'Luxury nail care treatment for hands and feet.',
    price: 85.00,
    duration: '1 hour',
    category: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 3,
    name: 'Facial Treatment',
    description: 'Deep cleansing facial to rejuvenate your skin.',
    price: 115.00,
    duration: '1 hour',
    category: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 4,
    name: 'Bridal Makeup',
    description: 'Unveil your most radiant self with the best bridal makeup artistry — where elegance meets perfection.',
    price: 250.00,
    duration: '2 hours',
    category: 'Beauty & Wellness',
    image: 'https://i.pinimg.com/originals/22/35/d3/2235d35fe1852a9e716d667df6af8082.jpg',
    availability: true
  },
  {
    id: 5,
    name: 'Math Tutoring',
    description: 'One-on-one math tutoring for students of all levels.',
    price: 300.00,
    duration: '1 Month (4 sessions)',
    category: 'Tuition',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 6,
    name: 'Home Cleaning',
    description: 'Comprehensive home cleaning service.',
    price: 200.00,
    duration: '2 hours',
    category: 'Housekeeping',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  }
];

const Services = () => {
  const { user } = useUser(); // Get user from context
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showRecommendForm, setShowRecommendForm] = useState(false); // New state
  const [serviceToRecommend, setServiceToRecommend] = useState(null); // New state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Load services (simulate API call)
  useEffect(() => {
    const loadServices = () => {
      setTimeout(() => {
        setServices(initialServices);
        setLoading(false);
      }, 500); // Simulate loading delay
    };

    loadServices();
  }, []);

  const handleAddService = () => { // Re-added
    setEditingService({
      id: null,
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      image: '',
      availability: true
    });
    setShowForm(true);
  };

  // Removed handleEditService and handleDeleteService

  const handleFormSubmit = (serviceData) => { // Re-added
    if (editingService && editingService.id) {
      // Update existing service
      setServices(services.map(service => 
        service.id === serviceData.id ? serviceData : service
      ));
      toast.success('Service updated successfully');
    } else {
      // Add new service
      const newService = {
        ...serviceData,
        id: services.length + 1 // Generate a new ID based on the current length
      };
      setServices([...services, newService]);
      toast.success('Service added successfully');
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleRecommendClick = (service) => { // New function
    setServiceToRecommend(service);
    setShowRecommendForm(true);
  };

  const handleRecommendSubmit = async (recommendationData) => {
    console.log('Sending recommendation data:', {
      ...recommendationData,
      recommenderName: user.name
    }); // Added console.log for debugging
    try {
      const response = await fetch('/api/provider/recommend-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          ...recommendationData,
          recommenderName: user.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Recommendation email sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send recommendation email.');
      }
    } catch (error) {
      console.error('Error sending recommendation:', error);
      toast.error('An error occurred while sending the recommendation.');
    } finally {
      setShowRecommendForm(false);
      setServiceToRecommend(null);
    }
  };

  const handleRecommendCancel = () => { // New function
    setShowRecommendForm(false);
    setServiceToRecommend(null);
  };

  // Filter and sort services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === '' || service.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <Layout>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">View All Services</h1>
          <button
            onClick={handleAddService}
            className="btn-primary flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Service
          </button>
        </div>

        <ServiceFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span className="text-lg text-gray-600">Loading services...</span>
            </div>
          </div>
        ) : (
          showForm ? (
            <ServiceForm
              service={editingService}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          ) : (
            <>
              {sortedServices.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-xl text-gray-500 mb-4">No services found</p>
                  <button
                    onClick={handleAddService}
                    className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add your first service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {sortedServices.map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onRecommend={handleRecommendClick} // Pass the new prop
                    />
                  ))}
                </div>
              )}
            </>
          )
        )}

        {showRecommendForm && serviceToRecommend && ( // Conditionally render the form
          <RecommendProviderForm
            service={serviceToRecommend}
            onSubmit={handleRecommendSubmit}
            onCancel={handleRecommendCancel}
          />
        )}
      </div>
    </Layout>
  );
};

export default Services;
