"use client";

import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  CheckCircleIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  IdentificationIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const sentimentIcon = {
  positive: <FaceSmileIcon className="h-6 w-6 text-green-600" />,
  neutral: <FaceSmileIcon className="h-6 w-6 text-yellow-500" />,
  negative: <FaceFrownIcon className="h-6 w-6 text-red-600" />,
};

const DashboardForEmployee = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const navigate = useNavigate();
  const employeeId = sessionStorage.getItem("employee_id") || "";
  const employeeName = sessionStorage.getItem("name") || "Employee";

  useEffect(() => {
    if (!employeeId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://feedback-2uwd.onrender.com/users/dashboard/employee/${employeeId}`
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.detail || "Failed to fetch dashboard data.");
        }

        const data = await response.json();
        setTimeline(data);
      } catch (err) {
        setError(
          err?.message || "An error occurred while fetching dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Group feedbacks by manager_name
  const groupedByManager = timeline.reduce((acc, fb) => {
    if (!acc[fb.manager_name]) {
      acc[fb.manager_name] = [];
    }
    acc[fb.manager_name].push(fb);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Welcome, {employeeName}!
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : timeline.length === 0 ? (
        <div className="flex flex-col items-center text-gray-600 mt-12">
          <ClipboardDocumentListIcon className="h-20 w-20 mb-4 text-gray-400" />
          <p className="text-lg">No feedback available yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Employee Info Card */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md hover:border-indigo-300 transition cursor-pointer">
            <div className="flex justify-between items-center">
              {/* Employee ID */}
              <div className="flex items-center gap-3">
                <IdentificationIcon className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold">
                    Employee ID
                  </p>
                  <p className="text-gray-700 text-lg font-bold">
                    {employeeId}
                  </p>
                </div>
              </div>

              {/* Managers List */}
              <div className="flex items-center gap-3">
                <UsersIcon className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-gray-500 text-xs font-semibold">
                    Managers
                  </p>
                  {Object.keys(groupedByManager).length === 0 ? (
                    <p className="text-gray-400 text-sm">No managers yet</p>
                  ) : (
                    <ul className="space-y-1">
                      {Object.keys(groupedByManager).map((manager) => (
                        <li
                          key={manager}
                          className="text-gray-700 text-sm font-medium hover:text-indigo-700 cursor-pointer"
                          onClick={() => {
                            const section = document.getElementById(
                              `manager-${manager}`
                            );
                            if (section) {
                              section.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }}
                        >
                          {manager}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback grouped by Manager */}
          {Object.entries(groupedByManager).map(([managerName, feedbacks]) => (
            <div
              key={managerName}
              id={`manager-${managerName}`}
              className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition"
            >
              {/* Manager Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="h-8 w-8 text-indigo-600" />
                  <span className="text-lg font-bold text-gray-700">
                    Feedback from {managerName}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {feedbacks
                  .slice(0, 3) // ✅ Show only top 3 feedbacks
                  .map((fb) => (
                    <div
                      key={fb.feedback_id}
                      onClick={() => navigate("/employeefeedback")}
                      className="border border-gray-200 rounded-md p-4 hover:bg-indigo-50 transition cursor-pointer"
                    >
                      {/* Sentiment */}
                      <div className="flex items-center gap-3 mb-3">
                        {sentimentIcon[fb.sentiment] || (
                          <FaceSmileIcon className="h-6 w-6 text-gray-400" />
                        )}
                        <span className="capitalize text-gray-700 font-medium">
                          Sentiment: {fb.sentiment || "N/A"}
                        </span>
                      </div>

                      {/* Feedback Details */}
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 font-semibold">
                          Strengths:
                        </p>
                        <p className="text-gray-700 text-sm">
                          {fb.strengths || "N/A"}
                        </p>
                      </div>

                      <div className="mb-2">
                        <p className="text-xs text-gray-500 font-semibold">
                          Areas of Improvement:
                        </p>
                        <p className="text-gray-700 text-sm">
                          {fb.improvement || "N/A"}
                        </p>
                      </div>

                      {/* Acknowledged & Timestamp */}
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          {fb.acknowledged ? (
                            <>
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              <span className="text-green-700 text-xs">
                                Acknowledged
                              </span>
                            </>
                          ) : (
                            <span className="text-yellow-600 text-xs">
                              Not Acknowledged
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-500 text-xs gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {new Date(fb.created_at).toLocaleDateString()}{" "}
                            {new Date(fb.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardForEmployee;
