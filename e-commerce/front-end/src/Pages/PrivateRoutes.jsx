import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if(!token){
    return  <Navigate to="/" replace />;
  }
  return children;
}