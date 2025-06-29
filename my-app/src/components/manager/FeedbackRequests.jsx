"use client";

import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const FeedbackRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const managerId = sessionStorage.getItem("employee_id") || "";

  const fetchRequests = async () => {
    if (!managerId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/requests/${managerId}`
      );
      if (!res.ok) throw new Error("Failed to fetch feedback requests.");

      const data = await res.json();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Unknown error occurred.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async (requestId) => {
    try {
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/requests/${requestId}/seen`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to mark request as seen.");

      // ✅ Update local state instead of refetching everything
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, seen: true } : req))
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Error updating request.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Feedback Requests
      </h1>

      {loading && (
        <div className="flex justify-center text-gray-500">Loading...</div>
      )}

      {error && <div className="text-red-600 text-center">{error}</div>}

      {!loading && requests.length === 0 && (
        <div className="flex flex-col items-center text-gray-400">
          <ExclamationTriangleIcon className="h-12 w-12 mb-4" />
          <p>No feedback requests found.</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700 font-medium">
                  From Employee: {req.employee_id}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Message: {req.message}
                </p>
                {req.seen ? (
                  <p className="mt-2 flex items-center text-green-600 text-sm">
                    <EyeIcon className="h-5 w-5 mr-1" />
                    Seen
                  </p>
                ) : (
                  <p className="mt-2 text-yellow-600 text-sm">Unseen</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {!req.seen && (
                  <button
                    onClick={() => markAsSeen(req.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    Mark Seen
                  </button>
                )}
                <Link
                  to="/feedback"
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Give Feedback
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackRequests;
