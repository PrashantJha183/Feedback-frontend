"use client";

import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export default function ChangePassword() {
  // Use localStorage instead of sessionStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const employeeId = loggedInUser.employee_id || "";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `${baseUrl}/users/change-password/${employeeId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to change password.");
      }

      setSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle missing logged-in user gracefully
  if (!employeeId) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <p className="text-center text-red-600 text-sm">
          No employee is logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <LockClosedIcon className="h-6 w-6" />
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Old Password
          </label>
          <input
            type={showOld ? "text" : "password"}
            id="oldPassword"
            autoComplete="off"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full rounded border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-2 pr-10 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowOld((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showOld ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>

          <input
            type={showNew ? "text" : "password"}
            id="newPassword"
            autoComplete="off"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full rounded border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 p-2 pr-10 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowNew((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showNew ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition"
        >
          {loading && (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          )}
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      {success && (
        <p className="mt-4 text-green-600 text-sm text-center">{success}</p>
      )}

      {error && (
        <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
      )}
    </div>
  );
}
