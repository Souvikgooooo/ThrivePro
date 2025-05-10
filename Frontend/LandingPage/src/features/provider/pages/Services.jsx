import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/services/ServiceCard';
import ServiceForm from '../components/services/ServiceForm';
import ServiceFilters from '../components/services/ServiceFilters';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock service data
const initialServices = [
  {
    id: 1,
    name: 'Haircut & Styling',
    description: 'Professional haircut and styling service tailored to your preferences.',
    price: 35.99,
    duration: '45 mins',
    category: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 2,
    name: 'Manicure & Pedicure',
    description: 'Luxury nail care treatment for hands and feet.',
    price: 45.00,
    duration: '1 hour',
    category: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 3,
    name: 'Facial Treatment',
    description: 'Deep cleansing facial to rejuvenate your skin.',
    price: 55.00,
    duration: '1 hour',
    category: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 4,
    name: 'Bridal Makeup',
    description: 'Unveil your most radiant self with the best bridal makeup artistry — where elegance meets perfection.',
    price: 49.99,
    duration: '3 hours',
    category: 'Beauty & Wellness',
    image: 'assets/images/bridal-makeup.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 5,
    name: 'Tanning Session',
    description: 'Achieve a sun-kissed glow with our professional tanning service.',
    price: 30.00,
    duration: '1 hour',
    category: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  },
  {
    id: 6,
    name: 'Body Polish',

    description: 'Exfoliating body treatment to smooth and hydrate your skin.',
    price: 80.00,
    duration: '3 hours',
    category: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    availability: true
  }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  //const [addingService, setAddingService] = useState(true);
  const [editingService, setEditingService] = useState(null);
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

  const handleAddService = () => {
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

  const handleEditService = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = (id) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
      toast.success('Service deleted successfully');
    }
  };

  const handleFormSubmit = (serviceData) => {
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
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
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                    />
                  ))}
                </div>
              )}
            </>
          )
        )}
      </div>
    </Layout>
  );
};

export default Services;
