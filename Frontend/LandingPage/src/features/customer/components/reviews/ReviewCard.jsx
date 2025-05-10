import React, { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";

const ReviewCard = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);

  const handleHelpful = () => {
    setHelpfulCount(helpfulCount + 1);
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm mb-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{review.serviceName}</h3>
        <p className="text-sm text-gray-500">{review.providerName}</p>
      </div>

      <div className="flex items-center mt-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
            fill={index < review.rating ? "currentColor" : "none"}
          />
        ))}
      </div>

      <p className="mt-2 text-gray-700">{review.comment}</p>

      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={handleHelpful}
          className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
