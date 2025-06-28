import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    localStorage.clear();

    const savedRole = sessionStorage.getItem("role");
    const savedName = sessionStorage.getItem("name");
    if (savedRole === "manager") {
      setUserData({
        role: savedRole,
        name: savedName,
      });
      navigate("/dashboardformanager");
    }
  }, [navigate]);

  useEffect(() => {
    if (userData && userData.role === "manager") {
      // Delay navigation briefly to show welcome message
      const timeout = setTimeout(() => {
        navigate("/dashboardformanager");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [userData, navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetch(
          "https://feedback-2uwd.onrender.com/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              employee_id: employeeId,
              password: password,
            }),
            signal,
          }
        );

        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonErr) {
          console.error("Invalid JSON response:", text);
          setError("Server error. Please try again.");
          setLoading(false);
          return;
        }

        if (response.ok) {
          console.log("Login Success:", data);

          sessionStorage.setItem("role", data.role);
          sessionStorage.setItem("name", data.name);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("employee_id", data.employee_id);
          sessionStorage.setItem("loginTime", Date.now().toString());
          if (data.role === "manager") {
            navigate("/dashboardformanager");
          }
          setUserData(data);
        } else {
          console.error("Login failed:", data);
          setError(data.message || "Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.name === "AbortError") {
          console.log("Request was aborted.");
        } else {
          setError("Network error. Please try again.");
        }
      } finally {
        setLoading(false);
      }

      return () => {
        controller.abort();
      };
    },
    [employeeId, password]
  );

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* {userData && userData.name && (
          <div className="mt-6 text-center text-green-600 text-lg font-semibold">
            Welcome, {userData.name}!
          </div>
        )} */}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-900"
              >
                Employee ID
              </label>
              <div className="mt-2">
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                } px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-5 text-center text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
