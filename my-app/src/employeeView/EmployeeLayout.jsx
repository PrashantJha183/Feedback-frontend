import { Outlet } from "react-router-dom";
import Header from "../components/employee/Header";

const EmployeeLayout = () => {
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const employeeName = storedUser.name || "Employee";

  return (
    <Header employeeName={employeeName}>
      <Outlet />
    </Header>
  );
};

export default EmployeeLayout;
