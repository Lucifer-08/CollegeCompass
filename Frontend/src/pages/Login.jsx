import "../styles/login.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  // form state (always empty on refresh)
  const [data,setData] = useState({
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  // ---------------- IMAGE SLIDESHOW ----------------
  const images = [
    "https://cdn-icons-png.flaticon.com/512/201/201623.png",
    "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
    "https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
  ];

  const [index,setIndex] = useState(0);

  useEffect(()=>{
    const slider = setInterval(()=>{
      setIndex((prev)=> (prev + 1) % images.length);
    },4000);

    return ()=> clearInterval(slider);
  },[]);

  // prevent browser autofill
  useEffect(()=>{
    setData({email:"",password:""});
  },[]);

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    setError("");

    if(!data.email){
      setError("Email is required");
      return;
    }

    if(!data.password){
      setError("Password is required");
      return;
    }

    try{
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        data
      );

      if(res.data.message === "No user"){
        setError("User does not exist");
        setLoading(false);
        return;
      }

      if(res.data.message === "Wrong password"){
        setError("Incorrect password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful 🎉");
      navigate("/dashboard");

    }catch(err){
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">

      {/* LEFT */}
      <div className="login-left">
        <img 
          src={images[index]}
          alt="illustration"
          className="illustration"
        />

        <h2 className="left-title">
          Maecenas mattis egestas
        </h2>

        <p className="left-text">
          Erdum et malesuada fames ac ante ipsum primis
          in faucibus suspendisse porta.
        </p>

        <div className="dots">
          <span className={index===0 ? "dot active" : "dot"}></span>
          <span className={index===1 ? "dot active" : "dot"}></span>
          <span className={index===2 ? "dot active" : "dot"}></span>
        </div>
      </div>


      {/* RIGHT */}
      <div className="login-right">

        <h2 className="logo">CampusCompass</h2>
        <h3 className="welcome">Welcome Back 👋</h3>

        {/* ERROR BOX (doesn't break layout) */}
        <div style={{minHeight:"18px"}}>
          {error && <p style={{color:"red"}}>{error}</p>}
        </div>

        <label className="input-label">Username or Email</label>
        <input 
          className="input"
          autoComplete="off"
          placeholder="Enter email..."
          value={data.email}
          onChange={e=>setData({...data,email:e.target.value})}
        />

        <label className="input-label">Password</label>

        <div className="password-wrapper">
        <input 
            className="input"
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={data.password}
            onChange={e=>setData({...data,password:e.target.value})}
        />

        {/* 👁️ EYE ICON */}
        <span 
            className="eye-icon"
            onClick={()=>setShowPassword(!showPassword)}
        >
            {showPassword ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#666" viewBox="0 0 24 24"><path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.761 0-5-2.239-5-5 0-2.762 2.239-5 5-5s5 2.238 5 5c0 2.761-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3c1.653 0 3-1.346 3-3s-1.347-3-3-3z"/></svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#666" viewBox="0 0 24 24"><path d="M12 5c-7.633 0-12 7-12 7 1.71 2.492 4.22 4.874 7.607 6.035l-1.548-1.548c-1.938-1.093-3.442-2.661-4.605-4.487 0 0 4.367-7 12-7 .919 0 1.81.072 2.674.21l-1.628-1.628c-1.01-.37-2.073-.582-3.173-.582zm9.192 3.222c1.217 1.216 2.13 2.479 2.808 3.778 0 0-4.367 7-12 7-1.223 0-2.395-.149-3.514-.423l-1.707-1.707c1.608.699 3.428 1.13 5.221 1.13 7.633 0 12-7 12-7-.627-1.147-1.45-2.299-2.657-3.778l-1.151-1.151z"/></svg>
            }
        </span>
        </div>


        <div className="forgot">
          <a href="#">Forgot password?</a>
        </div>

        <button 
          className="signin-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Sign in"}
        </button>

        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <button className="google-btn">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="google"
          />
          Sign in with Google
        </button>

        {/* CREATE ACCOUNT ALWAYS VISIBLE */}
        <div style={{marginTop:"auto"}}>
        <p className="create">
            New CampusCompass?
            <span 
            style={{color:"green",cursor:"pointer"}} 
            onClick={()=>navigate("/register")}
            >
            {" "}Create Account
            </span>
        </p>
        </div>



      </div>
    </div>
  );
}
