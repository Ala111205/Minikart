import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout({ auth, setAuth }) {
  return (
    <>
      {auth?.token && <Navbar auth={auth} setAuth={setAuth} />}
      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}