
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { useUser } from '@/context/UserContext.tsx'; // Import useUser to get token
import Layout from '../components/layout/Layout';
import RequestCard from '../components/requests/RequestCard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock request data removed

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Get user context

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.accessToken) {
        toast.error("Authentication required to view requests.");
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
          setRequests(response.data.data.serviceRequests);
        } else {
          console.warn('Unexpected API response structure for provider requests:', response.data);
          setRequests([]);
        }
      } catch (error) {
        console.error('Failed to fetch provider requests:', error);
        toast.error(error.response?.data?.message || 'Could not load requests.');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]); // Re-fetch if user changes (e.g., on login)

  const handleAccept = async (requestId) => {
    if (!user?.accessToken) {
      toast.error("Authentication required.");
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
        toast.success('Request accepted successfully!');
        // Update UI: either refetch or update locally
        setRequests(prevRequests => prevRequests.map(req => 
          req._id === requestId ? { ...req, status: 'accepted' } : req
        ).filter(req => req.status === 'pending')); // Example: only show pending, or update status and keep
      } else {
        toast.error(response.data.message || 'Failed to accept request.');
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast.error(error.response?.data?.message || 'Error accepting request.');
    }
  };

  const handleReject = async (requestId) => {
    if (!user?.accessToken) {
      toast.error("Authentication required.");
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
          toast.success('Request rejected successfully!');
          // Update UI: either refetch or update locally
          setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } else {
          toast.error(response.data.message || 'Failed to reject request.');
        }
      } catch (error) {
        console.error('Failed to reject request:', error);
        toast.error(error.response?.data?.message || 'Error rejecting request.');
      }
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
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
