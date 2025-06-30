"use client";

import { useState, useEffect, Fragment } from "react";
import {
  IdentificationIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";

export default function Login() {
  const [form, setForm] = useState({
    employee_id: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetForm, setResetForm] = useState({
    employee_id: "",
    new_password: "",
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Login failed.");
      }

      const data = await res.json();

      localStorage.setItem("loggedInUser", JSON.stringify(data));

      setSuccess(`Welcome, ${data.name}! Redirecting...`);

      if (data.role === "manager") {
        const empRes = await fetch(
          `http://localhost:8000/users/manager/${data.employee_id}/employees`
        );

        if (empRes.ok) {
          const employees = await empRes.json();
          localStorage.setItem("managerEmployees", JSON.stringify(employees));
        }

        window.location.href = "/dashboardformanager";
      } else {
        window.location.href = "/dashboardforemployee";
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetSuccess("");
    setResetError("");

    try {
      const res = await fetch("http://localhost:8000/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetForm),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Password reset failed.");
      }

      setResetSuccess("Password has been reset successfully.");
      setResetForm({
        employee_id: "",
        new_password: "",
      });
    } catch (err) {
      setResetError(err.message || "Something went wrong.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        User Login
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
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Employee ID
          </label>
          <div className="relative">
            <IdentificationIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              required
              placeholder="Enter Employee ID"
              autoComplete="off"
              className="pl-10 block w-full border border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <KeyIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter Password"
              autoComplete="off"
              className="pl-10 pr-10 block w-full border border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-right">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="text-indigo-600 hover:underline text-sm mt-2"
          >
            Forgot Password?
          </button>
        </div>
      </form>

      {/* Forgot Password Modal */}
      <Transition.Root show={resetModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setResetModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="max-w-md w-full bg-white p-6 rounded shadow">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Reset Password
                </Dialog.Title>

                {resetSuccess && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded mt-4">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                {resetError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded mt-4">
                    <ExclamationCircleIcon className="h-5 w-5" />
                    <span>{resetError}</span>
                  </div>
                )}

                <form onSubmit={handleResetSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Employee ID
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      name="employee_id"
                      value={resetForm.employee_id}
                      onChange={handleResetChange}
                      required
                      placeholder="Enter Employee ID"
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      New Password
                    </label>
                    <input
                      autoComplete="off"
                      type="password"
                      name="new_password"
                      value={resetForm.new_password}
                      onChange={handleResetChange}
                      required
                      placeholder="Enter New Password"
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setResetModalOpen(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm ${
                        resetLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {resetLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
