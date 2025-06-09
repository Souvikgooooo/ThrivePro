
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { useUser } from '@/context/UserContext.tsx'; // Import useUser to get token
import Layout from '../components/layout/Layout';
import RequestCard from '../components/requests/RequestCard';
import { Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast'; // Use custom toast hook
import { ToastClose } from '../components/ui/toast'; // Import ToastClose
import TypingEffectText from '../../../components/ui/TypingEffectText'; // Import TypingEffectText

// Mock request data removed

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Get user context
  const { toast } = useToast(); // Get toast from the hook

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.accessToken) {
        toast({
          title: "Authentication Error",
          description: "Authentication required to view requests.",
          variant: "destructive",
          action: <ToastClose />,
          duration: Infinity,
        });
        setLoading(false);
        setRequests([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/service-requests/provider', {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        if (response.data && Array.isArray(response.data.data?.serviceRequests)) {
          const newRequests = response.data.data.serviceRequests;
          // Check for new pending requests to show a toast
          const previousRequestIds = new Set(requests.map(req => req._id));
          const newlyAddedRequests = newRequests.filter(req => req.status === 'pending' && !previousRequestIds.has(req._id));

          if (newlyAddedRequests.length > 0) {
            toast({
              title: "New Service Request!",
              description: (
                <TypingEffectText
                  text="You have new service requests! Review and respond to provide your excellent service."
                  onComplete={() => console.log('New request message typing complete!')}
                />
              ),
              action: <ToastClose />,
              duration: Infinity,
              variant: "default",
            });
          }
          setRequests(newRequests);
        } else {
          console.warn('Unexpected API response structure for provider requests:', response.data);
          setRequests([]);
        }
      } catch (error) {
        console.error('Failed to fetch provider requests:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || 'Could not load requests.',
          variant: "destructive",
          action: <ToastClose />,
          duration: Infinity,
        });
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, toast, requests]); // Added toast and requests to dependency array

  const handleAccept = async (requestId) => {
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
      const response = await axios.patch(`http://localhost:8000/api/service-requests/${requestId}/provider`, 
        { status: 'accepted' },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (response.data.status === 'success') {
        toast({
          title: "Request Accepted!",
          description: (
            <TypingEffectText
              text="You have accepted the service request. Please ensure to complete the service on time."
              onComplete={() => console.log('Request accepted message typing complete!')}
            />
          ),
          action: <ToastClose />,
          duration: Infinity,
          variant: "success",
        });
        setRequests(prevRequests => prevRequests.map(req => 
          req._id === requestId ? { ...req, status: 'accepted' } : req
        ).filter(req => req.status === 'pending'));
      } else {
        toast({
          title: "Failed to Accept",
          description: response.data.message || 'Failed to accept request.',
          variant: "destructive",
          action: <ToastClose />,
          duration: Infinity,
        });
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast({
        title: "Error Accepting Request",
        description: error.response?.data?.message || 'Error accepting request.',
        variant: "destructive",
        action: <ToastClose />,
        duration: Infinity,
      });
    }
  };

  const handleReject = async (requestId) => {
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
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        const response = await axios.patch(`http://localhost:8000/api/service-requests/${requestId}/provider`, 
          { status: 'rejected' },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        if (response.data.status === 'success') {
          toast({
            title: "Request Rejected!",
            description: (
              <TypingEffectText
                text="You have declined the service request. The customer has been notified."
                onComplete={() => console.log('Request rejected message typing complete!')}
              />
            ),
            action: <ToastClose />,
            duration: Infinity,
            variant: "default", // Or 'destructive' if it's a negative outcome for the provider
          });
          setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } else {
          toast({
            title: "Failed to Reject",
            description: response.data.message || 'Failed to reject request.',
            variant: "destructive",
            action: <ToastClose />,
            duration: Infinity,
          });
        }
      } catch (error) {
        console.error('Failed to reject request:', error);
        toast({
          title: "Error Rejecting Request",
          description: error.response?.data?.message || 'Error rejecting request.',
          variant: "destructive",
          action: <ToastClose />,
          duration: Infinity,
        });
      }
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service Requests & Payment Confirmation</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {requests.length} new request{requests.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span className="text-lg text-gray-600">Loading requests...</span>
            </div>
          </div>
        ) : (
          <>
            {requests.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-xl text-gray-500 mb-4">No pending service requests</p>
                <p className="text-gray-400">
                  When customers send you service requests, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {requests.map(request => (
                  <RequestCard
                    key={request._id} // Use _id from backend data
                    request={request} // Pass the whole request object
                    onAccept={() => handleAccept(request._id)}
                    onReject={() => handleReject(request._id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Requests;
