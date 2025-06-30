"use client";

import { useState, Fragment, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, Link } from "react-router-dom";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, to: "/dashboardformanager" },
  { name: "Employees", icon: UsersIcon, to: "/employee" },
  { name: "Feedback", icon: ChatBubbleLeftRightIcon, to: "/feedback" },
  {
    name: "Feedback History",
    icon: ClockIcon,
    to: "/feedback-history",
  },
  {
    name: "Requested Feedback",
    icon: InboxIcon,
    to: "/requested-feedback",
  },
  { name: "Register", icon: UserCircleIcon, to: "/register" },
];

export default function Header({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [managerName, setManagerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load manager name from localStorage if available
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
      const user = JSON.parse(userData);
      setManagerName(user.name || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
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
        {/* Top header */}
        <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white px-4 lg:px-8 items-center justify-between">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-900 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex justify-end flex-1">
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-6 w-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                {managerName || "Manager"}
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
