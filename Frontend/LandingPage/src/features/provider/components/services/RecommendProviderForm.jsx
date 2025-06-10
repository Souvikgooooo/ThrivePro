import React, { useState } from 'react';
import { X } from 'lucide-react'; // For a close button if used in a modal
import { toast } from 'sonner'; // For notifications

const RecommendProviderForm = ({ onSubmit, onCancel, service }) => {
  const [providerName, setProviderName] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!providerName || !providerEmail || !yearsOfExperience) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(providerEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (isNaN(yearsOfExperience) || parseInt(yearsOfExperience) < 0) {
      toast.error('Years of experience must be a non-negative number.');
      return;
    }

    onSubmit({
      serviceId: service.id,
      serviceName: service.name,
      providerName,
      providerEmail,
      yearsOfExperience: parseInt(yearsOfExperience)
    });

    // Clear form
    setProviderName('');
    setProviderEmail('');
    setYearsOfExperience('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md relative transform transition-transform duration-300 ease-out scale-95 border border-gray-100">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Recommend a Provider for {service.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="providerName" className="block text-base font-semibold text-gray-700 mb-2">
              Provider Name
            </label>
            <input
              type="text"
              id="providerName"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="providerEmail" className="block text-base font-semibold text-gray-700 mb-2">
              Provider Email
            </label>
            <input
              type="email"
              id="providerEmail"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={providerEmail}
              onChange={(e) => setProviderEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-8">
            <label htmlFor="yearsOfExperience" className="block text-base font-semibold text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 shadow-md hover:scale-105"
            >
              Submit Recommendation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecommendProviderForm;
