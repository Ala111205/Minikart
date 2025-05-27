// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MdEmail } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
export default function AdminLogin({onLoginSuccess}){
    const [email, setEmail]=useState("");

    const [password, setPassword]=useState("");

    const [loginFailed, setLoginFailed]=useState(false);

    const navigate=useNavigate();

    const handleLogin=async(e)=>{
        e.preventDefault();
        try {
            const res = await axios.post("https://minikart-backend.onrender.com/api/admin/login", {
            email,
            password,
            });
            const token = res.data.token; // ✅ Fix is here
            const admin = res.data.admin
            localStorage.setItem("adminToken", token); // ✅ Save correctly
            localStorage.setItem("adminData", JSON.stringify(admin))
            alert("Login successfully");
            onLoginSuccess(); // proceed
            navigate("/navbar",{replace:true});
        } catch (error) {
            setLoginFailed(true); 
            console.log("Login Failed ",error);
            alert("Login failed: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(()=>{
        if (loginFailed){
            setLoginFailed(false);
        }
    },[email,password])

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
      setShowPassword(!showPassword);
    }

    return(
        <>
            <div className="login" id="login">
                <form onSubmit={handleLogin}>
                    <h2>Admin Login</h2>
                    <div>
                        <div>
                            <input type="text" placeholder="" value={email} onChange={(e)=>setEmail(e.target.value)}required />
                            <label>Email</label>
                            <MdEmail className="email" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <input id="visible" type={showPassword ?  "text":'password'} placeholder="" value={password} onChange={(e)=>setPassword(e.target.value)}required />
                            <label>Password</label>
                            {showPassword ?  (<FaEye className="eyes" onClick={togglePassword}/>):(<FaEyeSlash className="eyes" onClick={togglePassword} />)}
                        </div>
                        
                    </div>
                    <div className="bu1">
                        {
                            loginFailed?(<button type="button" onClick={()=>navigate("/forgot-password")}>Forgot password</button>) : (
                            <button type="submit">Login</button>)
                        }
                        <p>Don't have an account? <Link to="/signup">Singup here</Link> </p>
                    </div>
                </form>
            </div>
        </>
    )
}; 