
import React from 'react';
import { Camera, MapPin, Phone, Mail, Edit2, CalendarDays } from 'lucide-react';

// Dynamically import all avatar images from the avatars directory
const avatarModules = import.meta.glob('/src/assets/images/avatars/*.{png,jpg,jpeg,svg}', { eager: true });

// Helper function to get the image URL
const getAvatarImageUrl = (filename) => {
  const path = `/src/assets/images/avatars/${filename}`;
  return avatarModules[path]?.default;
};

const ProfileCard = ({ profile, onEditClick }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative"> {/* Changed gradient colors */}
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div> {/* Optional: Add a subtle pattern */}
      </div>
      <div className="px-6 pb-6">
        <div className="relative flex justify-center">
          <div className="absolute -top-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                <img 
                  src={profile.profileImage && getAvatarImageUrl(profile.profileImage) 
                    ? getAvatarImageUrl(profile.profileImage) 
                    : getAvatarImageUrl('provider.jpeg') // Use the default provider avatar
                  } 
                  alt={profile.name || 'Provider'}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-200">
                <Camera className="h-5 w-5 text-gray-500" />
              </button>
              */}
            </div> {/* This closes the inner "relative" div */}
          </div> {/* This closes the "absolute -top-16" div */}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{profile.businessName || profile.name || 'Provider Name'}</h2>
          <p className="text-gray-500">{profile.service || 'Service not specified'}</p>

          <button 
            onClick={onEditClick}
            className="mt-6 inline-flex items-center px-6 py-2.5 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Edit2 className="mr-2 h-5 w-5" />
            Edit Profile
          </button>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 space-y-4">
          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
            <span className="text-base">
              {profile.address || 'Address not provided'}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <Phone className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
            <span className="text-base">{profile.phone}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Mail className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
            <span className="text-base">{profile.email || 'Email not provided'}</span>
          </div>
          {profile.signupDate && profile.signupDate !== 'N/A' && (
            <div className="flex items-center text-gray-700">
              <CalendarDays className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
              <span className="text-base">Joined on: {profile.signupDate}</span>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Provider Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Business/Proprietor Name</p>
              <p className="font-medium">{profile.proprietorName || profile.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Offered</p>
              <p className="font-medium">{profile.service || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">{profile.experience || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trade License</p>
              <p className="font-medium">{profile.tradeLicense || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
