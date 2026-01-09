import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/learnSkill.css";

export default function LearnSkill({ location }) {
  const { skill, playlistId } = location.state;
  const user = JSON.parse(localStorage.getItem("user"));

  const [videos, setVideos] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    axios.post("/api/user/playlist-videos", { playlistId })
      .then(res => setVideos(res.data));
  }, []);

  const markComplete = (videoId) => {
    axios.post("/api/user/update-progress", {
      email: user.email,
      skill,
      videoId,
      totalVideos: videos.length
    });

    setCompleted(prev => [...prev, videoId]);
  };

  const progress = Math.round((completed.length / videos.length) * 100);

  return (
    <div className="learn-container">
  <h2>{skill} Learning Path</h2>

  <div className="progress-wrapper">
    <div className="progress-bar">
      <div style={{ width: `${progress}%` }} />
    </div>
    <p className="progress-text">
      {completed.length} / {videos.length} videos completed ({progress}%)
    </p>
  </div>

  <div className="video-list">
    {videos.map(v => (
      <div key={v.videoId} className="video-card">

        <img src={v.thumbnail} alt="" />

        <div className="video-info">
          <h4>{v.title}</h4>
          <p>YouTube Playlist Video</p>
        </div>

        <div className="video-actions">
          <button
            className="complete-btn"
            disabled={completed.includes(v.videoId)}
            onClick={() => markComplete(v.videoId)}
          >
            {completed.includes(v.videoId)
              ? "Completed ✔"
              : "Mark Done"}
          </button>
        </div>

      </div>
    ))}
  </div>
</div>

  );
}
