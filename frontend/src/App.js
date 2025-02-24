import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import User_Login from './Components/User_Login';
import User_SignUp from './Components/User_SIgnUp';
import Project from './Components/Project';
import Projects from './Components/Projects';
import HomePage from './Components/HomePage';
function App() {
  return (
    <>
    <Router>
    <Routes>
    <Route path="/" element={<User_Login />} />
    <Route path="/signup" element={<User_SignUp />} />
    <Route path="/Home" element={<HomePage/>}/>
    <Route path="/project" element={<Project/>}/>
    <Route path="/projects" element={<Projects/>}/>
    </Routes>
    </Router>
    </>
  );
}

export default App;
