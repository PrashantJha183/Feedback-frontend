"use client";

import { useState, useEffect, Fragment } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  LockClosedIcon,
  InboxArrowDownIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { useNavigate, Link } from "react-router-dom";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, to: "/dashboardforemployee" },
  {
    name: "Feedback Requests",
    icon: InboxArrowDownIcon,
    to: "/feedbackrequestform",
  },
  {
    name: "Feedback History",
    icon: ClipboardDocumentListIcon,
    to: "/employeefeedback",
  },
  { name: "Change Password", icon: LockClosedIcon, to: "/changepassword" },
  { name: "Notifications", icon: BellIcon, to: "/notification" },
];

export default function Header({ employeeName, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [notifActionLoading, setNotifActionLoading] = useState(false);

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const employeeId = storedUser.employee_id || "";

  const fetchNotifications = async () => {
    if (!employeeId) return;
    setLoadingNotifs(true);
    try {
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/notifications/${employeeId}`
      );
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [employeeId]);

  // FIXED toggleSeen to use query params
  const toggleSeen = async (notifId, seen) => {
    setNotifActionLoading(true);
    try {
      await fetch(
        `https://feedback-2uwd.onrender.com/feedback/notifications/${notifId}?seen=${seen}`,
        {
          method: "PATCH",
        }
      );
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setNotifActionLoading(false);
    }
  };

  const markAllAsSeen = async () => {
    setNotifActionLoading(true);
    try {
      await fetch(
        `https://feedback-2uwd.onrender.com/feedback/notifications/mark-all-seen/${employeeId}`,
        {
          method: "PATCH",
        }
      );
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setNotifActionLoading(false);
    }
  };

  const unseenNotifications = notifications.filter((n) => !n.seen);
  const unseenCount = unseenNotifications.length;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col bg-white pb-4">
                <div className="flex items-center justify-between px-4 py-3">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Logo"
                  />
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 text-gray-700 font-medium">
                  Welcome, {employeeName}
                </div>
                <nav className="mt-5 space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <item.icon className="h-6 w-6 mr-3 text-gray-500 group-hover:text-indigo-600" />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center rounded-md px-2 py-2 text-base font-medium text-red-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3 text-red-500" />
                    Logout
                  </button>
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex h-16 items-center justify-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Logo"
          />
        </div>

        <nav className="flex flex-1 flex-col px-4 py-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <item.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-indigo-600" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium text-red-700 hover:bg-gray-100"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
            Logout
          </button>
        </nav>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white px-4 lg:px-8 items-center justify-between">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-900 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex justify-end flex-1 space-x-4 items-center">
            {/* Notifications Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="relative focus:outline-none">
                <BellIcon className="h-6 w-6 text-gray-700 hover:text-indigo-600" />
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white"></span>
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-[20rem] min-w-[18rem] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-800">
                      Notifications
                    </span>
                    {unseenCount > 0 && (
                      <button
                        onClick={markAllAsSeen}
                        disabled={notifActionLoading}
                        className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                      >
                        Mark All as Seen
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {loadingNotifs ? (
                      <div className="p-4 text-gray-500 text-sm">
                        Loading...
                      </div>
                    ) : unseenCount === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">
                        No unseen notifications
                      </div>
                    ) : (
                      unseenNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="flex justify-between gap-3 px-4 py-3 hover:bg-gray-50"
                        >
                          <div className="flex-1 text-sm text-gray-700 break-words">
                            <p className="font-medium">{n.message}</p>
                            {n.manager_name && (
                              <p className="text-xs text-gray-400 mt-1">
                                From: {n.manager_name}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {n.created_at
                                ? new Date(n.created_at).toLocaleDateString(
                                    "en-IN",
                                    {
                                      timeZone: "Asia/Kolkata",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "-"}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleSeen(n.id, !n.seen)}
                            disabled={notifActionLoading}
                            className="text-gray-400 hover:text-indigo-600 transition"
                            title={n.seen ? "Mark as Unseen" : "Mark as Seen"}
                          >
                            {n.seen ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* User info */}
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-6 w-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                {employeeName}
              </span>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
