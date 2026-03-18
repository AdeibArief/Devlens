import React, { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useSearchParams, useNavigate } from "react-router-dom";

const LANGUAGES = [
  "Javascript",
  "Python",
  "Typescript",
  "C#",
  "go",
  "rust",
  "PHP",
  "Other",
];

const Review = () => {
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get("id");
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [language, setLanguage] = useState("javascript");

  const feedbackRef = useRef(null);

  useEffect(() => {
    if (!reviewId) return;
    const fetchReview = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/review/${reviewId}`);
        setCode(res.data.review.code);
        setLanguage(res.data.review.language);
        setFeedback(res.data.review.feedback);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [reviewId]);

  useEffect(() => {
    if (feedbackRef.current) {
      feedbackRef.current.scrollTop = feedbackRef.current.scrollHeight;
    }
  }, [feedback]);

  const handleReview = async () => {
    if (!code.trim()) return;
    setFeedback("");
    setStreaming(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/review/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, language }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk
          .split("\n")
          .filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          const data = JSON.parse(line.replace("data:", ""));

          if (data.error) {
            setFeedback("Error: " + data.error);
            break;
          }

          if (data.done) break;
          if (data.text) setFeedback((prev) => prev + data.text);
        }
      }
    } catch (error) {
      setFeedback("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setStreaming(false);
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
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-ghost rounded-2xl"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">
          {reviewId ? "Saved Review" : "New Code Review"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">Your Code</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={!!reviewId}
            className="select select-bordered select-sm"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <textarea
            className="textarea textarea-bordered font-mono text-sm w-full h-96 resize-none"
            placeholder="Place your code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            readOnly={!!reviewId}
          />

          {!reviewId && (
            <button
              onClick={handleReview}
              disabled={streaming || !code.trim()}
              className="btn btn-primary w-full"
            >
              {streaming ? (
                <span className="loading loading-spinner loading-sm">
                  Analyzing
                </span>
              ) : (
                "🔎Review My code"
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-lg">AI FeedBack</h2>
          <div
            className="bg-base-200 rounded-xl p-4 font-mono text-sm h-96 overflow-y-auto whitespace-pre-wrap"
            ref={feedbackRef}
          >
            {feedback || (
              <span className="text-base-content/40 ">
                {streaming
                  ? "Analyzing your code..."
                  : "Feedback will appear here after review..."}
              </span>
            )}
            {streaming && <span className="animate-pulse">▋</span>}
          </div>

          {feedback && !reviewId && (
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-outline w-full"
            >
              ✓ Saved — View Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
