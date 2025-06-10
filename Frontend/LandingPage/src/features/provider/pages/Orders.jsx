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
import { ExternalLink } from 'lucide-react';

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
                // Removed toast for Payment Received
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
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, toast]); // Removed orders from dependency array to prevent infinite loop

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Optionally, allow provider to update order status (e.g., mark as completed)
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!user?.accessToken) {
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

      // Removed toast for Order Status Updated!

    } catch (error) {
      console.error('Failed to update order status:', error);
      // Removed toast for Error Updating Status
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'new') {
      // Show 'accepted' (ready to be started) and 'in-progress' orders as new/active
      return order.status === 'accepted' || order.status === 'in-progress';
    } else if (activeTab === 'history') {
      // Show 'completed' and 'cancelled' (or 'rejected') as history
      return order.status === 'completed' || order.status === 'cancelled' || order.status === 'rejected';
    } else if (activeTab === 'payment-status') {
      // Show orders with 'PaymentCompleted' status
      return order.status === 'PaymentCompleted';
    }
    return false;
  });

  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
        <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} showPaymentStatusTab={true} />
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
                        : activeTab === 'history'
                          ? 'No order history available'
                          : 'No completed payments to display' // Message for payment-status tab when no orders
                      }
                    </p>
                  </div>
                ) : (
                  activeTab === 'payment-status' ? (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Status</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map(order => (
                          <div key={order._id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Order #{order._id}</h3>
                            <p className="text-gray-600 mt-2">Service: {order.serviceNameSnapshot || order.service?.name || 'N/A'}</p>
                            <p className="text-gray-600">Customer: {order.customer?.name ?? 'N/A'}</p>
                            <div className="mt-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Payment Completed
                              </span>
                            </div>
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              View Details
                              <ExternalLink className="ml-1 h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
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
                  )
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
