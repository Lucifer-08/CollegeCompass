import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard(){
  const user = JSON.parse(localStorage.getItem("user"));
  const [data,setData]=useState({});
  const [ai,setAi]=useState(null);

  useEffect(()=>{
    const load = async()=>{
      const res = await axios.post(
        "http://localhost:5000/api/user/recommend",
        user
      );
      setAi(res.data);
    }
    load();
  },[]);

  return(
    <div>
      <h1>Welcome {user.name}</h1>

      <h2>Internship Suggestions</h2>
      <pre>{JSON.stringify(ai?.internships,null,2)}</pre>

      <h2>Skill Gap</h2>
      <pre>{JSON.stringify(ai?.skills,null,2)}</pre>

      <h2>Career Roadmap</h2>
      <pre>{JSON.stringify(ai?.roadmap,null,2)}</pre>
    </div>
  )
}
