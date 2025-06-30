"use client";

import { useEffect, useState, Fragment } from "react";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default function Employee() {
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    employee_id: "",
    manager_employee_id: "",
  });

  // Check auth
  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (!userData) {
      navigate("/");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "manager") {
      alert("Unauthorized: Only managers can view this page.");
      navigate("/");
      return;
    }

    setManagerId(user.employee_id);
  }, [navigate]);

  // Fetch employees
  useEffect(() => {
    if (managerId) {
      fetchEmployees(managerId);
    }
  }, [managerId]);

  const fetchEmployees = async (managerId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/users/manager/${managerId}/employees`
      );
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
      setFilteredEmployees(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (emp) => {
    setSelectedEmployee(emp);
    setEditData({
      name: emp.name,
      email: emp.email,
      password: "",
      role: emp.role,
      employee_id: emp.employee_id,
      manager_employee_id: emp.manager_employee_id,
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        name: editData.name,
        email: editData.email,
        role: editData.role,
        password: editData.password || "defaultpass", // TEST with a dummy
        manager_employee_id: managerId,
      };

      const res = await fetch(
        `${baseUrl}/users/${managerId}/${editData.employee_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update failed:", errorData);
        alert(
          `Update failed: ${
            errorData.detail
              ?.map((d) => `${d.loc?.join(".")}: ${d.msg}`)
              .join("; ") || JSON.stringify(errorData)
          }`
        );
        return;
      }

      setEditModalOpen(false);
      fetchEmployees(managerId);
    } catch (e) {
      console.error(e);
      alert("Failed to update employee");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/users/${managerId}/${selectedEmployee.employee_id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setDeleteModalOpen(false);
      fetchEmployees(managerId);
    } catch (e) {
      console.error(e);
      alert("Failed to delete employee");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const lowerValue = value.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(lowerValue) ||
            emp.email.toLowerCase().includes(lowerValue) ||
            emp.role.toLowerCase().includes(lowerValue) ||
            emp.employee_id.toLowerCase().includes(lowerValue)
        )
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Employee Management
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-80">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            autoComplete="off"
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading employees...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredEmployees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.employee_id} className="hover:bg-indigo-50">
                  <td className="px-4 py-2 text-gray-800">{emp.name}</td>
                  <td className="px-4 py-2 text-gray-800">{emp.email}</td>
                  <td className="px-4 py-2 text-gray-800">{emp.role}</td>
                  <td className="px-4 py-2 text-gray-800">{emp.employee_id}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
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
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Edit Employee
              </Dialog.Title>
              <div className="space-y-4">
                <div className="relative">
                  <UserCircleIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Name"
                    className="pl-10 w-full border border-gray-300 rounded py-2 text-sm"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    autoComplete="off"
                    type="email"
                    placeholder="Email"
                    className="pl-10 w-full border border-gray-300 rounded py-2 text-sm"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <KeyIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    autoComplete="off"
                    type="password"
                    placeholder="Password (leave blank to keep existing)"
                    className="pl-10 w-full border border-gray-300 rounded py-2 text-sm"
                    value={editData.password}
                    onChange={(e) =>
                      setEditData({ ...editData, password: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <UserGroupIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Role"
                    className="pl-10 w-full border border-gray-300 rounded py-2 text-sm"
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Modal */}
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
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                Confirm Delete
              </Dialog.Title>
              <p className="text-gray-600 text-sm mb-4">
                Are you sure you want to delete employee{" "}
                <span className="font-semibold">{selectedEmployee?.name}</span>{" "}
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
