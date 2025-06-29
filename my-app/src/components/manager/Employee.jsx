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

export default function Employee() {
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

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
      fetchEmployees(managerId);
    }
  }, [managerId]);

  const fetchEmployees = async (managerId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/users/manager/${managerId}/employees`
      );
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
      setFilteredEmployees(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError(e.message);
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
      const res = await fetch(`${BASE_URL}/users/${editData.employee_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Update failed");

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
        `${BASE_URL}/users/${selectedEmployee.employee_id}`,
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

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
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
    }, 300);

    setDebounceTimer(timer);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Employee Management
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-80">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredEmployees.length === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-center text-sm bg-white shadow rounded-lg">
            <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <tr>
                <th className="border border-indigo-600 px-4 py-3 font-semibold tracking-wide">
                  Name
                </th>
                <th className="border border-indigo-600 px-4 py-3 font-semibold tracking-wide">
                  Email
                </th>
                <th className="border border-indigo-600 px-4 py-3 font-semibold tracking-wide">
                  Role
                </th>
                <th className="border border-indigo-600 px-4 py-3 font-semibold tracking-wide">
                  Employee ID
                </th>
                <th className="border border-indigo-600 px-4 py-3 font-semibold tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, idx) => (
                <tr
                  key={emp.employee_id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50`}
                >
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">
                    {emp.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">
                    {emp.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">
                    {emp.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">
                    {emp.employee_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="max-w-lg w-full bg-white p-6 rounded shadow">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Edit Employee
                </Dialog.Title>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.password}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Role</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          role: e.target.value,
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
                  Are you sure you want to delete this employee?
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
