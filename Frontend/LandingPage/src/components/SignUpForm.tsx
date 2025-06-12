// src/components/SignUpForm.tsx
import React, { useState } from 'react';
import { User, Phone, Mail, Lock, CheckCircle } from 'lucide-react'; // Importing icons
import axios from 'axios'; // Import axios
// import { useNavigate } from 'react-router-dom'; // useNavigate will not be used here for redirection
import { useUser } from '../context/UserContext'; // Import user context
import { useToast } from '../features/customer/hooks/use-toast'; // Import useToast hook
import { ToastClose } from '../features/customer/components/ui/toast'; // Import ToastClose

interface FormData {
  name: string;
  phone_number: string;
  email: string;
  password: string;
  service?: string; // Only for service provider
  experience?: string; // Only for service provider
  tradeLicense?: string; // Only for service provider
  charges?: string; // New field for service provider
  address: string;
}

interface SignUpFormProps {
  role: 'serviceProvider' | 'customer';
  onBack: () => void;
  onClose: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ role, onBack, onClose }) => {
  // const navigate = useNavigate(); // Not used for primary redirection after signup
  const { setUser } = useUser(); // Get setUser function from context
  const { toast } = useToast(); // Initialize toast hook
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone_number: '',
    email: '',
    password: '',
    service: '',
    experience: '',
    tradeLicense: '',
    charges: '', // Initialize charges to an empty string
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    console.log('handleSubmit called');
    console.log(formData);

    // Client-side validation
    if (!formData.name || !formData.phone_number || !formData.email || !formData.password || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (role === 'serviceProvider') {
      if (!formData.service || !formData.experience || !formData.tradeLicense || !formData.charges) {
        toast({
          title: "Error",
          description: "Please fill in all service provider details.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        name: formData.name,
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.password,
        role: role === 'serviceProvider' ? 'provider' : role, // Send the role to the backend, mapping 'serviceProvider' to 'provider'
        address: formData.address,
        // Include service provider specific fields if applicable
        ...(role === 'serviceProvider' && {
          service: formData.service,
          experience: formData.experience,
          tradeLicense: formData.tradeLicense,
          charges: formData.charges, // Include charges
        }),
      });

      console.log('Registration successful:', response.data);

      // Assuming the backend returns user data on successful signup.
      // We'll merge form data for provider-specific fields to ensure they are in the context immediately.
      const backendUser = response.data.user; 
      // Assuming backend registration response might also include an accessToken at response.data.accessToken
      const accessToken = response.data.accessToken; 

      let userData = { 
        ...backendUser, 
        name: formData.name, 
        email: formData.email, 
        phone_number: formData.phone_number, 
        address: formData.address, 
        type: (role === 'serviceProvider' ? 'serviceprovider' : 'customer') as 'customer' | 'serviceprovider',
        ...(accessToken && { accessToken: accessToken }) // Add accessToken if present in response
      };

      if (role === 'serviceProvider') { // Add/override provider-specific fields
        userData = {
          ...userData,
          // 'name' is already taken from formData.name above, suitable for business name.
          service: formData.service,
          experience: formData.experience,
          tradeLicense: formData.tradeLicense,
        };
      }
      // No 'else' block is needed here as common fields are already set from formData.

      // Set user in context (which also saves to localStorage)
      setUser(userData);

      // Redirection is now handled by App.tsx based on user context change
      // No need for window.location.href here

      toast({
        title: "Success",
        description: "Registration successful!",
        variant: "default", // Changed from 'success' to 'default'
        action: <ToastClose />, // Ensure close button is present
        duration: Infinity, // Ensure persistence
      });

      onClose(); // Close the modal on successful signup
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        console.error('Registration error:', error); // Keep console.error for unexpected errors
      }
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"> {/* Added z-50 to ensure it's on top */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all max-h-[90vh] flex flex-col"> {/* Added max-h and flex structure */}
        <div className="p-6 sm:p-8 border-b border-gray-200"> {/* Header section */}
          <h2 className="text-2xl font-semibold text-center text-emerald-600">
            {role === 'serviceProvider' ? 'Service Provider Sign Up' : 'Customer Sign Up'}
          </h2>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto"> {/* Scrollable content area */}
          {/* Removed duplicated h2 and form tags that were here */}
          {/* The form starts below, within this scrollable div */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
            <User className="w-6 h-6 text-gray-600" />
            <input
              type="text"
              name="name"
              placeholder={role === 'serviceProvider' ? 'Service Provider Name' : 'Full Name'}
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-3 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Phone Number */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
            <Phone className="w-6 h-6 text-gray-600" />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full pl-3 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
            <Mail className="w-6 h-6 text-gray-600" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-3 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
            <Lock className="w-6 h-6 text-gray-600" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-3 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Conditional Fields for Service Provider */}
          {role === 'serviceProvider' && (
            <>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
                <CheckCircle className="w-6 h-6 text-gray-600" />
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full pl-3 text-gray-700 focus:outline-none"
                >
                  <option value="">Choose Service</option>
                  <option value="Bridal Makeup">Bridal Makeup</option>
                  <option value="Facial Treatment">Facial Treatment</option>
                  <option value="Haircut & Styling">Haircut & Styling</option>
                  <option value="Home Cleaning">Home Cleaning</option>
                  <option value="Manicure & Pedicure">Manicure & Pedicure</option>
                  <option value="Math Tutoring">Math Tutoring</option>
                </select>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
                <CheckCircle className="w-6 h-6 text-gray-600" />
                <input
                  type=" text"
                  name="experience"
                  placeholder="Experience (Years)"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full pl-3 text-gray-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
                <CheckCircle className="w-6 h-6 text-gray-600" />
                <input
                  type="text"
                  name="tradeLicense"
                  placeholder="Trade License"
                  value={formData.tradeLicense}
                  onChange={handleChange}
                  className="w-full pl-3 text-gray-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
                <CheckCircle className="w-6 h-6 text-gray-600" /> {/* Using CheckCircle as a generic icon */}
                <input
                  type="text"
                  name="charges"
                  placeholder="Add your charges (per service)"
                  value={formData.charges}
                  onChange={handleChange}
                  className="w-full pl-3 text-gray-700 focus:outline-none"
                />
              </div>

            </>
          )}

          {/* Address Field (Common to both roles) */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
            <User className="w-6 h-6 text-gray-600" /> {/* Using User icon as a generic placeholder, consider a location icon */}
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-3 text-gray-700 focus:outline-none"
              required // Make address required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
        </div>
        
        <div className="p-6 sm:p-8 border-t border-gray-200 mt-auto"> {/* Footer section, mt-auto pushes to bottom */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
