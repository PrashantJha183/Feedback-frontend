import { Outlet } from "react-router-dom";
import Header from "../employee/Header";

const EmployeeLayout = () => {
  const employeeName = sessionStorage.getItem("name") || "";
  return (
    <Header employeeName={employeeName}>
      <Outlet />
    </Header>
  );
};

export default EmployeeLayout;
