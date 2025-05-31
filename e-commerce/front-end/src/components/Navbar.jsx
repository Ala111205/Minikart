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

  const {show,setShow}=props
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setQuery(""); // Optional: clear input
    }
  };

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("adminData"));
    if (adminData) {
      setAdminName(adminData.name || "Admin");
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/",{replace:true}); // Redirect if not logged in
    }

    const unblock = window.history.pushState(null, null, null, window.location.href);
    window.onpopstate = function () {
      unblock
    };
    return () => {
      window.onpopstate = null;
    };
  }, []);

  

  const toggleProfileDropdown = () => {
    setProfile(!profile);
  };

  const click = () =>{
    setShow(!show)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/");
  };

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
        <li><Link to="/admin/orders">Orders</Link></li>
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

