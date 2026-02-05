import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";

import PrivateRoute from "./Pages/PrivateRoutes";
import Navbar from "./components/Navbar";

import Dashboard from "./Pages/Dashboard";
import AdminLogin from "./Pages/AdminLogin ";
import AdminRegister from "./Pages/AdminRegister";
import ForgotPassword from "./Pages/ForgotPassword";
import AdminProfile from "./Pages/AdminProfile";
import Shop from "./Pages/Shop";
import Products from "./Pages/Products";
import CartPage from "./Pages/Cart";
import CheckoutPage from "./Pages/Checkoutpage";
import AdminOrders from "./Pages/Adminorders";
import UserOrders from "./Pages/UserOrders";

import "./App.css";

const AppContent = () => {
  const [auth, setAuth] = useState({ role: null, token: null, user: null });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const location = useLocation();

  const baseURL = import.meta.env.VITE_API_URL;

  /* --------------------------
     Load token once on start
  ---------------------------*/
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");
    const userToken = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");

    if (adminToken && adminData) setAuth({ role: "admin", token: adminToken, user: JSON.parse(adminData) });
    else if (userToken && userData) setAuth({ role: "user", token: userToken, user: JSON.parse(userData) });

    setLoading(false);
  }, []);

  const handleLoginSuccess = (role, token, user) => {
    setAuth({ role, token, user });
  };

  /* --------------------------
     Detect auth pages
  ---------------------------*/
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  if (loading)
    return (
      <div className="container container-bg">
        <div className="loading"></div>
      </div>
    );

  return (
    <div className={isAuthPage ? "container-bg" : "container"}>
      {/* Navbar OUTSIDE routes */}
      {auth.token && !isAuthPage && (
        <Navbar show={isLoggedIn} setShow={setIsLoggedIn} auth={auth} setAuth={setAuth} />
      )}

      <Routes>
        {/* ============ PUBLIC ============ */}
        <Route
          path="/login"
          element={
            <AdminLogin
              baseURL={baseURL}
              onLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route path="/signup" element={<AdminRegister baseURL={baseURL} />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword baseURL={baseURL} />}
        />

        {/* ============ ADMIN ============ */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="admin" >
              <Dashboard baseURL={baseURL} />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <PrivateRoute role="admin" >
              <AdminOrders baseURL={baseURL} />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <PrivateRoute role="user">
              <UserOrders baseURL={baseURL} />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <PrivateRoute roles={["admin", "user"]}>
              <AdminProfile />
            </PrivateRoute>
          }
        />

        {/* ============ USER ============ */}
        <Route
          path="/shop"
          element={
            <PrivateRoute roles={["admin", "user"]}>
              <Shop baseURL={baseURL} />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute roles={["admin", "user"]}>
              <CartPage baseURL={baseURL} />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute roles={["admin", "user"]}>
              <CheckoutPage baseURL={baseURL} auth={auth} />
            </PrivateRoute>
          }
        />

        {/* shared */}
        <Route
          path="/products/:id"
          element={<Products baseURL={baseURL} />}
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}