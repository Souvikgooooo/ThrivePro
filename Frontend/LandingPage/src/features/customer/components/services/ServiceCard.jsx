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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-blue-400 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{service.description}</p>

          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">₹ {service.price}</span>
            {service.duration && (
              <span className="ml-2 text-sm text-gray-500">/ {service.duration}</span>
            )}
          </div>

          {service.category && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {service.category}
              </span>
            </div>
          )}
        </div>

        {service.image && (
        <div className="ml-4 flex-shrink-0">
            <img 
              src={service.image} 
              alt={service.name} 
              className="h-24 w-24 object-cover rounded-lg shadow-md" 
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm font-medium">
          {service.availability ? (
            <span className="text-green-600">Available</span>
          ) : (
            <span className="text-red-600">Not Available</span>
          )}
        </div>
        <div className="flex space-x-3 items-center">
          {service.availability && (
            <button
              onClick={handleBookClick}
              className="bg-blue-400 text-white px-5 py-2 rounded-full text-base font-semibold hover:bg-blue-500 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Want to Book
            </button>
          )}
          <button
            onClick={toggleLike}
            className={`p-2 rounded-full transition-colors focus:outline-none ${
              isLiked ? 'text-red-500 bg-red-100' : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
            } shadow-sm`}
          >
            {isLiked ? <Heart fill="currentColor" size={20} /> : <Heart size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
