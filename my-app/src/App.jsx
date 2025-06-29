import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import DashboardForManager from "./components/manager/Dashboard";
import Register from "./components/manager/Register";
import ManagerLayout from "./managerView/ManagerLayout";
import Feedback from "./components/manager/Feedback";
import FeedbackHistory from "./components/manager/FeedbackHistory";
import FeedbackRequests from "./components/manager/FeedbackRequests";
import Employee from "./components/manager/Employee";
import DashboardForEmployee from "./components/employee/DashboardForEmployee";
import EmployeeLayout from "./components/employeeView/EmployeeLayout";
import EmployeeFeedback from "./components/employee/EmployeeFeedback";
import FeedbackRequestForm from "./components/employee/FeedbackRequestForm";
import ChangePassword from "./components/employee/ChangePassword";
import NotificationPanel from "./components/employee/NotificationPanel";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page WITHOUT layout */}
        <Route path="/" element={<Login />} />

        {/* Manager routes WITH ManagerLayout */}
        <Route element={<ManagerLayout />}>
          <Route
            path="/dashboardformanager"
            element={<DashboardForManager />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/feedback-history" element={<FeedbackHistory />} />
          <Route path="/requested-feedback" element={<FeedbackRequests />} />
          <Route path="/employee" element={<Employee />} />
        </Route>

        {/* Employee routes WITH EmployeeLayout */}
        <Route element={<EmployeeLayout />}>
          <Route
            path="/dashboardforemployee"
            element={<DashboardForEmployee />}
          />
          <Route
            path="/feedbackrequestform"
            element={<FeedbackRequestForm />}
          />
          <Route path="/employeefeedback" element={<EmployeeFeedback />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/notification" element={<NotificationPanel />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
