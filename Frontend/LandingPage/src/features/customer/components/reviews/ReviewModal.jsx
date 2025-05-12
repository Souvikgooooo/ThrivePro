import React, { useState } from "react";
import { X } from "lucide-react"; // Import X icon for close button

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 w-full max-w-lg p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700 relative transform transition-all duration-300 ease-in-out scale-100 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-slate-700/50"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
          Share Your Experience
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-sky-300 mb-1">Service Name</label>
            <input
              id="serviceName"
              type="text"
              placeholder="e.g., House Cleaning, Plumbing Repair"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="providerName" className="block text-sm font-medium text-sky-300 mb-1">Provider Name (Optional)</label>
            <input
              id="providerName"
              type="text"
              placeholder="e.g., John Doe Services"
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-sky-300 mb-1">Your Feedback</label>
            <textarea
              id="comment"
              placeholder="Tell us about your experience..."
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all min-h-[100px]"
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-300 mb-2">Overall Rating</label>
            <div className="flex items-center space-x-1.5">
              {[...Array(5)].map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => handleStarClick(idx)}
                  className={`cursor-pointer text-3xl transition-colors duration-150 ${
                    idx < formData.rating ? "text-yellow-400" : "text-slate-600 hover:text-yellow-500/70"
                  }`}
                  title={`${idx + 1} star${idx === 0 ? '' : 's'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600/80 transition-colors duration-200 w-full sm:w-auto border border-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-teal-500/70"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
