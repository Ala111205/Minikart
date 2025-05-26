import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function AdminRegister() {
  const navigate = useNavigate(); //use navigate for redirecte page is a router method

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("password: " + form.password)
    console.log("confirm: " + form.confirmpassword)
    if (form.confirmpassword !== form.confirmpassword) {
      return alert("Passwords do not match")
    }

    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password
      });
      alert(res.data.message);
      navigate("/", { replace: true }) //go to the admin login
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const [getPassword, setGetPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setGetPassword(!getPassword);
  }

  return (
    <div className="register">
      <form onSubmit={handleRegister}>
        <h2>Register Admin</h2>
        <div>
          <input name='firstname' placeholder="" type="text" value={form.firstname} onChange={handleChange} required />
          <label>Firstname</label>
        </div>
        <div>
          <input name='lastname' placeholder="" type="text" value={form.lastname} onChange={handleChange} required />
          <label>Lastname</label>
        </div>
        <div>
          <input name='email' placeholder="" type="email" value={form.email} onChange={handleChange} required />
          <label>Email</label>
          < MdEmail className="email"/>
        </div>
        <div>
          <input name='password' placeholder="" type={showPassword ? "text" : 'password'} value={form.password} onChange={handleChange} required />
          <label>Password</label>
          {showPassword ? (<FaEye className="eye" onClick={togglePassword} />) : (<FaEyeSlash className="eye" onClick={togglePassword} />)}
        </div>
        <div>
          <input name='confirmpassword' placeholder="" type={getPassword ? "text" : 'password'} value={form.confirmpassword} onChange={handleChange} required />
          <label>Confirm password</label>
          {getPassword ? (<FaEye className="eye" onClick={toggleConfirmPassword} />) : (<FaEyeSlash className="eye" onClick={toggleConfirmPassword} />)}
        </div>
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
