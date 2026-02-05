import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles = [] }) {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  let currentRole = null;

  if (adminToken) currentRole = "admin";
  else if (userToken) currentRole = "user";

  // not logged in
  if (!currentRole) return <Navigate to="/login" replace />;

  // role not allowed
  if (roles.length && !roles.includes(currentRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}