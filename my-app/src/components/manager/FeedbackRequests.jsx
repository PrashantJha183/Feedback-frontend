"use client";

import { useEffect, useState, Fragment } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = "https://feedback-2uwd.onrender.com";

export default function FeedbackHistory() {
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState(null);

  const [feedbackRequests, setFeedbackRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (!userData) {
      navigate("/");
      return;
    }
    const user = JSON.parse(userData);
    if (!user.employee_id || user.role !== "manager") {
      navigate("/");
      return;
    }
    setManagerId(user.employee_id);
  }, [navigate]);

  useEffect(() => {
    if (managerId) {
      fetchFeedbackRequests(managerId);
    }
  }, [managerId]);

  const fetchFeedbackRequests = async (managerId) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/feedback/requests/${managerId}`);
      if (!res.ok) throw new Error("Failed to fetch feedback requests.");
      const data = await res.json();
      setFeedbackRequests(data);
      setFilteredRequests(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError(e.message);
      setFeedbackRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const markRequestSeen = async (requestId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/feedback/requests/${requestId}/seen`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to mark request as seen.");

      setFeedbackRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, seen: true } : r))
      );
      setFilteredRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, seen: true } : r))
      );
    } catch (e) {
      console.error(e);
      alert(e.message || "Error updating request.");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      if (value.trim() === "") {
        setFilteredRequests(feedbackRequests);
      } else {
        const lower = value.toLowerCase();
        setFilteredRequests(
          feedbackRequests.filter(
            (req) =>
              req.employee_id?.toLowerCase().includes(lower) ||
              req.message?.toLowerCase().includes(lower)
          )
        );
      }
    }, 300);

    setDebounceTimer(timer);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Feedback Requests
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center w-full sm:w-96 relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 text-gray-400" />
          <input
            autoComplete="off"
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredRequests.length > 0 ? (
        <ul className="space-y-4">
          {filteredRequests.map((req) => (
            <li
              key={req.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700 font-medium">
                  From Employee: {req.employee_id}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Message: {req.message || "-"}
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
                    onClick={() => markRequestSeen(req.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center text-sm"
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
      ) : (
        <p className="text-center text-gray-500">No feedback requests found.</p>
      )}
    </div>
  );
}
