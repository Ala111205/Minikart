import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin({ onLoginSuccess, baseURL }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${baseURL}/api/admin/login`, { email, password });
        console.log("FULL RESPONSE:", res.data);

        const { token, user } = res.data;

        console.log("TOKEN:", token);
        console.log("USER:", user);
        console.log("ROLE:", user?.role);

        alert("Login successful!"); 
        
        if (user.role === "admin") {
          localStorage.setItem("adminToken", token);
          localStorage.setItem("adminData", JSON.stringify(user));
          onLoginSuccess("admin", token, user);
          navigate("/dashboard");
        } else {
          localStorage.setItem("userToken", token);
          localStorage.setItem("userData", JSON.stringify(user));
          onLoginSuccess("user", token, user);
          navigate("/shop");
        }

        console.log("After save:", localStorage);
        console.log("token:", token);

    } catch (err) {
        console.error(err)
        setLoginFailed(true);
        alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (loginFailed) setLoginFailed(false);
  }, [email, password]);

  return (
    <div className="login" id="login">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <div>
          <div>
            <input
              type="text"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
            <MdEmail className="email" />
          </div>
        </div>

        <div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
            {showPassword ? (
              <FaEye className="eyes" onClick={togglePassword} />
            ) : (
              <FaEyeSlash className="eyes" onClick={togglePassword} />
            )}
          </div>
        </div>

        <div className="bu1">
          {loginFailed ? (
            <button type="button" onClick={() => navigate("/forgot-password")}>
              Forgot password
            </button>
          ) : (
            <button type="submit">Login</button>
          )}
          <p>
            Don't have an account? <Link to="/signup">Signup here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}