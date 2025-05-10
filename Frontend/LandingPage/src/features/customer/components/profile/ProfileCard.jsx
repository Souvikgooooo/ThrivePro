
import React from 'react';
import { Camera, MapPin, Phone, Mail, Edit2 } from 'lucide-react';

const ProfileCard = ({ profile, onEditClick }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-accent h-32"></div>
      <div className="px-6 pb-6">
        <div className="relative flex justify-center">
          <div className="absolute -top-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
                {profile.profileImage ? ( // Assuming profileImage might not be in customer context
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl text-gray-400">{(profile.name || 'U').charAt(0).toUpperCase()}</span>
                )}
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
          <h2 className="text-2xl font-bold text-gray-900">{profile.name || 'User Name'}</h2>
          {/* <p className="text-gray-500">{profile.businessType}</p> // Removed businessType for customer */}

          <button 
            onClick={onEditClick}
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">
              {profile.address || 'Address not provided'}
            </span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">{profile.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">{profile.email || 'Email not provided'}</span>
          </div>
          {profile.signupDate && profile.signupDate !== 'N/A' && (
            <div className="flex items-center">
              <Edit2 className="h-5 w-5 text-gray-400 mr-2" /> {/* Using Edit2 as a placeholder for a calendar/date icon */}
              <span className="text-gray-600">Joined on: {profile.signupDate}</span>
            </div>
          )}
        </div>

        {/* Removed Business Details section for customer profile */}
        {/* 
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Business Details</h3>
          ...
        </div>
        */}
      </div>
    </div>
  );
};

export default ProfileCard;
