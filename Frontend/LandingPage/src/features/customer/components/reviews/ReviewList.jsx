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
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
