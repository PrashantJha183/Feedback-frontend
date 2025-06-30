"use client";

import { useState } from "react";
import {
  PaperAirplaneIcon,
  UserIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function FeedbackRequestForm() {
  const [managerId, setManagerId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Get from localStorage instead of sessionStorage
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const employeeId = storedUser.employee_id || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch(
        "https://feedback-2uwd.onrender.com/feedback/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            manager_employee_id: managerId,
            message,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || "Request failed");
      }

      setSuccess("Your feedback request has been sent successfully!");
      setManagerId("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-6 py-10 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center mb-8 space-x-3">
        <PaperAirplaneIcon className="h-9 w-9 text-indigo-600" />
        <h2 className="text-3xl font-bold text-gray-800">Request Feedback</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            htmlFor="managerId"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-400" />
              Manager Employee ID
            </div>
          </label>
          <input
            type="text"
            id="managerId"
            autoComplete="off"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="Enter manager's employee ID"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <PencilSquareIcon className="h-5 w-5 text-gray-400" />
              Message
            </div>
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message to the manager..."
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center w-full py-3 px-6 border border-transparent text-sm font-semibold rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition-all duration-200"
        >
          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>

      {/* Feedback Messages */}
      {success && (
        <div className="mt-6 flex items-center text-green-600 text-sm space-x-2">
          <CheckCircleIcon className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center text-red-600 text-sm space-x-2">
          <ExclamationCircleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
