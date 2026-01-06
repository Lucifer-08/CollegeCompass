import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/skillgap.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function SkillGap() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post("http://localhost:5000/api/user/skill-gap",
      { email: user.email }
    ).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="skillgap-wrapper">
        <h2>Skill Gap Analysis</h2>

        <div className="gap-container skeleton">
          <div className="sk-chart"></div>

          <div className="sk-block"></div>
          <div className="sk-block short"></div>
          <div className="sk-block"></div>
        </div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="skillgap-wrapper">
        <h2>Skill Gap Analysis</h2>
        <p className="error">⚠️ Update your profile or try again later.</p>
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        data: [data.completionScore, 100 - data.completionScore],
        backgroundColor: ["#6b76ff", "#ebeefe"],
        cutout: "75%"
      },
    ],
  };

  return (
    <div className="skillgap-wrapper">
      <h2>Skill Gap Analysis</h2>

      <div className="gap-container">

        <div className="chart-box">
          <Doughnut data={chartData} />
          <div className="percent">
            {data.completionScore}%
            <span>Complete</span>
          </div>
        </div>

        <div className="stack-box">
          <h3>Required Core Stack</h3>
          <div className="stack-list">
            {data.fullStack.map((s,i)=>(
              <span key={i} className="stack-item">{s}</span>
            ))}
          </div>

          <h3 className="mt">Missing Skills</h3>
          {!data.missing.length && (
            <p className="success">🎉 You have a complete stack!</p>
          )}

          {data.missing.map((m,i)=>(
            <div key={i} className="missing-card">
              <strong onClick={() => navigate("/roadmap",{ state:{ skill:m.name } })}>{m.name}</strong>
              <p>{m.reason}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
