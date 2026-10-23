import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default MainLayout;
