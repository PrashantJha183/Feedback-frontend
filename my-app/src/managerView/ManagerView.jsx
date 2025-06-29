import Login from "../components/manager/Login";
import DashboardForManager from "./DashboardForManager";
import Register from "../components/manager/Register";
import ManagerLayout from "./ManagerLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Feedback from "../components/manager/Feedback";
import FeedbackHistory from "../components/manager/FeedbackHistory";
import FeedbackRequests from "../components/manager/FeedbackRequests";
import Employee from "../components/manager/Employee";

const ManagerView = () => {
  return (
    <Routes>
      {/* Login page WITHOUT header */}
      <Route path="/" element={<Login />} />

      {/* All routes WITH header */}
      <Route element={<ManagerLayout />}>
        <Route path="/dashboardformanager" element={<DashboardForManager />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedback-history" element={<FeedbackHistory />} />
        <Route path="/requested-feedback" element={<FeedbackRequests />} />
        <Route path="/employee" element={<Employee />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ManagerView;
