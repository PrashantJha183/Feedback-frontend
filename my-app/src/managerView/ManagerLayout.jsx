import Header from "../components/manager/Header";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  const managerName = sessionStorage.getItem("name") || "";
  return (
    <Header managerName={managerName}>
      <Outlet />
    </Header>
  );
};

export default ManagerLayout;
