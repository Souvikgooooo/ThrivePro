// Frontend/LandingPage/src/features/customer/components/orders/OrderDetails.d.ts
import React from 'react';

// Define an interface for the Order object based on backend structure
// This should ideally be in a shared types file and imported.
interface Order {
  _id: string;
  service: {
    _id: string;
    name: string;
    description?: string;
    price: number;
  };
  customer: string;
  provider: {
    _id: string;
    name: string;
    email?: string;
  };
  time_slot: string; // ISO Date string
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'in-progress' | 'PaymentCompleted'; // Match backend enum
  createdAt: string; // ISO Date string
  serviceNameSnapshot?: string;
  servicePriceSnapshot?: number;
  customerAddress?: string;
  // Add other potential fields from your ServiceRequest model that you might use
}

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onPaymentSuccess: (orderId: string) => void;
}

declare const OrderDetails: React.FC<OrderDetailsProps>;

export default OrderDetails;
