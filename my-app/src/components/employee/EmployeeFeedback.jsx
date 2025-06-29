"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ChatBubbleBottomCenterIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  //   FaceNeutralIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const sentimentIcons = {
  positive: <FaceSmileIcon className="h-6 w-6 text-green-600" />,
  neutral: <FaceSmileIcon className="h-6 w-6 text-yellow-500" />,
  negative: <FaceFrownIcon className="h-6 w-6 text-red-600" />,
};

export default function EmployeeFeedback() {
  const employeeId = sessionStorage.getItem("employee_id") || "";
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ackLoading, setAckLoading] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [commentsMap, setCommentsMap] = useState({});

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/employee/${employeeId}`
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to fetch feedbacks.");
      }
      const data = await res.json();

      const transformed = data.map((f) => ({
        ...f,
        created_at: f.created_at?.split("T")[0],
      }));
      setFeedbacks(transformed);
      setFilteredFeedbacks(transformed);
    } catch (err) {
      setError(err.message || "An error occurred while fetching feedback.");
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      fetchFeedbacks();
    }
  }, [fetchFeedbacks, employeeId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const lower = search.toLowerCase();
      const filtered = feedbacks.filter(
        (f) =>
          f.manager_name?.toLowerCase().includes(lower) ||
          f.strengths?.toLowerCase().includes(lower) ||
          f.improvement?.toLowerCase().includes(lower) ||
          f.tags?.some((tag) => tag?.toLowerCase().includes(lower))
      );
      setFilteredFeedbacks(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, feedbacks]);

  const acknowledgeFeedback = async (id) => {
    setAckLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/acknowledge/${id}`,
        { method: "PATCH" }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Acknowledge failed.");
      }

      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, acknowledged: true } : f))
      );
      setFilteredFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, acknowledged: true } : f))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setAckLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const commentFeedback = async (id, comment) => {
    setCommentLoading((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/comment/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment }),
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Comment failed.");
      }

      // Save comment locally
      setCommentsMap((prev) => ({
        ...prev,
        [id]: comment,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Your Feedback</h1>
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder-gray-400 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading feedback...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : filteredFeedbacks.length === 0 ? (
        <p className="text-gray-600 text-center">No feedback found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFeedbacks.map((fb) => (
            <FeedbackCard
              key={fb.id}
              feedback={fb}
              sentimentIcons={sentimentIcons}
              onAcknowledge={acknowledgeFeedback}
              onComment={commentFeedback}
              ackLoading={ackLoading[fb.id]}
              commentLoading={commentLoading[fb.id]}
              commentValue={commentsMap[fb.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackCard({
  feedback,
  sentimentIcons,
  onAcknowledge,
  onComment,
  ackLoading,
  commentLoading,
  commentValue,
}) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState(commentValue || "");

  const submitComment = async () => {
    await onComment(feedback.id, comment);
    setCommentOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between border border-gray-100">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-800 font-semibold text-base">
            {feedback.manager_name}
          </span>
          <div className="flex items-center text-gray-500 text-xs gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{feedback.created_at}</span>
          </div>
        </div>

        {/* Sentiment */}
        <div className="flex items-center gap-3 mb-4">
          {sentimentIcons[feedback.sentiment] || (
            <FaceNeutralIcon className="h-6 w-6 text-gray-400" />
          )}
          <span className="capitalize text-gray-600 text-xs font-semibold">
            {feedback.sentiment || "N/A"}
          </span>
        </div>

        {/* Strengths */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500">Strengths</p>
          <p className="text-sm text-gray-700 line-clamp-3">
            {feedback.strengths || "N/A"}
          </p>
        </div>

        {/* Improvement */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500">
            Areas of Improvement
          </p>
          <p className="text-sm text-gray-700 line-clamp-3">
            {feedback.improvement || "N/A"}
          </p>
        </div>

        {/* Tags */}
        {feedback.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {feedback.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment Display */}
        <div className="mt-4 border-t border-gray-200 pt-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Your Comment</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {commentValue?.trim() ? commentValue : "No comment given."}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!feedback.acknowledged ? (
          <button
            onClick={() => onAcknowledge(feedback.id)}
            disabled={ackLoading}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 transition"
          >
            {ackLoading ? "Acknowledging..." : "Acknowledge"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
            <CheckCircleIcon className="h-4 w-4" />
            Acknowledged
          </div>
        )}

        <button
          onClick={() => setCommentOpen(true)}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <ChatBubbleBottomCenterIcon className="h-4 w-4 mr-1" />
          {commentValue?.trim() ? "Edit Comment" : "Add Comment"}
        </button>
      </div>

      {/* Comment Modal */}
      {commentOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full shadow-xl transform scale-100 transition-transform duration-300">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              {commentValue?.trim() ? "Edit Comment" : "Add Comment"}
            </h3>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setCommentOpen(false)}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitComment}
                disabled={commentLoading || !comment.trim()}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition"
              >
                {commentLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
