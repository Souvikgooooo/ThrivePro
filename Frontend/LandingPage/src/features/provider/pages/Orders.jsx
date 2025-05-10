import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import OrderTabs from '../components/orders/OrderTabs';
import OrderCard from '../components/orders/OrderCard';
import OrderDetails from '../components/orders/OrderDetails';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '@/context/UserContext.tsx';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useUser();

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
        // Only show requests with status 'pending', 'in-progress', 'completed', 'cancelled' as orders
        if (response.data && Array.isArray(response.data.data?.serviceRequests)) {
          setOrders(response.data.data.serviceRequests);
        } else {
          setOrders([]);
        }
      } catch (error) {
        setOrders([]);
        toast.error('Could not load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Optionally, allow provider to update order status (e.g., mark as completed)
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!user?.accessToken) return;
    try {
      await axios.patch(`http://localhost:8000/api/service-requests/${orderId}/provider`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
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
