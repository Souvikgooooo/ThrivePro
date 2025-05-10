import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, MapPin, DollarSign, ExternalLink, Briefcase } from 'lucide-react';

// Re-declared Order interface (ideally import from a central types file)
interface Order {
  _id: string;
  service: {
    _id: string;
    name: string;
    description?: string;
    price: number;
  };
  customer: string; // Customer ID
  provider: {
    _id: string;
    name: string;
    email?: string;
  };
  time_slot: string; // ISO Date string
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'in-progress';
  createdAt: string; // ISO Date string
  serviceNameSnapshot?: string; // Optional: if used from backend
  servicePriceSnapshot?: number; // Optional: if used from backend
  customerAddress?: string; // Optional: if available and needed
}

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void; // Kept for consistency, may not be used by customer
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onUpdateStatus }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Countdown logic for 'accepted' (booked) orders until their time_slot
    if (order.status === 'accepted' && order.time_slot) {
      const interval = setInterval(() => {
        const now = new Date();
        const target = new Date(order.time_slot);
        const diff = target.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft('Service time has arrived');
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hrs = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
          const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
          const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
          if (days > 0) {
            setTimeLeft(`${days}d ${hrs}:${mins}:${secs}`);
          } else {
            setTimeLeft(`${hrs}:${mins}:${secs}`);
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(''); // Clear if not applicable
    }
  }, [order.status, order.time_slot]);

  const getStatusLabel = () => {
    switch (order.status) {
      case 'pending': return 'Pending Provider'; // Customer is waiting for provider to accept
      case 'accepted': return 'Booked'; // Provider accepted, service is upcoming
      case 'in-progress': return 'Service in Progress';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected by Provider';
      default:
        // This case should ideally not be reached if order.status is always one of the above.
        // Return a generic or the status itself if it's an unexpected string.
        const statusVal: any = order.status; // Use 'any' to bypass 'never' for this line
        return typeof statusVal === 'string' ? statusVal.charAt(0).toUpperCase() + statusVal.slice(1) : 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800'; // Color for in-progress
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Action buttons might change based on customer capabilities (e.g., cancel a booked order)
  const renderActionButton = () => {
    // Example: Allow cancellation if order is 'accepted' (booked) and not too close to service time
    // This logic would need backend support and more complex rules
    // if (order.status === 'accepted') {
    //   return (
    //     <button
    //       onClick={() => onUpdateStatus(order._id, 'cancelled')} // Assuming 'cancelled' is a valid target status
    //       className="inline-flex items-center px-3 py-2 border border-red-500 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
    //     >
    //       Cancel Order
    //     </button>
    //   );
    // }
  
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
  
  const displayDate = new Date(order.time_slot).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const displayTime = new Date(order.time_slot).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-gray-800 truncate" title={order.serviceNameSnapshot || order.service.name}>
            {order.serviceNameSnapshot || order.service.name}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">Order ID: {order._id.substring(0, 8)}...</p>


        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-600">Provider: {order.provider.name}</span>
          </div>

          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{displayDate}</span>

            <Clock className="h-4 w-4 text-gray-400 ml-3 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{displayTime}</span>
          </div>

          {order.customerAddress && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{order.customerAddress}</span>
            </div>
          )}

          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-700 font-medium">
              ${(order.servicePriceSnapshot || order.service.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          {order.status === 'accepted' && timeLeft && (
            <div className="text-sm text-blue-600 font-medium">
              Time until service: {timeLeft}
            </div>
          )}
           {(order.status === 'pending') && (
            <div className="text-sm text-orange-600 font-medium">
              Awaiting provider confirmation...
            </div>
          )}
          {(order.status === 'in-progress') && (
            <div className="text-sm text-indigo-600 font-medium">
              Service currently in progress.
            </div>
          )}
          {(order.status === 'completed') && (
            <div className="text-sm text-green-600 font-medium">
              Service completed.
            </div>
          )}
          {(order.status === 'rejected') && (
            <div className="text-sm text-red-600 font-medium">
              Request rejected by provider.
            </div>
          )}
          <div className="ml-auto"> {/* Pushes button to the right */}
            {renderActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
