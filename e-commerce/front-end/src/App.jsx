import {useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./Pages/PrivateRoutes";
import Layout from "./Pages/Layout";
import Navbar from "./components/Navbar";
import Dashboard from "./Pages/Dashboard";
import AdminLogin from './Pages/AdminLogin ';
import AdminRegister from "./Pages/AdminRegister";
import ForgotPassword from "./Pages/ForgotPassword";
import AdminProfile from "./Pages/AdminProfile";
import Shop from "./Pages/Shop";
import Products from "./Pages/Products";
import CartPage from "./Pages/Cart";
import CheckoutPage from "./Pages/Checkoutpage";
import Buying from "./Pages/Buying";
import AdminOrders from "./Pages/Adminorders";
import './App.css';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  console.log("Token in localStorage:", localStorage.getItem("adminToken"));
  console.log("isLoggedIn:", isLoggedIn);

  const isAuthPage = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  if (loading) {
    // still loading
    return <div className="loading"></div>;
  }

  const baseURL=process.env.VITE_API_URL

  return (
    <div className={isAuthPage ? "container-bg" : "container"}>
      <Routes>
        <Route path="/" element={<AdminLogin onLoginSuccess={handleLoginSuccess} baseURL={baseURL} />}/>
        <Route path="/signup" element={<AdminRegister baseURL={baseURL} />}  />
        <Route path="/forgot-password" element={<ForgotPassword baseURL={baseURL} />} />
        <Route path="/Navbar" element={
        <PrivateRoute>
          <Navbar show={isLoggedIn} setShow={setIsLoggedIn} profile={loading} setProfile={setLoading} />
        </PrivateRoute>}/>
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>}/>
        <Route element={<PrivateRoute><Layout show={isLoggedIn} setShow={setIsLoggedIn} profile={loading} setProfile={setLoading} /></PrivateRoute>}>
          <Route path="/products/:id" element={<Products />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/checkout" element={< CheckoutPage/>} />
          <Route path="/Buying" element={<Buying/>} />
          <Route path="/shop" element={<Shop baseURL={baseURL} />} />
          <Route path="/cart" element={<CartPage baseURL={baseURL} />} />
          <Route path="/admin/orders" element={<AdminOrders baseURL={baseURL} />} />
          <Route path="/checkout" element={< CheckoutPage baseURL={baseURL}/>} />

        </Route>
        <Route path="/admin/profile" element={<AdminProfile />} />
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
