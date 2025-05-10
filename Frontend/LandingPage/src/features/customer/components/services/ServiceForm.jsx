
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ServiceForm = ({ service = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    image: '',
    availability: true
  });

  useEffect(() => {
    if (service.id) { // changeable to service.id for adding service button 
      setFormData({
        id: service.id,
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        duration: service.duration || '',
        category: service.category || '',
        image: service.image || '',
        availability: service.availability !== undefined ? service.availability : true
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      id: service.id || Date.now()
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {service.id ? 'Edit Service' : 'Add New Service'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Service Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input mt-1"
            placeholder="e.g. Haircut, Car Rental, Math Tutoring"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="form-input mt-1"
            placeholder="Describe your service"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="form-input mt-1"
              placeholder="29.99"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-input mt-1"
              placeholder="e.g. 1 hour, 30 mins, per day"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input mt-1"
            >
              <option value="">Select a category</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Car Rental">Car Rental</option>
              <option value="Tuition">Tuition</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrician">Electrician</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-input mt-1"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="availability"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
            Service is currently available
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {service.id ? 'Update Service' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
