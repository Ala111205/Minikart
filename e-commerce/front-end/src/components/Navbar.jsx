import { HiMiniShoppingCart } from "react-icons/hi2";
import { VscChromeClose } from "react-icons/vsc";
import { FcSearch } from "react-icons/fc";
import AdminProfile from "../Pages/AdminProfile";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar(props){
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [profile, setProfile]=useState(true);
  const [query, setQuery] = useState("");

  const {auth, show, setShow}=props

  const role = auth?.role;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setQuery(""); // clear input
    }
  };

  useEffect(() => {
    const raw =
      localStorage.getItem("adminData") ||
      localStorage.getItem("userData");

    if (raw) {
      const user = JSON.parse(raw);
      setAdminName(user.name || "User");
    }
  }, []);


  

  const toggleProfileDropdown = () => {
    setProfile(!profile);
  };

  const click = () =>{
    setShow(!show)
  }

  return (
    <>
      <nav className="navbar">
      <div className="navbar-brand">
        <Link>MiniKart</Link>
      </div>

      <ul className={`navbar-links ${show ? "left" : "down"}`}>
        <form className="search-bar">
          <input type="text" placeholder="Search" name="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <FcSearch className="search" onClick={handleSearch} />
        </form>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        {role === "user" && (
          <>
          <li><Link to="/my-orders">Orders</Link></li>
          </>
        )}
        {/* Admin-only link */}
        {role === "admin" && (
          <>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          </>
        )}
      </ul>

      <div className="navbar-profile">
         <div className="profile-dropdown">
            <span className="profile-name" onClick={toggleProfileDropdown}>
              👤 {adminName}
            </span>
            {show && (
              <div className={`comedown ${profile? "goup" : "dropdown-menu"}`}>
                <span> <AdminProfile/> </span>
              </div>
            )}
          </div>
      </div>
      <h1 className="icon" onClick={click}>{show ?<HiMiniShoppingCart /> : <VscChromeClose />}</h1>
    </nav>
    </>
  );
};

