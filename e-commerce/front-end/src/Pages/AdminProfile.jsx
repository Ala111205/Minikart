import { useNavigate } from "react-router-dom";

export default function Profile({ auth, setAuth }) {
  const navigate = useNavigate();

  // Get user from auth state first; fallback to localStorage
  const user =
    auth?.user ||
    JSON.parse(localStorage.getItem("adminData")) ||
    JSON.parse(localStorage.getItem("userData"));

  const name = user?.name || "User";
  const email = user?.email || "";

  const handleLogout = () => {
    // Remove all authentication data
    ["adminToken", "userToken", "adminData", "userData"].forEach((key) =>
      localStorage.removeItem(key)
    );

    // Reset React auth state
    if (setAuth) setAuth({ role: null, token: null, user: null });

    // Navigate to login page 
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}