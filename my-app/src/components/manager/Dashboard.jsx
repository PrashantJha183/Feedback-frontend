"use client";

import { useEffect, useState, useCallback } from "react";
import { UsersIcon } from "@heroicons/react/24/outline";

function useManagerUsers() {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://feedback-2uwd.onrender.com/users/dashboard/manager"
      );
      if (!response.ok) throw new Error("Failed to fetch employees.");
      const data = await response.json();

      console.log("API data:", data);

      // Check if data is object with employees array
      if (Array.isArray(data)) {
        // The API returned array directly
        setTotalCount(data.length);
      } else if (data?.employees && Array.isArray(data.employees)) {
        setTotalCount(data.employees.length);
      } else {
        setTotalCount(0);
      }

      setError(null);
    } catch (err) {
      setError(err.message || "Unknown error occurred.");
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    totalCount,
    loading,
    error,
    refresh: fetchUsers,
  };
}

const Dashboard = () => {
  const { totalCount, loading, error } = useManagerUsers();
  const [managerName, setManagerName] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("name") || "";
    setManagerName(name);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        {managerName.trim() !== ""
          ? `Welcome, ${managerName.trim()}!`
          : "Welcome, Manager!"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: Total employees block */}
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow">
          <UsersIcon className="h-24 w-24 text-indigo-600 mb-4" />
          <p className="text-gray-600 text-lg">Total Employees</p>
          <p className="text-5xl font-extrabold text-indigo-700">
            {totalCount}
          </p>
        </div>

        {/* Right side: Placeholder for feedback */}
        <div className="bg-gray-50 rounded-lg min-h-[200px] flex items-center justify-center">
          <p className="text-gray-400">[Feedback panel coming soon]</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
