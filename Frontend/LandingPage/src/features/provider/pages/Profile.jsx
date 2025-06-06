
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
  const loading = !user;

  // Prepare profile data from user context
  const profileData = user ? {
    name: user.name, // For provider, this might be business name or proprietor name
    email: user.email,
    phone: user.phone_number || 'N/A',
    signupDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    address: user.address || 'N/A',
    // Provider-specific fields from context
    businessName: user.name, // Assuming user.name is the business name for providers
    proprietorName: user.name, // Or a different field if available
    service: user.service || 'N/A', // From UserContext User interface
    experience: user.experience || 'N/A', // From UserContext User interface
    tradeLicense: user.tradeLicense || 'N/A', // From UserContext User interface
    // Fields that were in mock but might not be in basic user context for provider:
    // businessType: user.businessType || 'N/A', // If available
    // establishmentYear: user.establishmentYear || 'N/A', // If available
    // businessHours: user.businessHours || 'N/A', // If available
    profileImage: user.profileImage || null // If available in context
  } : null;

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (updatedProfileData) => {
    // TODO: Implement actual profile update logic for provider
    console.log("Updated provider profile data (client-side only for now):", updatedProfileData);
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Business Profile</h1> {/* Enhanced title */}

        {isEditing ? (
          <ProfileForm
            profile={profileData}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isServiceProvider={true} // Indicate to form if different fields are needed
          />
        ) : (
          <ProfileCard
            profile={profileData}
            onEditClick={handleEditProfile}
            isServiceProvider={true} // Indicate to card if different display is needed
          />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
