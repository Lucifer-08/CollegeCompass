import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/internships.css";

export default function AllInternships() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post("http://localhost:5000/api/user/recommended-internships",
      { email: user.email }
    )
    .then(res => {
      setList(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  return (
    <div className="internship-section full-page">
      <div className="section-header">
        <h2>All Recommended Internships</h2>
      </div>

      {/* SKELETON */}
      {loading ? (
        <div className="internship-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="internship-card pro-card skeleton-card">

              <div className="left-box">
                <div className="sk-title"></div>
                <div className="sk-company"></div>

                <div className="sk-meta"></div>
                <div className="sk-meta short"></div>

                <div className="sk-btn"></div>
              </div>

              <div className="right-box">
                <div className="sk-logo"></div>
                <div className="sk-badge"></div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="internship-grid">
          {list.map((job, i) => (
            <div key={i} className="internship-card pro-card">

              <div className="right-box">
                <img
                  src={job.logo || "https://via.placeholder.com/70"}
                  className="company-logo"
                />
                <span className="match-tag">{job.matchScore}% Match</span>
              </div>

              <div className="left-box">
                <h3 className="job-title">{job.title}</h3>
                <p className="company-name">{job.company}</p>

                <div className="meta">
                  <span>{job.type || "Full Time"}</span>
                  <span>•</span>
                  <span>{job.location || "Remote"}</span>
                </div>

                <div className="meta">
                  <span>Stipend:</span>
                  <strong>{job.stipend || "Not Disclosed"}</strong>
                </div>

                <div className="card-bottom">
                  <button className="view-btn">View Details</button>
                  <a href={job.link} target="_blank" className="apply-btn">
                    Apply
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
