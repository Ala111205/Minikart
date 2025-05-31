import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout(props) {
  const {show,setShow,}=props
  return (
    <>
      <Navbar show={show} setShow={setShow} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
