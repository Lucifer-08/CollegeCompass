import '../styles/login.css';
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [data,setData] = useState({
    name:"",
    email:"",
    password:"",
    confirm:""
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  // -------- RIGHT SIDE IMAGE SLIDER ----------
  const images = [
    "https://cdn-icons-png.flaticon.com/512/706/706830.png",
    "https://cdn-icons-png.flaticon.com/512/921/921071.png",
    "https://cdn-icons-png.flaticon.com/512/1785/1785893.png"
  ];

  const [index,setIndex] = useState(0);

  useEffect(()=>{
    const slider = setInterval(()=>{
      setIndex(prev => (prev + 1) % images.length);
    },4000);
    return ()=> clearInterval(slider);
  },[]);


  // ---------- REGISTER FUNCTION ----------
  const handleRegister = async()=>{
    setError("");
    setSuccess("");

    if(!data.name) return setError("Name is required");
    if(!data.email) return setError("Email is required");
    if(!data.password) return setError("Password is required");
    if(data.password.length < 6) return setError("Password must be at least 6 characters");
    if(data.password !== data.confirm) return setError("Passwords do not match");

    try{
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          name: data.name,
          email: data.email,
          password: data.password
        }
      );

      if(res.data.message === "User already exists"){
        setError("User already registered");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully 🎉");
      alert("Registered Successfully");
      navigate("/profile");

    }catch(err){
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return(
    <div className="login-container">

      {/* LEFT PANEL (FORM SIDE NOW) */}
      <div className="register-left">

        <h2 className="logo">CampusCompass</h2>
        <h3 className="welcome">Create Account 🎉</h3>

        <div style={{minHeight:"20px"}}>
          {error && <p style={{color:"red"}}>{error}</p>}
          {success && <p style={{color:"green"}}>{success}</p>}
        </div>

        <label className="input-label">Full Name</label>
        <input 
          className="input"
          placeholder="Enter your name"
          onChange={e=>setData({...data,name:e.target.value})}
        />

        <label className="input-label">Email</label>
        <input 
          className="input"
          autoComplete="off"
          placeholder="Enter email..."
          onChange={e=>setData({...data,email:e.target.value})}
        />

        <label className="input-label">Password</label>
        <input 
          className="input"
          type="password"
          autoComplete="new-password"
          placeholder="Enter password"
          onChange={e=>setData({...data,password:e.target.value})}
        />

        <label className="input-label">Confirm Password</label>
        <input 
          className="input"
          type="password"
          placeholder="Re-enter password"
          onChange={e=>setData({...data,confirm:e.target.value})}
        />

        <button 
          className="signin-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Create Account"}
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
          Sign up with Google
        </button>

        <p className="create">
          Already have an account?
          <span 
            style={{color:"green",cursor:"pointer"}} 
            onClick={()=>navigate("/")}
          >
            {" "}Login
          </span>
        </p>

      </div>


      {/* RIGHT PANEL (IMAGE SIDE NOW) */}
      <div className="register-right">
        
        <img 
          src={images[index]}
          alt="illustration"
          className="illustration"
        />

        <h2 className="left-title">Welcome to CampusCompass</h2>

        <p className="left-text">
          Start your journey towards smarter opportunities 🚀
        </p>

        <div className="dots">
          <span className={index===0 ? "dot active" : "dot"}></span>
          <span className={index===1 ? "dot active" : "dot"}></span>
          <span className={index===2 ? "dot active" : "dot"}></span>
        </div>

      </div>
    </div>
  );
}
