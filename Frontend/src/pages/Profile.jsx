import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile(){
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [data,setData]=useState({
    email:user.email,
    college:"",branch:"",cgpa:"",skills:"",interests:"",achievements:""
  });

  const save = async()=>{
    await axios.post("http://localhost:5000/api/user/save-profile",data);
    alert("Saved");
    nav("/dashboard");
  }

  return(
    <div>
      <h1>Profile</h1>

      <input placeholder="college" onChange={e=>setData({...data,college:e.target.value})}/>
      <input placeholder="branch" onChange={e=>setData({...data,branch:e.target.value})}/>
      <input placeholder="cgpa" onChange={e=>setData({...data,cgpa:e.target.value})}/>
      <input placeholder="skills" onChange={e=>setData({...data,skills:e.target.value})}/>
      <input placeholder="interests" onChange={e=>setData({...data,interests:e.target.value})}/>
      <input placeholder="achievements" onChange={e=>setData({...data,achievements:e.target.value})}/>

      <button onClick={save}>Save</button>
    </div>
  );
}
