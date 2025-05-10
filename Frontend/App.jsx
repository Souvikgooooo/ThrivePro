import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerDashboard from './pages/CustomerDashboard';
import ServiceProviderDashboard from './pages/ServiceProviderDashboard';
import Login from './pages/Login';
import { useUser } from './LandingPage/src/context/UserContext';

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/customer"
        element={user?.type === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/serviceprovider"
        element={user?.type === 'serviceprovider' ? <ServiceProviderDashboard /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
