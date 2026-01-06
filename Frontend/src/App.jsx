import {Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/DashBoard";
import CreateSkillChart from './pages/CreateSkillChart';
import SkillChart from './pages/SkillChart';
import Navbar from "./components/Navbar";
import AllInternships from "./pages/AllInernship";
import InternshipDetails from "./pages/InernshipDetails";
import SkillGap from "./pages/SkillGap";
import SkillRoadmap from "./pages/SkillRoadmap";

export default function App(){
  return(
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Login/>}/>  
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/create-skill-chart" element={<CreateSkillChart />} />
      <Route path="/skill-chart" element={<SkillChart />} />
      <Route path="/internships" element={<AllInternships />} />
      <Route path="/internship/details" element={<InternshipDetails />} />
      <Route path="/skill-gap" element={<SkillGap />} />
      <Route path="/roadmap" element={<SkillRoadmap />} />
    </Routes>
  </>
  )
}
