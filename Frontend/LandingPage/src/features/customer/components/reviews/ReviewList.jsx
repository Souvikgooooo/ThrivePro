import React, { useState } from "react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div>
      {reviews.slice(0, visibleCount).map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}

      {visibleCount < reviews.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
