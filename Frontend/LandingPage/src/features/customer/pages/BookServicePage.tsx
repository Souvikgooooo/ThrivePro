import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@/context/UserContext.tsx';
import { useToast } from '../hooks/use-toast'; // Use custom toast hook
import { ToastClose } from '../components/ui/toast'; // Import ToastClose
import TypingEffectText from '../../../components/ui/TypingEffectText'; // Import TypingEffectText

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
  const { toast } = useToast(); // Get toast from the hook, moved to top level

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
            setAvailableProviders(response.data.data.providers);
          } else {
            setAvailableProviders([]);
            console.warn("Unexpected response structure for providers or no providers found:", response.data);
          }
          setProvidersLoading(false);
        } catch (error) {
          console.error('Failed to fetch providers:', error);
          setAvailableProviders([]); 
          setProvidersLoading(false);
        }
      };
      if (user?.accessToken) {
        fetchProviders();
      } else if (user === null) {
        setProvidersLoading(false);
      }
    } else {
        setProvidersLoading(false);
    }
  }, [service, user, toast]); // Added toast to dependency array

  const handleProviderCardClick = (providerId: string) => {
    setSelectedProviderId(providerId);

    const selectedProvider = availableProviders.find(p => p._id === providerId);
    if (selectedProvider && selectedProvider.charges) {
      const providerCharges = parseFloat(selectedProvider.charges);
      setTotalCharges(service.price + providerCharges);
    } else {
      setTotalCharges(service.price);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProviderId) {
      return;
    }

    if (!user || !service) {
      return;
    }

    if (!user.accessToken) {
      return;
    }

    if (!user._id) {
      return;
    }

    const time_slot = `${formData.date}T${formData.time}:00`;

    const bookingPayload = {
      customerId: user._id,
      providerId: selectedProviderId,
      serviceName: service.name,
      servicePrice: totalCharges,
      customerName: formData.customerName,
      customerPhoneNumber: formData.phoneNumber,
      customerAddress: formData.address,
      nearestPoint: formData.nearestPoint,
      time_slot: time_slot,
      status: 'pending',
    };

    console.log('Submitting Booking Details:', bookingPayload);

    try {
      const response = await axios.post('http://localhost:8000/api/service-requests', bookingPayload, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      
      console.log('Service request successful:', response.data);
      navigate('/customer/orders', { state: { newServiceRequestId: response.data?.serviceRequest?._id || null } });
    } catch (error) {
      console.error('Service request failed:', error);
      let errorMessage = 'Booking failed. Please try again.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
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
            <h2 className="block text-sm font-medium text-gray-700 mb-2">Select Service Provider</h2>
            {providersLoading ? (
              <p className="text-center text-gray-500">Loading providers...</p>
            ) : availableProviders.length === 0 ? (
              <p className="text-center text-red-500">No providers available for this service.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableProviders.map((provider) => (
                  <div
                    key={provider._id}
                    className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 ease-in-out
                      ${selectedProviderId === provider._id
                        ? 'border-sky-500 ring-2 ring-sky-500 bg-sky-50'
                        : 'border-gray-300 bg-white hover:border-sky-400 hover:shadow-md'
                      }`}
                    onClick={() => handleProviderCardClick(provider._id)}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">{provider.name}</h3>
                    <p className="text-gray-600">Charges: <span className="font-medium text-emerald-700">Rs{provider.charges || '0.00'}</span></p>
                    {selectedProviderId === provider._id && (
                      <p className="text-sky-600 text-sm font-semibold mt-1">Selected</p>
                    )}
                  </div>
                ))}
              </div>
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
