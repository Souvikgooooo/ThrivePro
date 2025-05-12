import React, { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";

const ReviewCard = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);

  const handleHelpful = () => {
    setHelpfulCount(helpfulCount + 1);
  };

  return (
    <div className="border border-slate-700/50 p-6 rounded-xl shadow-lg mb-6 bg-slate-800/70 backdrop-blur-sm hover:shadow-slate-700/50 transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-sky-400 mb-1 sm:mb-0">{review.serviceName}</h3>
        <p className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-full">{review.providerName}</p>
      </div>

      <div className="flex items-center my-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${index < review.rating ? "text-yellow-400" : "text-slate-600"}`}
            fill={index < review.rating ? "currentColor" : "none"}
          />
        ))}
        <span className="ml-2 text-sm text-slate-400">({review.rating} out of 5)</span>
      </div>

      <p className="mt-1 text-slate-300 leading-relaxed">{review.comment}</p>

      <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center justify-start">
        <button
          onClick={handleHelpful}
          className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 group"
        >
          <ThumbsUp className="h-4 w-4 group-hover:animate-pulse" />
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
