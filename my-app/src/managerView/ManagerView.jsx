import Login from "../components/manager/Login";
import DashboardForManager from "./DashboardForManager";
import Register from "../components/manager/Register";
import ManagerLayout from "./ManagerLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Feedback from "../components/manager/Feedback";

const ManagerView = () => {
  return (
    <Routes>
      {/* Login page WITHOUT header */}
      <Route path="/login" element={<Login />} />

      {/* All routes WITH header */}
      <Route element={<ManagerLayout />}>
        <Route path="/dashboardformanager" element={<DashboardForManager />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feedback" element={<Feedback />} />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default ManagerView;
