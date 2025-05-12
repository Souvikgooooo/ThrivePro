import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReviewList from "../components/reviews/ReviewList";
import ReviewStatsChart from "../components/reviews/ReviewStatsChart";
import ReviewModal from "../components/reviews/ReviewModal";
import { Home, PlusCircle, Filter, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="container mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 sm:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
            Feedback & Reviews
          </h1>
          <Link
            to="/customer" 
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 px-4 py-2 rounded-lg border border-slate-700 hover:border-teal-500/50 bg-slate-800/50 hover:bg-slate-700/70"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </header>

        <main className="lg:flex lg:gap-12">
          {/* Left Column / Top Section for Stats and Filters */}
          <aside className="lg:w-1/3 xl:w-1/4 mb-12 lg:mb-0">
            <div className="sticky top-24 space-y-10"> {/* Sticky for larger screens */}
              {/* Review Statistics Section */}
              <section className="p-6 bg-slate-800/60 backdrop-blur-md shadow-2xl rounded-xl border border-slate-700 hover:border-teal-500/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400 mb-3 flex items-center gap-2">
                  <Filter size={24} /> Overall Sentiment
                </h2>
                <p className="text-slate-400 text-sm mb-6">A quick glance at how customers feel.</p>
                <ReviewStatsChart reviews={reviews} />
              </section>

              {/* Filter Section */}
              <section className="p-6 bg-slate-800/60 backdrop-blur-md shadow-2xl rounded-xl border border-slate-700 hover:border-sky-500/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400 mb-3 flex items-center gap-2">
                  <Filter size={24} /> Filter Reviews
                </h2>
                <p className="text-slate-400 text-sm mb-6">Sort reviews by sentiment.</p>
                <div className="flex flex-col space-y-3">
                  {[
                    { label: "All Reviews", value: "all", icon: <MessageSquare size={18} />, color: "blue" },
                    { label: "Positive Feedback", value: "positive", icon: <ThumbsUp size={18} />, color: "green" },
                    { label: "Needs Improvement", value: "negative", icon: <ThumbsDown size={18} />, color: "red" },
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      onClick={() => setFilter(btn.value)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-[1.03]
                        border ${filter === btn.value
                          ? `bg-${btn.color}-500 border-${btn.color}-500 text-white shadow-${btn.color}-500/30 shadow-lg`
                          : `bg-slate-700/40 border-slate-600 text-slate-300 hover:bg-slate-600/60 hover:border-${btn.color}-500/50 hover:text-white`
                        }`}
                    >
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </aside>

          {/* Right Column / Main Section for Review List */}
          <section className="lg:w-2/3 xl:w-3/4">
            <div className="bg-slate-800/50 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8 border border-slate-700">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-400 to-sky-400 mb-2 flex items-center gap-2">
                <MessageSquare size={28} /> Customer Experiences
              </h2>
              <p className="text-slate-400 text-sm mb-8">Read through detailed feedback from our valued customers.</p>
              <ReviewList reviews={filterReviews(filter)} />
            </div>
          </section>
        </main>

        {/* Floating Write Review Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-5 py-3 sm:px-6 sm:py-4 rounded-full shadow-2xl hover:shadow-teal-400/40 transform transition-all duration-300 ease-in-out hover:scale-110 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
          aria-label="Write a new review"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Write a Review</span>
        </button>

        {/* Modal to submit new review - Assuming this component will be styled separately or props passed for theming */}
      <ReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddReview}
      />
      </div> {/* Closing tag for "container mx-auto" */}
    </div>
  );
};

export default FeedbackAndReviews;
