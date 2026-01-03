import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/internships.css';

export default function RecommendedInternships() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:5000/api/user/recommended-internships",
      { email: user.email }
    ).then(res => setList(res.data));
  }, []);

  if (!list.length)
    return (
      <div className="internship-section">
        <h2>Recommended Internships</h2>
        <p>Update your profile to get recommendations.</p>
      </div>
    );

  return (
    <div className="internship-section">
      <div className="section-header">
        <h2>Recommended Internships</h2>
        <button className="explore-btn">Explore All →</button>
      </div>

      <div className="internship-grid">
        {list.slice(0,4).map((job, i) => (
          <div key={i} className="internship-card">

            <div className="card-top">
              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>

              <span className="match">
                {job.matchScore}% Match
              </span>
            </div>

            <p className="desc">{job.description?.slice(0,180)}</p>

            <div className="skills">
              {job.skills && job.skills.map((s, i)=>(
                <span key={i}>{s}</span>
            ))}

            </div>

            <div className="actions">
              <button className="view-btn">View Details</button>
              <a href={job.link} target="_blank" className="apply-btn">
                Apply
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
