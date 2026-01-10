import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/roadmap.css";

export default function SkillRoadmap() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const skill = state?.skill;

  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cleanText = (text) =>{
    if(!text) return "";
    return text.replace(/\*\*/g, "").replace(/•/g, "");
  }

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const res = await axios.post("http://localhost:5000/api/user/skill-roadmap", {
          email : user.email,
          skill
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      }finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [skill]);

  if (loading) {
    return (
  <div className="roadmap-skeleton">

    <div className="sk-title"></div>
    <div className="sk-subtitle"></div>

    <div className="sk-overview">
      {[1,2,3].map(i => <div key={i} className="sk-box"></div>)}
    </div>

    <div className="sk-timeline">
      {[1,2,3].map(i => (
        <div key={i} className="sk-step"></div>
      ))}
    </div>

    <div className="sk-projects">
      {[1,2,3].map(i => <div key={i} className="sk-project"></div>)}
    </div>

    <div className="sk-resources">
      {[1,2,3].map(i => <div key={i} className="sk-resource"></div>)}
    </div>

  </div>
    );
  }

  if (!data) {
    return <h2 style={{ textAlign: "center" }}>No roadmap found</h2>;
  }

  return (
    <div className="roadmap-container">

      {/* HEADER */}
      <div className="roadmap-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>{skill} Roadmap</h1>
        <p className="subtitle">
          Personalized learning path based on your profile
        </p>
      </div>

      {/* OVERVIEW */}
      <div className="overview-grid">
        <div className="overview-card">
          <h4>Why Important</h4>
          <p>{data.why_important}</p>
        </div>

        <div className="overview-card">
          <h4>Difficulty</h4>
          <p>{data.difficulty}</p>
        </div>

        <div className="overview-card">
          <h4>Time Required</h4>
          <p>{data.time_required}</p>
        </div>
      </div>

      {/* LEARNING PATH */}
      <h2 className="section-title">Learning Path</h2>

      <div className="path-grid">

        <div className="path-card beginner">
          <h3>Beginner</h3>
          <ul>
            {data.learning_path?.beginner?.map((s, i) => (
              <li key={i}>✅{cleanText(s)}</li>
            ))}
          </ul>
        </div>

        <div className="path-card intermediate">
          <h3>Intermediate</h3>
          <ul>
            {data.learning_path?.intermediate?.map((s, i) => (
              <li key={i}>🚀{cleanText(s)}</li>
            ))}
          </ul>
        </div>

        <div className="path-card advanced">
          <h3>Advanced</h3>
          <ul>
            {data.learning_path?.advanced?.map((s, i) => (
              <li key={i}>🔥{cleanText(s)}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* PROJECTS */}
      <h2 className="section-title">Recommended Projects</h2>
      <div className="project-grid">
        {data.projects?.map((p, i) => (
          <div key={i} className="project-card">
            🛠️ {cleanText(p)}
          </div>
        ))}
      </div>

      {/* RESOURCES */}
      <h2 className="section-title">Learning Resources</h2>

      <div className="resource-grid">
        <div className="resource-card">
          <h4>📺 YouTube</h4>
          <ul>
            {data.recommended_resources?.youtube?.map((r, i) => (
              <li>
                <a href={r.match(/\((.*?)\)/)?.[1] || "#"}
                  target="_blank"
                  rel="noreferrer">
                  {cleanText(r.replace(/\(.*?\)/, ""))}
                </a>
              </li>

            ))}
          </ul>
        </div>

        <div className="resource-card">
          <h4>📚 Courses</h4>
          <ul>
            {data.recommended_resources?.courses?.map((r, i) => (
              <li>
                <a href={r.match(/\((.*?)\)/)?.[1] || "#"}
                  target="_blank"
                  rel="noreferrer">
                  {cleanText(r.replace(/\(.*?\)/, ""))}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="resource-card">
          <h4>📖 Documentation</h4>
          <ul>
            {data.recommended_resources?.documentation?.map((r, i) => (
              <li>
                <a href={r.match(/\((.*?)\)/)?.[1] || "#"}
                  target="_blank"
                  rel="noreferrer">
                  {cleanText(r.replace(/\(.*?\)/, ""))}
                </a>
              </li>
              ))}
          </ul>
        </div>
      </div>

      {/* TIPS */}
      <div className="tips-box">
        <h3>💡 Pro Tips</h3>
        <p>{cleanText(data.extra_tips)}</p>
      </div>

    </div>
  );
}
