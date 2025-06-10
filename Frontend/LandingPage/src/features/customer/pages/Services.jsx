import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/services/ServiceCard';
import ServiceForm from '../components/services/ServiceForm';
import ServiceFilters from '../components/services/ServiceFilters';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast'; // Corrected import path for custom toast
import TypingEffectText from '../../../components/ui/TypingEffectText'; // Corrected import path for TypingEffectText
import { ToastClose } from '../components/ui/toast'; // Import ToastClose component

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
    id: 4, // Keep for existing logic if any, or for temporary key if ServiceCard key isn't updated yet
    _id: "YOUR_REAL_OBJECT_ID_HERE", // Add your real MongoDB _id here
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
    image: 'https://cdn.dotpe.in/longtail/themes/8039141/wdNlMPur.webp',
    availability: true
  }
];

const Services = () => {
  const toastShown = useRef(false); // Ref to track if toast has been shown

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  //const [addingService, setAddingService] = useState(true);
  const [editingService, setEditingService] = useState(null);
  //const [searchQuery, setSearchQuery] = useState('');
  //const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortByName, setSortByName] = useState('');
  const [sortByPrice, setSortByPrice] = useState('');


  const { toast } = useToast(); // Get toast and dismiss from the hook

  // Load services (ensure it's using mock data)
  useEffect(() => {
    // Ensure we are using the mock initialServices
    const loadMockServices = () => {
      setServices(initialServices);
      setLoading(false);
    };
    loadMockServices(); // Using mock data

    // Display the welcome toast message only once
    if (!toastShown.current) {
      toast({
        title: "Important Information About Service Costs",
        description: (
          <TypingEffectText
            text="If you want to book any service at lowest cost you have to only pay for the service charges (including GST, platform charges, equipment charges etc.) and provider charges (varies upon the rate and skillsets of the provider)."
            onComplete={() => console.log('Typing complete!')} // No automatic dismissal
          />
        ),
        action: <ToastClose />, // Add the close button
        duration: Infinity, // Set duration to Infinity for persistence
        variant: "default",
      });
      toastShown.current = true;
    }
  }, []);

  const handleAddService = () => {
    setEditingService({
      _id: null, // Use _id for consistency
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

  const handleDeleteService = (_id) => { // Changed id to _id
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service._id !== _id)); // Use _id for filtering
      toast.success('Service deleted successfully');
    }
  };

  const handleFormSubmit = (serviceData) => {
    if (editingService && editingService._id) { // Use _id
      // Update existing service
      setServices(services.map(service =>
        service._id === serviceData._id ? serviceData : service // Use _id
      ));
      toast.success('Service updated successfully');
    } else {
      // Add new service
      const newService = {
        ...serviceData,
        // For mock data, generate a temporary unique _id if needed for keys, or rely on numerical id if still present
        _id: `temp-${Date.now()}`,
        id: services.length + 1 // Keep numerical id for mock data if other logic depends on it
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
  /*const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === '' || service.category === category;
    return matchesSearch && matchesCategory;
  });*/
  let filteredServices = [...services];

  if (searchQuery) {
    filteredServices = filteredServices.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (category) {
    filteredServices = filteredServices.filter(service =>
      service.category === category
    );
  }

  if (sortByName === 'name') {
    filteredServices.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortByName === 'name-desc') {
    filteredServices.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (sortByPrice === 'price-asc') {
    filteredServices.sort((a, b) => a.price - b.price);
  } else if (sortByPrice === 'price-desc') {
    filteredServices.sort((a, b) => b.price - a.price);
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
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
                  <p className="text-xl text-gray-500 mb-4">No services found at the moment.</p>
                  {/* Add service button removed from here */}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {sortedServices.map(service => (
                    <ServiceCard
                      key={service._id || service.id} // Use _id if available, fallback to id for mock
                      service={service}
                      onEdit={handleEditService}
                      onDelete={() => handleDeleteService(service._id || service.id)} // Pass correct id
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
