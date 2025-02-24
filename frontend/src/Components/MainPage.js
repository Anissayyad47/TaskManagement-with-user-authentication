import "./CSS/MainPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const [project,setProject]=useState()
    const [userName,setUsername]=useState(" ");
    const [projectTitle, setProjectTitle] = useState("");
    const [msg, setMsg] = useState("");
    const [projects, setProjects] = useState([]);
    const [getTask,setGetTask]=useState([]);
    const [createTask,setCreateTask]=useState()
    const userId = localStorage.getItem("userId"); // 🔥 Get logged-in user ID
    const [selectProject,setSelectProject]=useState({project_title:""});
    const navigate = useNavigate();

    const [createPorjectPopup,setCreateProjectPupUp]=useState(false);

    useEffect(()=> {
        if (!userId) {
            alert("User not logged in")
            return;
        }
        async function fetchUserName(){
            try{
                const response=await axios.get(`http://localhost:5000/userName/${userId}`)
                setUsername(response.data.display_name);
                console.log("user Name is : "+response.data.display_name);
            } catch (error){
                console.error("Error fetching UserName:", error);
            }
        }
        fetchUserName();
    },[userId])

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

    function handleOnChange(e) {
        setProjectTitle(e.target.value);  // Get the value from input
    }

    useEffect(() => {
        if (!selectProject._id) {
            console.log("Project not cerated yet");
            return;
        }
        async function fetchProjects() {
            try {
                const response = await axios.get(`http://localhost:5000/tasks/${selectProject._id}`);
                setGetTask(response.data); // 🔥 Store projects in state
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        }
        fetchProjects();
    }, [selectProject._id]);

    
    async function handleSubmit() {
        console.log("Title sent: " + projectTitle);
        try {
            const response = await axios.post("http://localhost:5000/createProject", { userId,project_title:projectTitle });
            setMsg(response.data.message);  // Store response message
            console.log("Response:", response.data.message);
            alert("Project Created Successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error:", error);
            setMsg("Failed to create project");
        }
    }
    function handleSelect(e){
        setSelectProject(e);
        console.log("Select is working");
        console.log(selectProject)
    }
    async function handleAddTask(projectId){
        try {
            const response=await axios.post("http://localhost:5000/createTask",{projectId,title:createTask})
            console.log(response.data.message);
            alert("Task Created Successfully!");
        } catch (error){
            console.error("Error:", error);
            setMsg("Failed to create project");
        }
    }
    // create Project *****************************
    async function handleCreateProject() {
        if (projectTitle === "") { 
            alert("Enter project name"); 
            return; // Stop execution if no project name is entered
        }
        
        try {
            const response = await axios.post("http://localhost:5000/createProject", { 
                userId, 
                project_title: projectTitle 
            });
    
            setMsg(response.data.message);  // Store response message
            localStorage.setItem("projectId", response.data.projectId);
            localStorage.setItem("projectTitle", response.data.project_title);
            alert("Project Created Successfully!");
            
            setCreateProjectPupUp(false);
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
    }

    
    
    return (
        <>
        <div className="MainPage">
            <NavBar></NavBar>
            <div className="MainPage-in">
                <div className="welcome-contaner">
                    <h1>Hi! {userName}</h1>
                    <h2>Welcome to our webiste here you can create your projects and task</h2>
                </div>
                    <button className="create-project-container" onClick={()=> setCreateProjectPupUp(true)}>Create project</button>
            </div>
        {/* <div className="navigation-bar-container">
        <h1>welcome back " {userName.display_name} " </h1>
        </div>
        <div className="MainPage-in">
            <div className="MaingPage-mid">
            <div className="project-container">
                <div className="projects">
                    <div className="project-create">
                    <p>Your Projects</p>
                    <button onClick={()=> setCreateProjectPupUp(true)}>Create Project</button>
                    </div>
                    <div className="project-display">
                        <p>Display Project</p>
                        {projects.length===0 ? (
                             <p>No projects found</p>
                        ) : (
                            <h1></h1>
                        )}
                    </div>l
                </div>
                <h1>Add Project Title</h1>
                <input
                    type="text"
                    placeholder="Title"
                    value={projectTitle}
                    onChange={handleOnChange}
                />
                <button onClick={handleSubmit}>Submit Title</button>
                <h2>Response: {msg}</h2>
            </div>

            <div>
            <h1>Your Projects</h1>
            {projects.length === 0 ? (
                <p>No projects found</p>
            ) : (
                <ul>
                    {projects.map((project) => (
                        <li key={project._id}>
                        {project.project_title}
                        <button onClick={() => handleSelect(project)}>Select</button>
                        </li>
))}
                </ul>
            )}
                <h1>Current project is : " {selectProject.project_title} "</h1>
                <input type="text" placeholder="enter task" onChange={(e)=> setCreateTask(e.target.value)}></input><button onClick={()=> handleAddTask(selectProject._id)}>add</button>
                <br></br>
                <h2>Your Tasks</h2>
                {getTask.length===0 ?(
                    <p>No Task Found yet</p>
                ): (
                    getTask.map((task) => (
                        <h3>{task.title}</h3>
                    ))
                )}
        </div>
            </div>
        
        </div> */}
        </div>
        {createPorjectPopup && (
            <div className="project-create-popup-overlay">
            <div className="project-create-popup">
                    <input type="text" placeholder="Project Title" onChange={(e)=> setProjectTitle(e.target.value)}></input>
                    <div className="project-create-popup-button">
                        <button onClick={handleCreateProject}>Create</button>
                        <button onClick={()=> setCreateProjectPupUp(false)}>Cancel</button>
                    </div>
            </div>
            </div>
        )}
        
       
        </>
    );
}
