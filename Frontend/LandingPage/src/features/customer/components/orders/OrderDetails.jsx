import React, { useState } from 'react';
import { 
  X, User, Calendar, Clock, MapPin, Phone, Mail, 
  CreditCard, File, MessageSquare, DollarSign, Tag 
} from 'lucide-react';

const OrderDetails = ({ order, onClose }) => {
  const [customerNote, setCustomerNote] = useState('');

  if (!order) return null;

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Pending'
      },
      'completed': {
        className: 'bg-green-100 text-green-800',
        label: 'Completed'
      },
      'cancelled': {
        className: 'bg-red-100 text-red-800',
        label: 'Cancelled'
      },
      'in-progress': {
        className: 'bg-blue-100 text-blue-800',
        label: 'In Progress'
      }
    };
    
    const statusInfo = statusMap[status] || { className: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Order Details #{order._id}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              {getStatusBadge(order.status)}
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${(order.servicePriceSnapshot ?? order.service?.price ?? 0).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Service Provider Information</h3>
              
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{order.provider?.name ?? 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{order.provider?.phone ?? 'N/A'}</p> 
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{order.provider?.email ?? 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <File className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="text-gray-900">2-3 years</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Service Details</h3>
              
              <div className="flex items-start">
                <Tag className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Service Type</p>
                  <p className="text-gray-900">{order.serviceNameSnapshot || order.service?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-gray-900">{order.time_slot ? formatDate(order.time_slot) : 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-gray-900">{order.time_slot ? new Date(order.time_slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                 <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                 <div>
                   <p className="text-sm font-medium text-gray-500">Location</p>
                   <p className="text-gray-900">{order.customerAddress ?? 'N/A'}</p>
                 </div>
              </div>

              <div className="flex items-start">
                <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-gray-900">{order.paymentMethod ?? 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conditional Rendering for Completed and Cancelled Orders */}
          {order.status === 'completed' && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Bill Generation</h3>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                {/* Simplified bill item based on service, as order.items is not in Order interface */}
                {order.service && (
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-900">{order.serviceNameSnapshot || order.service.name}</p>
                      <p className="text-sm text-gray-500">{order.service.description || 'Main service'}</p>
                    </div>
                    <p className="font-medium text-gray-900">${(order.servicePriceSnapshot ?? order.service.price ?? 0).toFixed(2)}</p>
                  </div>
                )}
                {/* If order.items existed and was an array:
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <p className="font-medium text-gray-900">${(item.price ?? 0).toFixed(2)}</p>
                  </div>
                ))}
                */}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="text-gray-900">${((order.servicePriceSnapshot ?? order.service?.price ?? 0) - (order.tax ?? 0)).toFixed(2)}</p>
                </div>
                {(order.tax ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <p className="text-gray-500">Tax</p>
                    <p className="text-gray-900">${(order.tax ?? 0).toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <p className="text-gray-900">Total</p>
                  <p className="text-gray-900">${(order.servicePriceSnapshot ?? order.service?.price ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Reasons behind cancellation</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-start mb-2">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md resize-none text-sm"
                    rows="4"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Mention if we have to update anything about our services or reason behind your cancellation"
                  />
                </div>
                <div className="text-right">
                  <button
                    onClick={() => {
                      console.log('Message sent:', customerNote);
                      setCustomerNote('');
                    }}
                    className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Close
            </button>

            {order.status === 'completed' && (
              <button
                onClick={() => {
                  console.log('Pay Now for completed service');
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Pay Now
              </button>
            )}

            {order.status === 'cancelled' && (
              <button
                onClick={() => {
                  console.log('Pay Cancellation Fee');
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
              >
                Pay Reasonable Cancellation Fee Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
