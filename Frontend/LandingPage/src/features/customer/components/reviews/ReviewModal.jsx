import React, { useState } from "react";

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    providerName: "",
    rating: 0,
    comment: "",
  });

  const handleStarClick = (index) => {
    setFormData({ ...formData, rating: index + 1 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.serviceName && formData.rating > 0 && formData.comment) {
      onSubmit({ ...formData, helpful: 0 });
      onClose();
      setFormData({ serviceName: "", providerName: "", rating: 0, comment: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Service Name"
            className="w-full mb-3 px-3 py-2 border rounded"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Provider Name"
            className="w-full mb-3 px-3 py-2 border rounded"
            value={formData.providerName}
            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
          />
          <textarea
            placeholder="Your feedback..."
            className="w-full mb-3 px-3 py-2 border rounded"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
          />
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, idx) => (
              <span
                key={idx}
                onClick={() => handleStarClick(idx)}
                className={`cursor-pointer text-2xl ${
                  idx < formData.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
