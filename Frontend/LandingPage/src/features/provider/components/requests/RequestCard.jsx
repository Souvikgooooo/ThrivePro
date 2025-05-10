
import React from 'react';
import { User, Calendar, Clock, MapPin, MessageSquare, Check, X } from 'lucide-react';

const RequestCard = ({ request, onAccept, onReject }) => {
  // request object from backend includes:
  // _id, customer, service (populated), time_slot, status, createdAt,
  // serviceNameSnapshot, servicePriceSnapshot, customerAddress, nearestPoint,
  // customerPhoneNumberSnapshot, customerNameSnapshot

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const serviceName = request.serviceNameSnapshot || request.service?.name || 'N/A';
  const customerName = request.customerNameSnapshot || request.customer?.name || 'N/A';
  const customerAddress = request.customerAddress || 'N/A';
  // Assuming 'message' could be request.nearestPoint or a specific field if added later
  const message = request.nearestPoint ? `Nearest Landmark: ${request.nearestPoint}` : null;


  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{serviceName}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
          request.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Unknown'}
        </span>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-start">
          <User className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
          <span className="text-gray-600">{customerName}</span>
        </div>
        
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
          <span className="text-gray-600">{formatDate(request.time_slot)}</span>
          
          <Clock className="h-5 w-5 text-gray-400 ml-4 mr-2 flex-shrink-0" />
          <span className="text-gray-600">{formatTime(request.time_slot)}</span>
        </div>
        
        {customerAddress !== 'N/A' && (
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{customerAddress}</span>
          </div>
        )}
      </div>
      
      {message && (
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <div className="flex">
            <MessageSquare className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Additional Details</p>
              <p className="text-sm text-gray-500 mt-1">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Only show Accept/Reject buttons if status is pending */}
      {request.status === 'pending' && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => onReject(request._id)} // Use request._id
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <X className="h-4 w-4 mr-1.5 text-gray-500" />
              Reject
            </button>
            <button
              onClick={() => onAccept(request._id)} // Use request._id
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Accept
            </button>
          </div>
        </div>
      )}
    </div> // Corrected: Removed extra closing divs
  );
};

export default RequestCard;
