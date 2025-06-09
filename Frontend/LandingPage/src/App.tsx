import React, { useState, ReactNode } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Car, GraduationCap, Home as HomeIcon, Lightbulb, Scissors, Wrench } from 'lucide-react'; // Renamed Home to HomeIcon
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutDevelopersPage from './pages/AboutDevelopersPage'; // Added import
import About from './components/About';
import Services from './components/Services';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { useUser } from './context/UserContext.tsx'; // Adjusted path

// Customer Pages
import CustomerBookServicePage from './features/customer/pages/BookServicePage.tsx';
import CustomerFeedbackAndReviews from './features/customer/pages/FeedbackAndReviews.jsx';
import CustomerHome from './features/customer/pages/Home.jsx';
// import CustomerIndex from './features/customer/pages/Index.jsx'; // Or .tsx, decide which one
import CustomerNotFound from './features/customer/pages/NotFound.jsx'; // Or .tsx
import CustomerOrders from './features/customer/pages/Orders.tsx';
import CustomerProfile from './features/customer/pages/Profile.jsx';
import CustomerServices from './features/customer/pages/Services.jsx';

// Provider Pages
import ProviderHome from './features/provider/pages/Home.jsx';
// import ProviderIndex from './features/provider/pages/Index.jsx'; // Decide which one
import ProviderNotFound from './features/provider/pages/NotFound.jsx';
import ProviderOrders from './features/provider/pages/Orders.jsx';
import ProviderProfile from './features/provider/pages/Profile.jsx';
import ProviderRequests from './features/provider/pages/Requests.jsx';
import ProviderServices from './features/provider/pages/Services.jsx';
import { Toaster } from './components/ui/toaster'; // Import the Toaster component

interface LandingPageContentProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

function LandingPageContent({ onLoginClick, onSignUpClick }: LandingPageContentProps) {
  const services = [
    { title: 'House Keeping', description: 'Professional cleaning and maintenance services for your home', icon: <HomeIcon className="w-8 h-8" />, color: 'from-blue-500 to-blue-600' },
    { title: 'Electrical Services', description: 'Expert electrical installation and repair services', icon: <Lightbulb className="w-8 h-8" />, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Beauty & Wellness', description: 'Premium beauty and wellness services at your convenience', icon: <Scissors className="w-8 h-8" />, color: 'from-pink-500 to-pink-600' },
    { title: 'Private Tuition', description: 'Personalized education from experienced tutors', icon: <GraduationCap className="w-8 h-8" />, color: 'from-green-500 to-green-600' },
    { title: 'Plumbing Services', description: 'Professional plumbing solutions for all your needs', icon: <Wrench className="w-8 h-8" />, color: 'from-purple-500 to-purple-600' },
    { title: 'Car Rental', description: 'Wide range of vehicles for all your transportation needs', icon: <Car className="w-8 h-8" />, color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <Navbar onLoginClick={onLoginClick} onSignUpClick={onSignUpClick} />
      <div id="home"><Hero onLoginClick={onLoginClick} /></div>
      <div id="about"><About /></div>
      <div id="services"><Services services={services} /></div>
      <Blog />
      <Contact />
    </div>
  );
}

interface ProtectedRouteProps {
  allowedRoles: Array<'customer' | 'serviceprovider'>;
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    // Redirect to their respective dashboards or a generic unauthorized page
    return <Navigate to={user.type === 'customer' ? '/customer' : '/provider'} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};


function App() {
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const { user, setUser } = useUser(); // Get user and setUser from context

  const openLogin = () => setCurrentModal('login');
  const openSignUp = () => setCurrentModal('signup');
  const openForgotPassword = () => setCurrentModal('forgotPassword');
  const closeAllModals = () => setCurrentModal(null);

  // Function to handle actual login logic (to be called from Login component)
  // This is a placeholder - actual API call and user setting will be in Login.tsx
  const handleLoginSuccess = (userData: any) => {
    setUser(userData); // Set user in context
    closeAllModals();
    // Navigation will be handled by Login component or a redirect effect based on user type
  };


  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.type === 'customer' ? <Navigate to="/customer" replace /> : <Navigate to="/provider" replace />
            ) : (
              <>
                <LandingPageContent onLoginClick={openLogin} onSignUpClick={openSignUp} />
                {currentModal === 'signup' && <SignUp onClose={closeAllModals} onLoginClick={openLogin} />}
                {currentModal === 'login' && <Login onClose={closeAllModals} onSignUpClick={openSignUp} onForgotPasswordClick={openForgotPassword} onLoginSuccess={handleLoginSuccess} />}
                {currentModal === 'forgotPassword' && <ForgotPassword onClose={closeAllModals} onLoginClick={openLogin} />}
              </>
            )
          }
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* <Route path="/about-developers" element={<AboutDevelopersPage />} /> {/* This line will be removed */}

        {/* Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/customer/services" element={<CustomerServices />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/book-service" element={<CustomerBookServicePage />} />
          <Route path="/customer/feedback" element={<CustomerFeedbackAndReviews />} />
          <Route path="/customer/about" element={<AboutDevelopersPage />} /> {/* Changed route to /customer/about */}
          {/* Add other customer-specific routes here */}
        </Route>

        {/* Service Provider Routes */}
        <Route element={<ProtectedRoute allowedRoles={['serviceprovider']} />}>
          <Route path="/provider" element={<ProviderHome />} />
          <Route path="/provider/services" element={<ProviderServices />} />
          <Route path="/provider/orders" element={<ProviderOrders />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
          <Route path="/provider/requests" element={<ProviderRequests />} />
          <Route path="/provider/about" element={<AboutDevelopersPage />} /> {/* Added route for provider */}
          {/* Add other provider-specific routes here */}
        </Route>
        
        {/* Fallback for unmatched routes within customer or provider sections if needed, or a global NotFound */}
        {/* For simplicity, using a global NotFound for now. Specific ones can be added within ProtectedRoute if desired. */}
        <Route path="/customer/*" element={<CustomerNotFound />} />
        <Route path="/provider/*" element={<ProviderNotFound />} />
        {/* Consider a global NotFound page as well if no other route matches */}
        {/* <Route path="*" element={<GlobalNotFound />} /> */}
      </Routes>
      <Toaster /> {/* Render the Toaster component here */}
    </>
  );
}

export default App;
