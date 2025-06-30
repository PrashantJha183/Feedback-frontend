import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Use localStorage instead of sessionStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const employeeId = loggedInUser.employee_id || "";

  const fetchNotifications = async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/notifications/${employeeId}`
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to fetch notifications.");
      }

      const data = await res.json();
      setNotifications(data.filter((n) => n.seen));
    } catch (err) {
      console.error(err);
      setError(
        err.message || "An error occurred while fetching notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [employeeId]);

  if (!employeeId) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow border border-gray-100">
        <p className="text-red-600 text-center text-sm">
          No employee is logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">
        Seen Notifications
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading notifications...</p>
      ) : error ? (
        <p className="text-red-600 text-sm text-center">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No seen notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all"
              onClick={() => navigate("/employeefeedback")}
            >
              <p className="font-medium text-gray-800">{n.message}</p>
              {n.manager_name && (
                <p className="text-xs text-gray-500">From: {n.manager_name}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.created_at).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
