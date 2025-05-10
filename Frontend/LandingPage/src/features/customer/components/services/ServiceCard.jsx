import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleBookClick = () => {
    navigate('/customer/book-service', { state: { service } }); // Prefixed with /customer
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{service.description}</p>

          <div className="mt-4 flex items-center">
            <span className="text-2xl font-bold text-gray-900">${service.price}</span>
            {service.duration && (
              <span className="ml-2 text-sm text-gray-500">/ {service.duration}</span>
            )}
          </div>

          {service.category && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {service.category}
              </span>
            </div>
          )}
        </div>

        {service.image && (
          <div className="ml-4">
            <img 
              src={service.image} 
              alt={service.name} 
              className="h-20 w-20 object-cover rounded-lg" 
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {service.availability ? "Available" : "Not Available"}
        </div>
        <div className="flex space-x-2 items-center">
          {service.availability && (
            <button
              onClick={handleBookClick}
              className="text-green-600 font-medium hover:text-green-800 transition-colors"
            >
              Want to Book
            </button>
          )}
          <button
            onClick={toggleLike}
            className={`p-2 rounded-md transition-colors focus:outline-none ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
            }`}
          >
            {isLiked ? <Heart fill="currentColor" size={18} /> : <Heart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
