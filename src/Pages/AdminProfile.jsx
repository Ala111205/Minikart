import { useNavigate } from "react-router-dom";

export default function AdminProfile({onLogout}){
  const navigate = useNavigate();

  const adminData = JSON.parse(localStorage.getItem("adminData")); // Assuming you store it during login
  const adminName = adminData?.name || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    window.location.href="/"
  };

  return (
    <div className="profile">
      <h2>Admin Profile</h2>
      <p><strong>Name:</strong> {adminName}</p>
      <p><strong>Email:</strong> {adminData?.email}</p>
      {/* Add more admin info if needed */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

