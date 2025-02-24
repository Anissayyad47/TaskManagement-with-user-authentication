import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./CSS/HomePage.css"; // External CSS for styling
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [createProjectPopup, setCreateProjectPopup] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");
    const userId = localStorage.getItem("userId");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const [user_Name,setUsername]=useState("");

    // get username from database
    useEffect(()=> {
        if (!userId) {
            alert("User not logged in")
            return;
        }
        async function fetchUserName(){
            try{
                const response=await axios.get(`http://localhost:5000/userName/${userId}`)
                setUsername(response.data.display_name);
                localStorage.setItem("Username",response.data.display_name );
                console.log("user Name is : "+response.data.display_name);
            } catch (error){
                console.error("Error fetching UserName:", error);
            }
        }
        fetchUserName();
    },[userId])

    const handleCreateProject =async () => {
        if (!projectTitle.trim()) {
            alert("Project title cannot be empty!");
            return;
        }
        console.log("Creating Project:", projectTitle);
        setCreateProjectPopup(false);
        setProjectTitle(""); // Reset input

        try {
            const response = await axios.post("http://localhost:5000/createProject", { 
                userId, 
                project_title: projectTitle 
            });
    
            setMsg(response.data.message);  // Store response message
            localStorage.setItem("projectId", response.data.projectId);
            localStorage.setItem("projectTitle", response.data.project_title);
            alert("Project Created Successfully!");
            navigate("/project");  // Move navigation inside the success block
        } catch (error) {
            if (error.response && error.response.data.error === "Project name already Exists") {
                console.error("Project name already exists");
                setMsg("Project name already exists");
                alert(msg);
            } else {
                console.error("Error:", error);
                setMsg("Failed to create project");
            }
        }
    };
    

    return (
        <>
        <div className="MainPage">
            <NavBar />
            <div className="MainPage-in">
                <div className="welcome-container">
                    <h1>👋 Hi, {user_Name}!</h1>
                    <p>Welcome to your project management space. Here, you can create, manage, and track your tasks efficiently.</p>
                </div>


                <button className="create-project-btn" onClick={() => setCreateProjectPopup(true)}>
                    ➕ Create New Project
                </button>
            </div>

            {/* Popup for Creating a Project */}
            {createProjectPopup && (
                <div className="project-create-popup-overlay" onClick={() => setCreateProjectPopup(false)}>
                    <div className="project-create-popup" onClick={(e) => e.stopPropagation()}>
                        <h2>Create a New Project</h2>
                        <input 
                            type="text" 
                            placeholder="Enter Project Title" 
                            value={projectTitle} 
                            onChange={(e) => setProjectTitle(e.target.value)} 
                        />
                        <div className="popup-buttons">
                            <button className="create-btn" onClick={handleCreateProject}>Create</button>
                            <button className="cancel-btn" onClick={() => setCreateProjectPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
        <Footer></Footer>
        </>
    );
};

export default HomePage;
