import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, MapPin, IndianRupee, ExternalLink } from 'lucide-react';

const OrderCard = ({ order, onViewDetails }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Note: The logic for 'ORD-001' seems like mock data or specific handling
    // that might need review against the actual data (_id).
    if (order._id === 'ORD-001') { // Changed order.id to order._id
      const interval = setInterval(() => {
        const now = new Date();
        const target = new Date(`${order.date}T${order.time}`);
        const diff = target - now;

        if (diff <= 0) {
          setTimeLeft('00:00:00');
          clearInterval(interval);
        } else {
          const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
          const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
          const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
          setTimeLeft(`${hrs}:${mins}:${secs}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order.date, order.time, order._id]); // Changed order.id to order._id

  const getStatusLabel = () => {
    if (order._id === 'ORD-001') return 'Already Booked'; // Changed order.id to order._id
    if (order.status === 'pending') return 'Pending';
    if (order.status === 'completed') return 'Completed';
    if (order.status === 'in-progress') return 'Service Started';
    if (order.status === 'cancelled') return 'Cancelled';
    return order.status;
  };

  const getStatusColor = () => {
    if (order._id === 'ORD-001') return 'bg-gray-100 text-gray-800'; // Changed order.id to order._id
    switch (order.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-black-800';
    }
  };

  const renderActionButton = () => {
    if (order.status === 'completed') {
      return (
        <button
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center px-3 py-2 border border-green-500 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Pay Here
          <ExternalLink className="ml-1 h-4 w-4" />
        </button>
      );
    }
  
    if (order.status === 'cancelled') {
      return (
        <button
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center px-3 py-2 border border-red-500 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Pay Cancellation Fee
          <ExternalLink className="ml-1 h-4 w-4" />
        </button>
      );
    }
  
    return (
      <button
        onClick={() => onViewDetails(order)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        View Details
        <ExternalLink className="ml-1 h-4 w-4" />
      </button>
    );
  };
  

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-900">Order #{order._id}</h3> 
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start">
          <User className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{order.provider?.name ?? 'N/A'}</span>
        </div>

        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{order.time_slot ? new Date(order.time_slot).toLocaleDateString() : 'N/A'}</span>

          <Clock className="h-5 w-5 text-gray-400 ml-4 mr-2" />
          <span className="text-gray-600">{order.time_slot ? new Date(order.time_slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
        </div>

        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600 text-sm">{order.customerAddress ?? 'N/A'}</span>
        </div>

        <div className="flex items-center">
          <IndianRupee className="h-5 w-5 text-gray-400 mr-2" />
          {/* Use servicePriceSnapshot or service.price for amount, with fallback */}
          <span className="text-gray-900 font-semibold">
            ₹{(order.servicePriceSnapshot ?? order.service?.price ?? 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-500">Service Type:</span>
            <span className="ml-2 text-sm text-gray-900">{order.serviceNameSnapshot || order.service?.name || 'N/A'}</span>
          </div>
          {renderActionButton()}
        </div>

        {order._id === 'ORD-001' ? ( // Changed order.id to order._id
          <div className="mt-2 text-sm text-gray-600">
            <p className="text-red-700 font-medium">Awaiting acceptance by a service provider</p>
          </div>
        ) : order.status === 'pending' ? (
          <div className="mt-2 text-sm text-blue-600 font-medium">
            Time Left: {timeLeft}
          </div>
        ) : order.status === 'in-progress' ? (
          <div className="mt-2 text-sm text-green-600 font-medium">
            Service in progress. Hang tight!
          </div>
        ) : order.status === 'completed' ? (
          <div className="mt-2 text-sm text-green-600">
            Service completed successfully.
          </div>
        ) : order.status === 'cancelled' ? (
          <div className="mt-2 text-sm text-red-600">
            Cancelled by the customer.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderCard;
