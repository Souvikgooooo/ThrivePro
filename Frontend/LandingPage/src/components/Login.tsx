// src/components/Login.tsx
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa'; // Google icon from react-icons
import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // useNavigate will not be used here directly
import { useUser } from '../context/UserContext'; // Import user context
import { useToast } from '../features/customer/hooks/use-toast'; // Import useToast hook
import { ToastClose } from '../features/customer/components/ui/toast'; // Import ToastClose

interface LoginProps {
  onClose: () => void;
  onSignUpClick: () => void; 
  onForgotPasswordClick: () => void; // Added to switch to Forgot Password modal
  onLoginSuccess?: (userData: any) => void; // Added for App.tsx to handle post-login
}

const Login: React.FC<LoginProps> = ({ onClose, onSignUpClick, onForgotPasswordClick, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast(); // Initialize toast hook
  // const { setUser } = useUser(); // setUser will be called via onLoginSuccess prop

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('handleSubmit called'); // Add this line for debugging

  if (!email || !password) {
    toast({
      title: "Error",
      description: "Please provide both email and password.",
      variant: "destructive",
    });
    return;
  }

  try {
    const response = await axios.post('http://localhost:8000/api/auth/login', {
      email,
      password,
    });

    console.log('Login Successful:', response.data);

    // Assuming the backend returns user data and accessToken on successful login
    const userData = {
      ...response.data.user, // Use user data from the backend response
      accessToken: response.data.accessToken, // Store the access token
      // Map backend 'provider' role to frontend 'serviceprovider' type
      type: response.data.user.role === 'provider' 
            ? 'serviceprovider' 
            : response.data.user.role as 'customer' // Assuming 'customer' role is direct
    };

    // Call onLoginSuccess if provided (App.tsx will handle setting user and navigation)
    if (onLoginSuccess) {
      onLoginSuccess(userData); // Pass the processed userData
    } else {
      // Fallback if onLoginSuccess is not provided, though App.tsx should always provide it
      // This case implies Login might be used elsewhere without this prop, which is unlikely here.
      // For robustness, could log an error or even call its own setUser if that's desired standalone behavior.
      // For this refactor, we assume App.tsx controls the user state via onLoginSuccess.
      console.error("onLoginSuccess prop not provided to Login component");
    }
    
    // The redirection is now handled by App.tsx based on user context change
    // console.log('User data type:', userData.type); 

    toast({
      title: "Success",
      description: "Login successful!",
      variant: "default", // Changed from 'success' to 'default'
      action: <ToastClose />, // Ensure close button is present
      duration: Infinity, // Ensure persistence
    });

    onClose(); // Close the modal

  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
      console.log('Backend error message:', errorMessage); // Log the specific backend message
    } else {
      console.error('Login Failed:', error); // Keep console.error for unexpected errors
      console.log('Raw error response data:', axios.isAxiosError(error) && error.response ? error.response.data : 'N/A'); // Log raw error data
    }
    toast({
      title: "Login Failed",
      description: errorMessage,
      variant: "destructive",
    });
  }
};

const handleLogout = async () => {
  // This logout logic should ideally be moved to UserContext or a shared auth service
  // For now, it remains, but it uses its own `setUser` if `useUser` was re-enabled above.
  // If `useUser` is commented out, this `setUser` would be undefined.
  // This part of the code is not directly affected by the onLoginSuccess change but highlights
  // that `setUser` from `useUser()` was available in this component's scope.
  const { setUser } = useUser(); // Re-enable for logout, or move logout to context
  try {
    await axios.post('http://localhost:8000/api/auth/logout');
    // Clear user from context (which also removes from localStorage)
    setUser(null); 
    // Redirect to landing page or login page
    window.location.href = 'http://localhost:5173/'; // Assuming landing page is on 5173
  } catch (error) {
    console.error('Logout Failed:', error);
    // Handle logout error (e.g., show a message)
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-primary">Log In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Log In
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button" // Important: type="button" to prevent form submission
            onClick={onForgotPasswordClick} // Use the passed handler
            className="text-sm text-primary hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        
        <div className="mt-6 py-4 px-4 bg-secondary/50 rounded-lg border border-border">
          <p className="text-center text-sm text-secondary-foreground">
            Don't have an account yet?{' '}
            <button
              onClick={onSignUpClick}
              className="font-semibold text-primary hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
