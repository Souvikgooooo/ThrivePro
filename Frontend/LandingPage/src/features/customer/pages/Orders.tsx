// Define an interface for the Order object based on backend structure
interface Order {
  _id: string;
  service: {
    _id: string;
    name: string;
    description?: string;
    price: number;
  };
  // Assuming customer ID is sufficient, or define a User sub-interface if more details are populated
  customer: string; 
  provider: {
    _id: string;
    name: string;
    email?: string;
  };
  time_slot: string; // ISO Date string
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'in-progress' | 'PaymentCompleted'; // Match backend enum, added PaymentCompleted
  createdAt: string; // ISO Date string
  // Include other relevant fields from ServiceRequest model if they are sent and used
  serviceNameSnapshot?: string;
  servicePriceSnapshot?: number;
  customerAddress?: string; 
  // Add other potential fields from your ServiceRequest model that you might use
}

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError
import { useUser } from '@/context/UserContext.tsx'; // Import useUser
import Layout from '../components/layout/Layout';
import OrderTabs from '../components/orders/OrderTabs';
import OrderCard from '../components/orders/OrderCard.tsx'; // Explicitly import .tsx
import OrderDetails from '../components/orders/OrderDetails';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock order data removed

const Orders = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [orders, setOrders] = useState<Order[]>([]); // Typed state
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Typed state
  const { user } = useUser(); // Get user context for auth token

  // Define fetchOrders within the component scope so it can access user, setLoading, setOrders, toast
  const fetchOrders = React.useCallback(async () => {
    if (!user?.accessToken) {
      toast.error("Authentication required to view orders.");
      setLoading(false);
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/service-requests/customer', { // Corrected endpoint
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      if (response.data && Array.isArray(response.data.data?.serviceRequests)) { // Corrected data access path
        setOrders(response.data.data.serviceRequests as Order[]);
      } else {
        console.warn('Unexpected API response structure for customer orders:', response.data);
        setOrders([]);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Failed to fetch customer orders:', error);
      toast.error(error.response?.data?.message || 'Could not load your orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setOrders]); // Add dependencies for useCallback

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // useEffect depends on the memoized fetchOrders

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handlePaymentSuccess = (orderId: string) => {
    toast.success(`Payment for order ${orderId} was successful! Updating view...`);
    
    // Optimistically update the local order state
    setOrders(prevOrders =>
      prevOrders.map(o =>
        o._id === orderId ? { ...o, status: 'PaymentCompleted' as Order['status'] } : o
      )
    );
    
    // Fetch orders from the server to ensure consistency
    fetchOrders(); 
    
    // If the user is on the 'new' tab, and the order just moved to 'history', 
    // they might want to be switched to the history tab to see it.
    // Or, simply let them switch manually. For now, let's keep it simple.
    // Consider if (activeTab === 'new') setActiveTab('history');
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    // This function might not be directly used by customers if status changes are driven by providers/system.
    // However, keeping it for potential future use or local UI updates if needed.
    setOrders(prevOrders => prevOrders.map(o => 
      o._id === orderId ? { ...o, status: newStatus } : o
    ));
    
    // Toast messages can be adjusted based on actual customer actions
    toast.success('Order status updated locally (if applicable).');
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order: Order) => {
    if (activeTab === 'new') {
      // "Recent orders" or "Booked & Pending" or "In Progress"
      // 'completed' here means service done, but payment might be pending.
      return order.status === 'accepted' || order.status === 'in-progress' || order.status === 'completed'; 
    } else { // 'history' tab
      // 'PaymentCompleted' is the final state for history. 'rejected' also goes to history.
      return order.status === 'PaymentCompleted' || order.status === 'rejected'; 
    }
  });

  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

        <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span className="text-lg text-gray-600">Loading orders...</span>
            </div>
          </div>
        ) : (
          <>
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-xl text-gray-500">
                  {activeTab === 'new' 
                    ? 'No new orders at the moment' 
                    : 'No order history available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order._id} // Use _id from backend
                    order={order} // Pass the whole order object from backend
                    onViewDetails={handleViewDetails}
                    // onUpdateStatus might not be directly invoked by customer for all statuses
                    // It depends on whether customers can change order status (e.g. cancel)
                    onUpdateStatus={handleUpdateStatus} 
                  />
                ))}
              </div>
            )}
          </>
        )}

        {selectedOrder && (
          <OrderDetails 
            order={selectedOrder}
            onClose={handleCloseDetails}
            onPaymentSuccess={handlePaymentSuccess} // Pass the callback
          />
        )}
      </div>
    </Layout>
  );
};

export default Orders;
