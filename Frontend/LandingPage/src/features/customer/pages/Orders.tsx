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

import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError
import { useUser } from '@/context/UserContext.tsx'; // Import useUser
import Layout from '../components/layout/Layout';
import OrderTabs from '../components/orders/OrderTabs';
import OrderCard from '../components/orders/OrderCard.tsx'; // Explicitly import .tsx
import OrderDetails from '../components/orders/OrderDetails';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast'; // Corrected import path for custom toast
import TypingEffectText from '../../../components/ui/TypingEffectText'; // Corrected import path for TypingEffectText
import { ToastClose } from '../components/ui/toast'; // Import ToastClose component

// Mock order data removed

const Orders = () => {
  const toastShown = useRef(false); // Ref to track if toast has been shown

  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [orders, setOrders] = useState<Order[]>([]); // Typed state
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Typed state
  const { user } = useUser(); // Get user context for auth token

  // Define fetchOrders within the component scope so it can access user, setLoading, setOrders, toast
  const fetchOrders = React.useCallback(async () => {
    if (!user?.accessToken) {
      toast({ title: "Authentication Error", description: "Authentication required to view orders.", variant: "destructive" });
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
      toast({ title: "Error", description: error.response?.data?.message || 'Could not load your orders.', variant: "destructive" });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setOrders]); // Add dependencies for useCallback

  const { toast } = useToast(); // Get toast and dismiss from the hook

  useEffect(() => {
    fetchOrders();

    // Display the welcome toast message for orders page only once
    if (!toastShown.current) {
      toast({
        title: "Welcome to Your Orders!",
        description: (
          <TypingEffectText
            text="Here track your current service state (booked, in progress etc.) and accordingly do payment after bill has been generated. If you still haven't booked any service, Book a service now!"
            onComplete={() => console.log('Typing complete!')} // No automatic dismissal
          />
        ),
        action: <ToastClose />, // Add the close button
        duration: Infinity, // Set duration to Infinity for persistence
        variant: "default",
      });
      toastShown.current = true;
    }
  }, [fetchOrders]); // useEffect depends on the memoized fetchOrders

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handlePaymentSuccess = (orderId: string) => {
    toast({
      title: "Payment Successful!",
      description: (
        <TypingEffectText
          text="Payment successful! Thank you for using our service. We hope you had a great experience!"
          onComplete={() => console.log('Payment success message typing complete!')}
        />
      ),
      action: <ToastClose />,
      duration: Infinity,
      variant: "default", // Changed from 'success' to 'default'
    });
    
    // Optimistically update the local order state
    setOrders(prevOrders =>
      prevOrders.map(o =>
        o._id === orderId ? { ...o, status: 'PaymentCompleted' as Order['status'] } : o
      )
    );
    
    // Fetch orders from the server to ensure consistency
    fetchOrders(); 
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    // This function might not be directly used by customers if status changes are driven by providers/system.
    // However, keeping it for potential future use or local UI updates if needed.
    setOrders(prevOrders => prevOrders.map(o => 
      o._id === orderId ? { ...o, status: newStatus } : o
    ));
    
    // For customer-side, toasts for status changes (accepted, rejected, in-progress, completed)
    // are best triggered when the data is fetched and a change is detected,
    // or if there's a real-time update mechanism.
    // For now, we'll focus on provider-side for these notifications.
    // The existing welcome toast and payment success toast are sufficient for explicit customer actions.
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
