import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { FaUser, FaProjectDiagram, FaSignOutAlt } from "react-icons/fa"; 
import { IoMdHome } from "react-icons/io";

import "./CSS/NavBar.css";

function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const Username=localStorage.getItem("Username")

    function handleLogOut(){
        localStorage.removeItem("userId");
        localStorage.removeItem("Username");
        localStorage.removeItem("projectId");
        localStorage.removeItem("projectTitle");
        alert("Logged out successfully!");
        navigate("/")
    }
    return (
        <div className="navbar-container">
            <div className="navbar-container-in">
            <div className="navbar">
                <p className="navbar-logo" onClick={() => navigate("/Home")}>Task Management</p>
                <LuMenu className="navbar-profile" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>

            {/* Sidebar Menu */}
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>✖</button>
                <div className="sidebar-content">
                    <div className="sidebar-content-profile">
                    <div className="sidebar-item">
                        <FaUser className="sidebar-icon" /> {Username}
                    </div>
                    </div>
                    <hr></hr>
                    <div className="sidebar-item" onClick={() => navigate("/Home")}>
                        <IoMdHome className="sidebar-icon" /> Home
                    </div>
                    <div className="sidebar-item" onClick={() => navigate("/projects")}>
                        <FaProjectDiagram className="sidebar-icon" /> Projects
                    </div>
                    <div className="sidebar-item logout" onClick={handleLogOut}>
                        <FaSignOutAlt className="sidebar-icon"/> Logout
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Navbar;


