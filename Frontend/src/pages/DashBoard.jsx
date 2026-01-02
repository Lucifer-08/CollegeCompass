import { useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.css';
import Hero from '../components/Hero.jsx';
import RecommendedInternships from '../components/RecommendedInternships.jsx';


export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [exists,setExists] = useState(false);

  useEffect(()=>{
    axios.post("http://localhost:5000/api/user/has-skill-chart",{email:user.email})
    .then(res=> setExists(res.data.exists))
  },[]);
  
  const handleSkillChart = ()=>{
  if(exists) navigate("/skill-chart");
  else navigate("/create-skill-chart");
  };

  return (
    <div className="dashboard-wrapper">
  <Hero/>

  <main className="dashboard-main">
    <div className="dashboard-container">

      <div className="dashboard-heading">
        <h2>Your Performance Overview</h2>
      </div>

      <div className="dashboard-grid">

        <div className="card" onClick={() => navigate('/analysis')}>
          <div className="card-icon">🚀</div>
          <h3>Skill Gap</h3>
          <p>Our AI is analyzing your profile to identify missing skills.</p>
        </div>

        <div className="card">
          <div className="card-icon">🗺️</div>
          <h3>Roadmap</h3>
          <p>Coming soon based on your saved profile data.</p>
        </div>

          {/* Technical Skills Card */} 
        <div className="card">
          <div className="card-icon">📊</div>
          <h3>Skill Chart</h3>
          <p>Visualize your technical strengths and growth.</p>
          <div className="btn-container">
          <button onClick={handleSkillChart} class="skill-btn">
            {exists ? "View Skill Chart" : "Create Skill Chart"}
          </button>
          </div>
        </div>
      </div>

      {/* Recommended Internships Section */}
      <div className="mt-16">
        <RecommendedInternships />
      </div>

    </div>
  </main>
</div>

  );
}