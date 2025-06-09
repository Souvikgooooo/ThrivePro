import React, { useEffect, useState, Fragment } from 'react'; // Added Fragment
import { Calendar, Clock, User, MapPin, IndianRupee, ExternalLink, Briefcase, MessageSquare, X as XIcon } from 'lucide-react'; // Added MessageSquare, XIcon

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
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'in-progress' | 'PaymentCompleted'; // Added PaymentCompleted
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
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // State for payment modal

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
      case 'completed': return 'Service Completed'; // Clarified: service done, payment pending
      case 'PaymentCompleted': return 'Payment Completed'; // New status
      case 'rejected': return 'Rejected by Provider';
      default:
        const statusVal: any = order.status; 
        return typeof statusVal === 'string' ? statusVal.charAt(0).toUpperCase() + statusVal.slice(1) : 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-yellow-100 text-yellow-800'; // Changed color to indicate pending payment
      case 'PaymentCompleted': return 'bg-green-100 text-green-800'; // Color for payment completed
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Action buttons might change based on customer capabilities
  const renderActionButtons = () => {
    const actionButtons = [];

    // "Pay Here" button should appear if service is 'completed' (meaning service done, payment pending)
    if (order.status === 'completed') { 
      actionButtons.push(
        <button
          key="pay-here"
          onClick={() => onViewDetails(order)} // Open OrderDetails which contains the payment logic
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Pay Here
        </button>
      );
    } else if (order.status === 'PaymentCompleted') {
      actionButtons.push(
        <div key="payment-done" className="text-sm font-medium text-green-600">
          Payment Done
        </div>
      );
    } else if (order.status !== 'rejected') { // For other non-final states (excluding rejected and PaymentCompleted)
      if (order.status === 'accepted' || order.status === 'in-progress') {
        actionButtons.push(
          <button
            key="add-note"
            onClick={() => setIsNoteModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" // ring-secondary might not be defined, using gray
            title="Add Note for Provider"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        );
      }
      actionButtons.push(
        <button
          key="view-details"
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          View Details
          <ExternalLink className="ml-1 h-4 w-4" />
        </button>
      );
    }
  
    return <div className="flex space-x-2">{actionButtons}</div>;
  };
  
  const handleSendNote = () => {
    // In a real app, this would make an API call to save the note
    console.log(`Note for order ${order._id}: ${noteText}`);
    // Potentially clear noteText and close modal, or show success/error
    setIsNoteModalOpen(false);
    setNoteText(''); // Clear the note text after sending
    // toast.success('Note sent to provider!'); // Example toast
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
            <IndianRupee className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-700 font-medium flex items-center">
              <IndianRupee className="h-4 w-4 text-gray-700 mr-1" />{(order.servicePriceSnapshot || order.service.price).toFixed(2)}
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
            {renderActionButtons()}
          </div>
        </div>
      </div>

      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Note for Provider</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Enter any specific instructions or details for the provider..."
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsNoteModalOpen(false);
                  setNoteText(''); // Clear text if cancelled
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNote}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
              >
                Send Note
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Bill Details & Payment</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-500">Provider:</p>
                <p className="text-md text-gray-700">{order.provider.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service:</p>
                <p className="text-md text-gray-700">{order.serviceNameSnapshot || order.service.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time:</p>
                <p className="text-md text-gray-700">{displayDate} at {displayTime}</p>
              </div>
              <hr className="my-3"/>
              <div>
                <p className="text-sm text-gray-500">Service Charge:</p>
                <p className="text-xl font-bold text-gray-800 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />{(order.servicePriceSnapshot || order.service.price).toFixed(2)}
                </p>
              </div>
               {/* Add other bill details here if available, e.g., taxes, discounts */}
              <div className="border-t pt-3 mt-3">
                <p className="text-sm text-gray-500">Total Amount Due:</p>
                <p className="text-2xl font-bold text-primary flex items-center">
                 <IndianRupee className="h-6 w-6 mr-1" />{(order.servicePriceSnapshot || order.service.price).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 w-full sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log(`Attempting payment for order ${order._id} of amount ${(order.servicePriceSnapshot || order.service.price).toFixed(2)}`);
                  // Actual payment integration would go here
                  setIsPaymentModalOpen(false);
                  // Potentially update order status to 'paid' or similar after successful payment
                  // toast.success('Payment successful!'); 
                }}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md w-full sm:w-auto"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
