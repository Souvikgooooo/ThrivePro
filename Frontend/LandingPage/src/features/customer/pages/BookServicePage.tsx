import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@/context/UserContext.tsx';
import { toast } from 'sonner';

interface Service {
  _id: string; // Changed id to _id
  name: string;
  price: number;
}

interface Provider {
  _id: string;
  name: string;
  charges?: string; // Added charges field
  // Add other relevant provider details if needed, e.g., averageRating, specificPrice
}

interface FormData {
  customerName: string;
  phoneNumber: string;
  address: string;
  nearestPoint: string;
  date: string;
  time: string;
}

const BookServicePage: React.FC = () => {
  const location = useLocation();
  const { service } = location.state || {}; // Retrieve the service object from state

  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [providersLoading, setProvidersLoading] = useState<boolean>(false);
  const [totalCharges, setTotalCharges] = useState<number>(service.price); // Initialize with base service price

  if (!service) return <div>404 - Service Not Found</div>;

  const [formData, setFormData] = React.useState<FormData>({
    customerName: '',
    phoneNumber: '',
    address: '',
    nearestPoint: '',
    date: '',
    time: '',
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { user } = useUser(); // Get current user for customerId
  const navigate = useNavigate(); // For redirection

  // Fetch available providers when service changes
  useEffect(() => {
    if (service?.name) {
      const fetchProviders = async () => {
        setProvidersLoading(true);
        try {
          console.log(`Fetching providers for service: ${service.name}`);
          const response = await axios.get(`http://localhost:8000/api/provider/by-service/${encodeURIComponent(service.name)}`, {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`, 
            },
          });
          if (response.data && response.data.data && Array.isArray(response.data.data.providers)) {
            // Backend sends { _id, name }, map to what frontend might expect if it used 'id'
            // However, we changed Provider interface to use _id, so direct assignment is fine.
            setAvailableProviders(response.data.data.providers);
          } else {
            setAvailableProviders([]);
            console.warn("Unexpected response structure for providers or no providers found:", response.data);
          }
          setProvidersLoading(false); // Ensure loading is set to false after success
        } catch (error) {
          console.error('Failed to fetch providers:', error);
          setAvailableProviders([]); 
          toast.error('Could not load available providers.');
          setProvidersLoading(false);
        }
      };
      // Ensure user context is loaded before fetching, or handle user being null
      if (user?.accessToken) { // Only fetch if user token is available
        fetchProviders();
      } else if (user === null) { // User context loaded, but no user (not logged in)
        toast.error("Please log in to see available providers.");
        setProvidersLoading(false);
      }
      // If user is undefined, UserContext is still loading, useEffect will re-run when user changes.
    } else {
        setProvidersLoading(false); // If no service.name, not loading.
    }
  }, [service, user]); // Added user to dependency array

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedProviderId(selectedId);

    const selectedProvider = availableProviders.find(p => p._id === selectedId);
    if (selectedProvider && selectedProvider.charges) {
      const providerCharges = parseFloat(selectedProvider.charges);
      setTotalCharges(service.price + providerCharges);
    } else {
      setTotalCharges(service.price); // Reset to base price if no provider or charges
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProviderId) {
      toast.error("Please select a service provider.");
      return;
    }

    if (!user || !service) {
      toast.error("User or service details are missing. Cannot proceed.");
      return;
    }

    // Ensure the user object includes an accessToken
    if (!user.accessToken) {
      toast.error("Authentication token is missing. Please log in again.");
      // Optionally, you could navigate to login or trigger a logout here
      // import { useNavigate } from 'react-router-dom'; // at the top
      // const navigate = useNavigate(); // in the component
      // navigate('/'); // or navigate('/login');
      // import { useUser } from '@/context/UserContext.tsx'; // ensure logout is available if used
      // const { logout } = useUser();
      // logout();
      return;
    }

    // Ensure user._id is available and use it as customerId
    if (!user._id) {
      toast.error("Customer ID is missing. Cannot proceed with booking.");
      return;
    }

    // Combine date and time into a single ISO string for the backend
    const time_slot = `${formData.date}T${formData.time}:00`; // Assuming time is in HH:MM format

    const bookingPayload = {
      customerId: user._id, // Using user._id as customerId
      providerId: selectedProviderId,
      // service_id: service._id, // Backend will look up service by name and providerId
      serviceName: service.name,
      servicePrice: totalCharges, // Send total charges to backend
      customerName: formData.customerName,
      customerPhoneNumber: formData.phoneNumber,
      customerAddress: formData.address,
      nearestPoint: formData.nearestPoint,
      time_slot: time_slot, // Combined date and time
      status: 'pending', // Changed to lowercase to match backend enum
    };

    console.log('Submitting Booking Details:', bookingPayload);

    try {
      // TODO: Update API endpoint to the new service request endpoint
      // Example: 'http://localhost:8000/api/service-requests'
      const response = await axios.post('http://localhost:8000/api/service-requests', bookingPayload, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      
      console.log('Service request successful:', response.data);
      toast.success('Service request sent successfully! You will be notified upon confirmation.');
      // Navigate to a confirmation page or orders page
      navigate('/customer/orders', { state: { newServiceRequestId: response.data?.serviceRequest?._id || null } });
    } catch (error) {
      console.error('Service request failed:', error);
      let errorMessage = 'Booking failed. Please try again.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white shadow-2xl rounded-xl space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-600">
            Book Your Service
          </h1>
          <p className="mt-2 text-lg text-gray-600">Confirm details for: <span className="font-semibold text-emerald-700">{service.name}</span></p>
        </div>

        {/* Service Details Summary */}
        <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-3">Service Summary</h2>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-700">Service:</p>
            <p className="text-lg font-medium text-emerald-700">{service.name}</p>
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-lg text-gray-700">Price:</p>
            <p className="text-lg font-medium text-emerald-700">Rs{service.price.toFixed(2)}</p>
          </div>
          {selectedProviderId && (
            <div className="flex justify-between items-center mt-1">
              <p className="text-lg text-gray-700">Provider Charges:</p>
              <p className="text-lg font-medium text-emerald-700">
                Rs{availableProviders.find(p => p._id === selectedProviderId)?.charges || '0.00'}
              </p>
            </div>
          )}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-emerald-300">
            <p className="text-xl font-semibold text-gray-800">Total Bill:</p>
            <p className="text-xl font-bold text-emerald-800">Rs{totalCharges.toFixed(2)}</p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provider Selection Dropdown */}
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Select Service Provider</label>
            <select
              id="provider"
              name="provider"
              value={selectedProviderId || ''}
              onChange={handleProviderChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
              required
              disabled={providersLoading || availableProviders.length === 0}
            >
              <option value="" disabled>
                {providersLoading ? 'Loading providers...' : (availableProviders.length === 0 && service?.name ? 'No providers available for this service' : 'Select a provider')}
              </option>
              {availableProviders.map((provider) => (
                <option key={provider._id} value={provider._id}> {/* Use provider._id for key and value */}
                  {provider.name} {provider.charges ? `(Rs${provider.charges})` : ''}
                </option>
              ))}
            </select>
            {providersLoading && <p className="text-xs text-gray-500 mt-1">Fetching providers...</p>}
            {!providersLoading && availableProviders.length === 0 && service?.name && (
              <p className="text-xs text-red-500 mt-1">Currently, no providers are listed for {service.name}. Please check back later.</p>
            )}
          </div>

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="customerName"
              type="text"
              name="customerName"
              placeholder="Enter your full name"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
              required
            />
          </div>

          <div>
            <label htmlFor="nearestPoint" className="block text-sm font-medium text-gray-700 mb-1">Nearest Landmark (Optional)</label>
            <input
              id="nearestPoint"
              type="text"
              name="nearestPoint"
              placeholder="e.g., Near City Mall"
              value={formData.nearestPoint}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
              <input
                id="time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-sky-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Confirm & Book Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookServicePage;
