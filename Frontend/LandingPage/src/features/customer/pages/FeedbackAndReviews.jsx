import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import ReviewList from "../components/reviews/ReviewList";
import ReviewStatsChart from "../components/reviews/ReviewStatsChart";
import ReviewModal from "../components/reviews/ReviewModal";

const dummyReviews = [
  {
    serviceName: "House Cleaning",
    providerName: "John Doe",
    rating: 5,
    comment: "Amazing service! Will book again.",
    helpful: 10,
  },
  {
    serviceName: "Plumbing",
    providerName: "Jane Smith",
    rating: 4,
    comment: "Good job but a bit late.",
    helpful: 4,
  },
  {
    serviceName: "Carpentry",
    providerName: "Mike Ross",
    rating: 3,
    comment: "Average experience.",
    helpful: 2,
  },
  {
    serviceName: "Electrician",
    providerName: "Harvey Specter",
    rating: 5,
    comment: "Very professional and quick!",
    helpful: 7,
  },
  {
    serviceName: "Pest Control",
    providerName: "Rachel Zane",
    rating: 2,
    comment: "Did not meet my expectations.",
    helpful: 1,
  },
  {
    serviceName: "AC Repair",
    providerName: "Louis Litt",
    rating: 4,
    comment: "Quick service and friendly staff.",
    helpful: 3,
  },
  {
    serviceName: "Painting",
    providerName: "Donna Paulsen",
    rating: 5,
    comment: "Exceptional work and clean finish!",
    helpful: 8,
  },
];

const FeedbackAndReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setReviews(dummyReviews);
  }, []);

  const filterReviews = (type) => {
    if (type === "positive") return reviews.filter((r) => r.rating >= 4);
    if (type === "negative") return reviews.filter((r) => r.rating <= 2);
    return reviews;
  };

  const handleAddReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Customer Feedback & Reviews
        </h1>
        <Link
          to="/" // Assuming '/' is the customer home page
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
        >
          Close & Go to Home
        </Link>
      </div>

      {/* 📊 Chart */}
      <ReviewStatsChart reviews={reviews} />

      {/* ⭐ Filter buttons */}
      <div className="flex justify-center gap-4 mb-8 mt-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("positive")}
          className={`px-4 py-2 rounded-md ${
            filter === "positive"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Positive
        </button>
        <button
          onClick={() => setFilter("negative")}
          className={`px-4 py-2 rounded-md ${
            filter === "negative"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Negative
        </button>
      </div>

      {/* 💬 Review List */}
      <ReviewList reviews={filterReviews(filter)} />

      {/* 📝 Floating Write Review Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
      >
        Write a Review
      </button>

      {/* 📥 Modal to submit new review */}
      <ReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddReview}
      />
    </div>
  );
};

export default FeedbackAndReviews;
