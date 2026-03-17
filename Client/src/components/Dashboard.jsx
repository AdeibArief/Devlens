import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/review/history");
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Reviews</h1>
          <p className="text-base-content/60 mt-1">{reviews.length} reviews</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/review")}>
          + New Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-5">🔎</p>
          <h2 className="text-xl font-semibold mb-2">No Reviews yet</h2>
          <p className="text-base-content/60 mb-6">
            Paste your code and get instant AI feedback
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/review")}
          >
            Start your first review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              className="card bg-base-200 w-full shadow hover:shadow-md transition-shadow"
              key={review._id}
            >
              <div className="card-body flex flex-col justify-between h-full">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => navigate(`/review?id=${review._id}`)}
                >
                  <h3 className="font-semibold truncate">{review.title}</h3>
                  <p className="text-sm text-base-content/60 mt-1">
                    <span className="badge badge-sm badge-ghost mr-2">
                      {review.language}
                    </span>
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="btn btn-ghost btn-sm text-error w-full mt-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
