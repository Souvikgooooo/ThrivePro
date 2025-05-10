
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ServiceCard = ({ service, onEdit, onDelete }) => {
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
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(service)}
            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
