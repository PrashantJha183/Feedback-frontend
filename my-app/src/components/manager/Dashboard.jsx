"use client";

import { useEffect, useState } from "react";
import { UsersIcon, BellIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [managerName, setManagerName] = useState("");

  const [unseenCount, setUnseenCount] = useState(0);
  const [unseenLoading, setUnseenLoading] = useState(true);
  const [unseenError, setUnseenError] = useState(null);

  const [employeeCount, setEmployeeCount] = useState(0);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [employeeError, setEmployeeError] = useState(null);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    totalFeedbacks: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  const navigate = useNavigate();

  const managerId = sessionStorage.getItem("employee_id") || "";

  useEffect(() => {
    const name = sessionStorage.getItem("name") || "";
    setManagerName(name);

    if (!managerId) return;

    const fetchAll = async () => {
      try {
        setUnseenLoading(true);
        setEmployeeLoading(true);
        setDashboardLoading(true);

        const [unseenRes, employeeRes, dashboardRes] = await Promise.all([
          fetch(
            `https://feedback-2uwd.onrender.com/feedback/requests/${managerId}/count-unseen`
          ),
          fetch(
            `https://feedback-2uwd.onrender.com/users/manager/${managerId}/employees`
          ),
          fetch(
            `https://feedback-2uwd.onrender.com/users/dashboard/manager/${managerId}`
          ),
        ]);

        if (!unseenRes.ok) {
          const errData = await unseenRes.json().catch(() => null);
          throw new Error(
            errData?.detail || "Failed to fetch unseen requests count."
          );
        }

        if (!employeeRes.ok) {
          const errData = await employeeRes.json().catch(() => null);
          throw new Error(errData?.detail || "Failed to fetch employee list.");
        }

        if (!dashboardRes.ok) {
          const errData = await dashboardRes.json().catch(() => null);
          throw new Error(errData?.detail || "Failed to fetch dashboard data.");
        }

        // unseen count
        const unseenData = await unseenRes.json();
        setUnseenCount(unseenData.unseen_count || 0);
        setUnseenError(null);

        // employee list
        const employeeData = await employeeRes.json();
        setEmployeeCount(employeeData.length || 0);
        setEmployeeError(null);

        // dashboard report
        const dashData = await dashboardRes.json();

        let totalFeedbacks = 0;
        let positive = 0;
        let neutral = 0;
        let negative = 0;

        dashData.forEach((emp) => {
          totalFeedbacks += emp.feedback_count || 0;
          positive += emp.positive || 0;
          neutral += emp.neutral || 0;
          negative += emp.negative || 0;
        });

        setDashboardData({
          totalEmployees: dashData.length,
          totalFeedbacks,
          positive,
          neutral,
          negative,
        });
        setDashboardError(null);
      } catch (err) {
        const message =
          err?.message || "An error occurred while fetching dashboard data.";
        setUnseenError(message);
        setEmployeeError(message);
        setDashboardError(message);
      } finally {
        setUnseenLoading(false);
        setEmployeeLoading(false);
        setDashboardLoading(false);
      }
    };

    fetchAll();
  }, [managerId]);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        {managerName.trim() !== ""
          ? `Welcome, ${managerName.trim()}!`
          : "Welcome, Manager!"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Employees Card */}
        <div
          onClick={() => navigate("/employees")}
          className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow hover:bg-gray-50 cursor-pointer transition"
        >
          <UsersIcon className="h-24 w-24 text-indigo-600 mb-4" />
          <p className="text-gray-600 text-lg">Your Profile</p>
          <p className="text-2xl font-bold text-indigo-700 mt-2">
            {managerName || "Manager"}
          </p>
          {employeeLoading ? (
            <p className="text-gray-400 mt-4">Loading employees...</p>
          ) : employeeError ? (
            <p className="text-red-500 mt-4">{employeeError}</p>
          ) : (
            <>
              <p className="text-gray-600 mt-4">Employees under you:</p>
              <p className="text-5xl font-extrabold text-indigo-700 mt-2">
                {employeeCount}
              </p>
            </>
          )}
          <p className="text-sm mt-2 text-gray-500">Click to view employees</p>
        </div>

        {/* Feedback Requests Card */}
        <div
          onClick={() => navigate("/requested-feedback")}
          className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow hover:bg-gray-50 cursor-pointer transition"
        >
          <BellIcon className="h-24 w-24 text-yellow-500 mb-4" />
          <p className="text-gray-600 text-lg">Unseen Feedback Requests</p>
          {unseenLoading ? (
            <p className="text-gray-400 mt-2">Loading...</p>
          ) : unseenError ? (
            <p className="text-red-500 mt-2">{unseenError}</p>
          ) : (
            <p className="text-5xl font-extrabold text-yellow-500">
              {unseenCount}
            </p>
          )}
          <p className="text-sm mt-2 text-gray-500">Click to view requests</p>
        </div>

        {/* Manager Dashboard Report Card */}
        <div
          onClick={() => navigate("/feedback-history")}
          className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow hover:bg-gray-50 cursor-pointer transition"
        >
          <ChartPieIcon className="h-24 w-24 text-green-500 mb-4" />
          <p className="text-gray-600 text-lg">Dashboard Report</p>
          {dashboardLoading ? (
            <p className="text-gray-400 mt-2">Loading...</p>
          ) : dashboardError ? (
            <p className="text-red-500 mt-2">{dashboardError}</p>
          ) : (
            <>
              <p className="text-gray-600 mt-2">Employees in report:</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {dashboardData.totalEmployees}
              </p>

              <p className="text-gray-600 mt-3">Total Feedbacks:</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {dashboardData.totalFeedbacks}
              </p>

              <div className="flex gap-4 mt-4">
                <span className="text-sm text-green-600">
                  Positive: {dashboardData.positive}
                </span>
                <span className="text-sm text-yellow-600">
                  Neutral: {dashboardData.neutral}
                </span>
                <span className="text-sm text-red-600">
                  Negative: {dashboardData.negative}
                </span>
              </div>
            </>
          )}
          <p className="text-sm mt-2 text-gray-500">
            Click to view report details
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
