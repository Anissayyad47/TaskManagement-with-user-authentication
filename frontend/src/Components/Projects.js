import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/ProjectsPage.css"; // Import external CSS file
import Navbar from "./NavBar";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            console.log("User not logged in");
            return;
        }
        async function fetchProjects() {
            try {
                const response = await axios.get(`http://localhost:5000/projects/${userId}`);
                setProjects(response.data); // 🔥 Store projects in state
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        }
        fetchProjects();
    }, [userId]);

    function handleContinueProject(project){
        localStorage.setItem("projectId", project._id);
        localStorage.setItem("projectTitle", project.project_title);
        navigate("/project")
    }

    return (
        <>
        <Navbar></Navbar>
        <div className="projects-container">
            <div className="projects-container-in">
                <p className="all-projects">All Projects</p>
                <hr className="line"></hr>
                {projects.length===0 ?(
                    <p>No Projects found</p>
                ) : (
                    projects.map((project)=> (
                        <div className="project-list"><p>{project.project_title}e</p><button onClick={()=> handleContinueProject(project)}>Continue</button></div>
                    ))
                )}
                
            </div>
        </div>
        </>
    );
};

export default ProjectsPage;
