"use client";

import { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  IdentificationIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
    employee_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [managerId, setManagerId] = useState("");

  useEffect(() => {
    const storedManagerId = sessionStorage.getItem("employee_id") || "";
    setManagerId(storedManagerId);
  }, []);

  // Automatically clear success/error after 5 seconds
  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timer);
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
      const payload = {
        ...form,
      };

      if (form.role === "employee") {
        if (!managerId) {
          throw new Error("Manager ID not found. Cannot register employee.");
        }
        payload.manager_employee_id = managerId;
      } else {
        // Remove manager_employee_id if present
        delete payload.manager_employee_id;
      }

      const res = await fetch("https://feedback-2uwd.onrender.com/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.detail || errData?.message || "Registration failed."
        );
      }

      setSuccess("User registered successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "manager",
        employee_id: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Register New User
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

        {/* Name */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Name
          </label>
          <div className="relative">
            <UserIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter Name"
              autoComplete="off"
              className="pl-10 block w-full border border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter Email"
              autoComplete="off"
              className="pl-10 block w-full border border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Password */}
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
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Role
          </label>
          <div className="relative">
            <UserGroupIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="pl-10 block w-full border border-gray-300 rounded-md py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
