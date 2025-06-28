"use client";

import { useState, useCallback, useEffect } from "react";
import {
  UserIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  AdjustmentsHorizontalIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  //   FaceNeutralIcon,
  TagIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function Feedback() {
  const [form, setForm] = useState({
    employee_id: "",
    strengths: "",
    improvement: "",
    sentiment: "positive",
    anonymous: false,
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /**
   * Generic form change handler
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /**
   * Submits feedback
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const payload = {
          ...form,
          tags: form.tags
            ? form.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "")
            : [],
        };

        const res = await fetch(
          "https://feedback-2uwd.onrender.com/feedback/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Submission failed");
        }

        setSuccess("Feedback submitted successfully!");
        setForm({
          employee_id: "",
          strengths: "",
          improvement: "",
          sentiment: "positive",
          anonymous: false,
          tags: "",
        });
      } catch (err) {
        setError(err.message || "Something went wrong.");
        console.log("Error in feedback: ", err);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  /**
   * Automatically clears success/error after 5s
   */
  useEffect(() => {
    let timeout;
    if (success || error) {
      timeout = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [success, error]);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Submit Feedback
      </h1>

      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4">
          <CheckCircleIcon className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
          <ExclamationCircleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Employee ID */}
        <InputField
          label="Employee ID"
          name="employee_id"
          placeholder="Enter Employee ID"
          icon={UserIcon}
          value={form.employee_id}
          onChange={handleChange}
          required
        />

        {/* Strengths */}
        <TextAreaField
          label="Strengths"
          name="strengths"
          placeholder="Describe employee strengths"
          icon={ChatBubbleOvalLeftEllipsisIcon}
          value={form.strengths}
          onChange={handleChange}
        />

        {/* Improvement */}
        <TextAreaField
          label="Areas for Improvement"
          name="improvement"
          placeholder="Describe improvement areas"
          icon={AdjustmentsHorizontalIcon}
          value={form.improvement}
          onChange={handleChange}
        />

        {/* Sentiment */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Sentiment
          </label>
          <div className="flex space-x-3">
            {[
              {
                value: "positive",
                icon: FaceSmileIcon,
                color: "text-green-600",
              },
              {
                value: "neutral",
                icon: FaceSmileIcon,
                color: "text-gray-500",
              },
              { value: "negative", icon: FaceFrownIcon, color: "text-red-600" },
            ].map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    sentiment: option.value,
                  }))
                }
                className={`flex items-center px-3 py-2 rounded-md border ${
                  form.sentiment === option.value
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300"
                }`}
              >
                <option.icon className={`h-5 w-5 mr-2 ${option.color}`} />
                <span className="capitalize">{option.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Anonymous */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="anonymous"
            checked={form.anonymous}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700 text-sm">Submit anonymously</span>
        </div>

        {/* Tags */}
        <InputField
          label="Tags (comma-separated)"
          name="tags"
          placeholder="e.g. punctual, creative"
          icon={TagIcon}
          value={form.tags}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

/**
 * Single-line input field with icon
 */
function InputField({
  label,
  name,
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="pl-10 block w-full border border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

/**
 * Multi-line textarea field with icon
 */
function TextAreaField({
  label,
  name,
  placeholder,
  icon: Icon,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="pl-10 block w-full border border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
    </div>
  );
}
