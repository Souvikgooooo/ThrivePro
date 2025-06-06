
import React, { useState } from 'react'; // Removed useEffect for mock loading
import Layout from '../components/layout/Layout';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext.tsx'; // Import useUser using @ alias

const Profile = () => {
  const { user } = useUser(); // Get user from context
  const [isEditing, setIsEditing] = useState(false);
  // Loading state can be based on user availability if needed, but protected route should ensure user exists
  const loading = !user; 

  // Prepare profile data from user context for ProfileCard and ProfileForm
  // The ProfileCard and ProfileForm will need to be adapted to these field names
  const profileData = user ? {
    name: user.name,
    email: user.email,
    phone: user.phone_number || 'N/A', // Use phone_number from context
    // Assuming 'createdAt' is the signup date. Format it if necessary.
    signupDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    address: user.address || 'N/A', // If address is in context
    // Other fields like businessName, proprietorName etc. are not in the basic User context
    // For a customer profile, these might not be relevant or would come from a different source
    // For now, focusing on name, email, phone, signupDate
  } : null;

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (updatedProfileData) => {
    // TODO: Implement actual profile update logic (e.g., API call)
    // For now, just update local state representation if any, or rely on context if it's updated elsewhere
    console.log("Updated profile data (client-side only for now):", updatedProfileData);
    // If user object in context needs to be updated, call setUser here or a dedicated update function
    setIsEditing(false);
    toast.success('Profile update simulated (no backend call yet)');
  };

  const handleFormCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="py-20 flex justify-center">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span className="text-lg text-gray-600">Loading profile...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Ensure profileData is not null before rendering components that use it
  if (!profileData) {
    return (
      <Layout>
        <div className="page-container">
          <p>User data not available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-gray-50"> {/* Added subtle background to layout */}
      <div className="max-w-3xl mx-auto p-4 md:p-8"> {/* Centered container with padding */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Your Profile</h1> {/* Enhanced title */}

        {isEditing ? (
          <ProfileForm
            profile={profileData} // Pass data derived from user context
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        ) : (
          <ProfileCard
            profile={profileData} // Pass data derived from user context
            onEditClick={handleEditProfile}
          />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
