import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inVisible, setVisible] = useState(false);

  const navigate=useNavigate();

  const togglePassword=()=>{
    setVisible(!inVisible);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("https://minikart-backend.onrender.com/api/admin/forgot-password", {
        email,
        newPassword,
      });
      alert(res.data.message);
      navigate("/",{replace:true})
      window.location.replace("/navbar");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="forgot-password">
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <div>
          <input type="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Your Registered Email</label>
          < MdEmail className="e-mail" />
        </div>
        <div>
          <input type={inVisible ? "text" : "password"} placeholder="" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <label>New Password</label>
          {inVisible ? (< FaEye className="open" onClick={togglePassword}/>) : (< FaEyeSlash className="close" onClick={togglePassword} />)}
        </div>
        <div>
          <input type={inVisible ? "text" : "password"} placeholder="" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <label>Confirm Password</label>
          {inVisible ? (< FaEye className="open" onClick={togglePassword}/>) : (< FaEyeSlash className="close" onClick={togglePassword} />)}
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}