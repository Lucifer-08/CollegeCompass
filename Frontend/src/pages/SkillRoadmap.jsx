import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function SkillRoadmap() {
  const { state } = useLocation();
  const skill = state?.skill;

  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.post("http://localhost:5000/api/user/skill-roadmap", {
      skill,
      userProfile: user
    }).then(res => setData(res.data));
  }, []);

  if (!data)
    return <h2 style={{textAlign:"center"}}>Building your roadmap… ⏳</h2>;

  return (
    <div className="roadmap-container">
      <h1>{skill} Learning Roadmap</h1>

      <p><b>Why Important:</b> {data.why_important}</p>
      <p><b>Difficulty:</b> {data.difficulty}</p>
      <p><b>Time Required:</b> {data.time_required}</p>

      <h2>Learning Path</h2>

      <h3>Beginner</h3>
      <ul>
        {data.learning_path.beginner.map((s,i)=> <li key={i}>{s}</li>)}
      </ul>

      <h3>Intermediate</h3>
      <ul>
        {data.learning_path.intermediate.map((s,i)=> <li key={i}>{s}</li>)}
      </ul>

      <h3>Advanced</h3>
      <ul>
        {data.learning_path.advanced.map((s,i)=> <li key={i}>{s}</li>)}
      </ul>

      <h2>Projects</h2>
      <ul>
        {data.projects.map((p,i)=> <li key={i}>{p}</li>)}
      </ul>

      <h2>Resources</h2>
      <p>📺 YouTube</p>
      <ul>
        {data.recommended_resources.youtube.map((s,i)=> <li key={i}>{s}</li>)}
      </ul>

      <p>📚 Courses</p>
      <ul>
        {data.recommended_resources.courses.map((s,i)=> <li key={i}>{s}</li>)}
      </ul>

      <p>📖 Docs</p>
      <ul>
        {data.recommended_resources.documentation.map((s,i)=> <li key={i}>{s}</li>)}
      </ul>

      <h2>Tips</h2>
      <p>{data.extra_tips}</p>
    </div>
  );
}
