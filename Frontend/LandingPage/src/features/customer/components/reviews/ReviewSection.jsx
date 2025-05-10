import React from "react";
import ReviewCard from "./ReviewCard";

const ReviewSection = ({ title, reviews, styleClass }) => {
  return (
    <section className={`mb-6 ${styleClass}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p className="text-gray-500">No reviews available.</p>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
