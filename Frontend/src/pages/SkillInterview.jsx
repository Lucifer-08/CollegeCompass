import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/interview.css";

export default function AIInterview() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [currentSkill, setCurrentSkill] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [blurCount, setBlurCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [report, setReport] = useState(null);


  // Anti Cheat
  useEffect(() => {
    const blur = () => setBlurCount(c => c + 1);
    window.addEventListener("blur", blur);
    return () => window.removeEventListener("blur", blur);
  }, []);


  // Start Interview
  const startInterview = async () => {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/user/start-interview",
      { email: user.email }
    );
    setCurrentSkill(res.data.skill);
    setQuestion(res.data.question);
    speak(res.data.question.question);
    setLoading(false);
  };


  // Voice Input
  const startVoice = () => {
    const rec = new window.webkitSpeechRecognition();
    rec.lang = "en-US";
    rec.start();
    rec.onresult = e => setAnswer(e.results[0][0].transcript);
  };


  // Speak Question
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  };


  // Submit Answer
  const submitAnswer = async () => {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/user/evaluate-interview",
      {
        email: user.email,
        answer,
        blurCount
      }
    );

    if (res.data.done) {
      finish();
      return;
    }

    setCurrentSkill(res.data.skill);
    setQuestion(res.data.nextQuestion);
    speak(res.data.nextQuestion.question);
    setAnswer("");
    setLoading(false);
  };


  // Finish Interview
  const finish = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/user/finish-interview",
      { email: user.email }
    );

    setReport(res.data);
    setFinished(true);
    setLoading(false);
  };


  return (
    <div className="interview-container">

      {!question && !finished && (
        <>
          <h2>AI Skill Interview</h2>
          <p>This AI will automatically evaluate ALL your skills.</p>

          <button onClick={startInterview}>
            Start Interview
          </button>
        </>
      )}


      {question && !finished && (
        <div className="interview-box">
          <h3>Skill: {currentSkill}</h3>
          <h4>{question.question}</h4>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Answer here or use mic"
          />

          <div className="controls">
            <button onClick={startVoice}>🎤 Speak</button>
            <button disabled={!answer} onClick={submitAnswer}>Submit</button>
            <button onClick={finish}>Finish</button>
          </div>

          <p className="cheat">Tab Switches Detected: {blurCount}</p>
        </div>
      )}


      {finished && report && (
        <div className="report-box">
          <h2>Interview Completed 🎯</h2>

          <h3>Authenticity Score: {report.authenticityScore}%</h3>

          <h3>Final Skill Levels</h3>

          {report.finalReport.map((s,i)=>(
            <p key={i}>{s.skillName} ➜ {s.level}/9</p>
          ))}
        </div>
      )}

      {loading && <p>Evaluating...</p>}
    </div>
  );
}
