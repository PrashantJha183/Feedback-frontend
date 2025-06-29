import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const employeeId = sessionStorage.getItem("employee_id") || "";

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `https://feedback-2uwd.onrender.com/feedback/notifications/${employeeId}`
      );
      const data = await res.json();
      setNotifications(data.filter((n) => n.seen));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [employeeId]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Seen Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No seen notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate("/employeefeedback")}
            >
              <p className="font-medium">{n.message}</p>
              {n.manager_name && (
                <p className="text-xs text-gray-500">From: {n.manager_name}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
