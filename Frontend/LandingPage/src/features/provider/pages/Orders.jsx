import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import OrderTabs from '../components/orders/OrderTabs';
import OrderCard from '../components/orders/OrderCard';
import OrderDetails from '../components/orders/OrderDetails';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast'; // Use custom toast hook
import { ToastClose } from '../components/ui/toast'; // Import ToastClose
import TypingEffectText from '../../../components/ui/TypingEffectText'; // Import TypingEffectText
import axios from 'axios';
import { useUser } from '@/context/UserContext.tsx';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useUser();
  const { toast } = useToast(); // Get toast from the hook

  // Fetch provider's accepted/pending orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.accessToken) {
        toast({
          title: "Authentication Error",
          description: "Authentication required to view orders.",
          variant: "destructive",
          action: <ToastClose />,
          duration: Infinity,
        });
        setOrders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/service-requests/provider', {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        if (response.data && Array.isArray(response.data.data?.serviceRequests)) {
          const fetchedOrders = response.data.data.serviceRequests;
          
          // Detect status changes for toasts
          const previousOrdersMap = new Map(orders.map(order => [order._id, order.status]));

          fetchedOrders.forEach(newOrder => {
            const oldStatus = previousOrdersMap.get(newOrder._id);
            if (oldStatus && oldStatus !== newOrder.status) {
              // Status has changed
              if (newOrder.status === 'PaymentCompleted') {
                toast({
                  title: "Payment Received!",
                  description: (
                    <TypingEffectText
                      text="Payment received for a completed service! Great job!"
                      onComplete={() => console.log('Payment received message typing complete!')}
                    />
                  ),
                  action: <ToastClose />,
                  duration: Infinity,
                  variant: "default", // Changed from 'success' to 'default'
                });
              }
              // Add other status change toasts here if needed for provider side
            }
          });

          setOrders(fetchedOrders);
        } else {
          setOrders([]);
          console.warn('Unexpected API response structure for provider orders:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch provider orders:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || 'Could not load orders.',
          variant: "destructive",
          action: <ToastClose />,
          duration: Infinity,
        });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, toast, orders]); // Added toast and orders to dependency array

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Optionally, allow provider to update order status (e.g., mark as completed)
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!user?.accessToken) {
      toast({
        title: "Authentication Required",
        description: "Authentication required.",
        variant: "destructive",
        action: <ToastClose />,
        duration: Infinity,
      });
      return;
    }
    try {
      await axios.patch(`http://localhost:8000/api/service-requests/${orderId}/provider`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      
      let toastMessage = '';
      let toastVariant = 'default';

      switch (newStatus) {
        case 'in-progress':
          toastMessage = "Service status updated to 'In Progress'. Keep up the great work!";
          toastVariant = 'default'; // Or 'info' if you have one
          break;
        case 'completed':
          toastMessage = "Service marked as 'Completed'. The customer can now proceed with payment.";
          toastVariant = 'default'; // Changed from 'success' to 'default'
          break;
        // Add other cases if providers can change to other statuses
        default:
          toastMessage = `Order status updated to ${newStatus}.`;
          toastVariant = 'default';
      }

      toast({
        title: "Order Status Updated!",
        description: (
          <TypingEffectText
            text={toastMessage}
            onComplete={() => console.log('Status update message typing complete!')}
          />
        ),
        action: <ToastClose />,
        duration: Infinity,
        variant: toastVariant,
      });

    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: "Error Updating Status",
        description: error.response?.data?.message || 'Failed to update order status.',
        variant: "destructive",
        action: <ToastClose />,
        duration: Infinity,
      });
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'new') {
      // Show 'accepted' (ready to be started) and 'in-progress' orders as new/active
      return order.status === 'accepted' || order.status === 'in-progress';
    } else {
      // Show 'completed' and 'cancelled' (or 'rejected') as history
      return order.status === 'completed' || order.status === 'cancelled' || order.status === 'rejected';
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
                    key={order._id}
                    order={order}
                    onViewDetails={handleViewDetails}
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
          />
        )}
      </div>
    </Layout>
  );
};

export default Orders;
