"use client";

import { useEffect, useState, Fragment } from "react";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://feedback-2uwd.onrender.com";

export default function FeedbackHistory() {
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editData, setEditData] = useState({
    employee_id: "",
    strengths: "",
    improvement: "",
    sentiment: "",
    anonymous: false,
    tags: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("employee_id");
    const userRole = sessionStorage.getItem("role");

    if (!userId || !userRole) {
      navigate("/");
      return;
    }

    if (userRole !== "manager") {
      alert("Unauthorized: Only managers can view this page.");
      navigate("/");
      return;
    }

    setManagerId(userId);
  }, [navigate]);

  useEffect(() => {
    if (managerId) {
      fetchFeedbacks(managerId);
    }
  }, [managerId]);

  const fetchFeedbacks = async (managerId) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/feedback/manager/${managerId}`);
      if (!res.ok) throw new Error("Failed to fetch feedbacks");
      const data = await res.json();
      setFeedbacks(data);
      setFilteredFeedbacks(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      if (value.trim() === "") {
        setFilteredFeedbacks(feedbacks);
      } else {
        const lower = value.toLowerCase();
        setFilteredFeedbacks(
          feedbacks.filter(
            (fb) =>
              (fb.manager_name?.toLowerCase() || "").includes(lower) ||
              (fb.employee_id?.toLowerCase() || "").includes(lower) ||
              (fb.strengths?.toLowerCase() || "").includes(lower) ||
              (fb.improvement?.toLowerCase() || "").includes(lower) ||
              (fb.sentiment?.toLowerCase() || "").includes(lower) ||
              (fb.tags?.join(", ").toLowerCase() || "").includes(lower)
          )
        );
      }
    }, 300);

    setDebounceTimer(timer);
  };

  const handleEditClick = (fb) => {
    setSelectedFeedback(fb);
    setEditData({
      employee_id: fb.employee_id,
      strengths: fb.strengths,
      improvement: fb.improvement,
      sentiment: fb.sentiment,
      anonymous: fb.anonymous || false,
      tags: fb.tags || [],
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        manager_employee_id: managerId,
        employee_id: editData.employee_id,
        strengths: editData.strengths,
        improvement: editData.improvement,
        sentiment: editData.sentiment,
        anonymous: editData.anonymous,
        tags: editData.tags,
      };

      const res = await fetch(`${BASE_URL}/feedback/${selectedFeedback.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      setEditModalOpen(false);
      fetchFeedbacks(managerId);
    } catch (e) {
      console.error(e);
      alert("Failed to update feedback");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/feedback/${selectedFeedback.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteModalOpen(false);
      fetchFeedbacks(managerId);
    } catch (e) {
      console.error(e);
      alert("Failed to delete feedback");
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all your feedbacks?")) {
      try {
        const res = await fetch(`${BASE_URL}/feedback/manager/${managerId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete all failed");
        fetchFeedbacks(managerId);
      } catch (e) {
        console.error(e);
        alert("Failed to delete all feedbacks");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Feedback History
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center w-full sm:w-96 relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleDeleteAll}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm shadow"
        >
          <TrashIcon className="w-4 h-4" />
          Delete All
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredFeedbacks.length === 0 ? (
        <p className="text-center text-gray-500">No feedbacks found.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-gradient-to-r from-indigo-50 to-indigo-100 text-sm rounded">
            <thead className="bg-indigo-200 text-indigo-900">
              <tr>
                <th className="px-4 py-3 text-left">Manager ID</th>
                <th className="px-4 py-3 text-left">Manager Name</th>
                <th className="px-4 py-3 text-left">Employee ID</th>
                <th className="px-4 py-3 text-left">Strengths</th>
                <th className="px-4 py-3 text-left">Improvement</th>
                <th className="px-4 py-3 text-left">Sentiment</th>
                <th className="px-4 py-3 text-left">Anonymous</th>
                <th className="px-4 py-3 text-left">Tags</th>
                <th className="px-4 py-3 text-left">Acknowledged</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-left">Comments</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((fb, index) => (
                <tr
                  key={fb.id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-indigo-50 hover:bg-indigo-100"
                  }
                >
                  <td className="px-4 py-2">{fb.manager_id}</td>
                  <td className="px-4 py-2">{fb.manager_name}</td>
                  <td className="px-4 py-2">{fb.employee_id}</td>
                  <td className="px-4 py-2">{fb.strengths}</td>
                  <td className="px-4 py-2">{fb.improvement}</td>
                  <td className="px-4 py-2">{fb.sentiment}</td>
                  <td className="px-4 py-2">{fb.anonymous ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">
                    {fb.tags?.length > 0 ? fb.tags.join(", ") : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {fb.acknowledged ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    {fb.created_at
                      ? new Date(fb.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 break-words">
                    {fb.comments?.length > 0
                      ? JSON.stringify(fb.comments, null, 2)
                      : "-"}
                  </td>
                  <td className="px-4 py-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(fb)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFeedback(fb);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <Transition.Root show={editModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setEditModalOpen}>
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
              <Dialog.Panel className="max-w-lg w-full bg-white p-6 rounded shadow">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Edit Feedback
                </Dialog.Title>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700">
                      Strengths
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.strengths}
                      onChange={(e) =>
                        setEditData({ ...editData, strengths: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Improvement
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.improvement}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          improvement: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Sentiment
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.sentiment}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          sentiment: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editData.anonymous}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          anonymous: e.target.checked,
                        })
                      }
                    />
                    <label className="text-sm text-gray-700">Anonymous</label>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.tags.join(", ")}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                  >
                    Update
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={deleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setDeleteModalOpen}>
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
                  Confirm Delete
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to delete this feedback?
                </p>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
