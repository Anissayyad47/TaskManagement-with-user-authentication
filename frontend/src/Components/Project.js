import { useState,useEffect } from "react";
import "./CSS/Project.css"
import NavBar from "./NavBar";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function Project(){
    const [projectListPopup,setProjectListPopup]=useState(false);
    const [taskUpdated, setTaskUpdated] = useState(false);
    const [editTaskPopup,setEditTaskPopup]=useState(false);
    const [editTaskId,setEditeTaskId]=useState("")
    const [editTaskcontent,setEditTaskContent]=useState("");
    const [taskStatus,setTaskStatus]=useState("");
    const [createTask,setCreateTask]=useState();
    const [selectProject,setSelectProject]=useState({project_title:""});
    const [projects, setProjects] = useState([]);
    const [getTask,setGetTask]=useState([]);
    const [message,setMessage]=useState("");
    const projectId = localStorage.getItem("projectId");
    const projectTitle = localStorage.getItem("projectTitle");
    const userId = localStorage.getItem("userId");

    // create Task
    async function handleAddTask() {
        if (!createTask || !createTask.trim()) { 
            alert("Please enter a task first"); 
            return; 
        }
    
        console.log("Task is: " + createTask);
    
        try {
            const response = await axios.post("https://taskmanagement-with-user-authentication.onrender.com/createTask", { projectId, title: createTask });
    
            setMessage(response.data.message);
            alert("Task Created Successfully!");
            setTaskUpdated(prev => !prev);
    
            // Reset input field after the task is successfully created
            if (response.data.message === "Task Created Successfully") {
                setCreateTask("");
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task. Please try again.");
        }
    }
    

    // Get project List
    useEffect(() => {
        if (!userId) {
            console.log("User not logged in");
            return;
        }
        async function fetchProjects() {
            try {
                const response = await axios.get(`https://taskmanagement-with-user-authentication.onrender.com/projects/${userId}`);
                setProjects(response.data); // 🔥 Store projects in state
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        }
        fetchProjects();
    }, [userId]);

    // get all task
    useEffect(() => {
        if (!projectId) {
            console.log("Project not cerated yet");
            return;
        }
        async function fetchProjects() {
            try {
                const response = await axios.get(`https://taskmanagement-with-user-authentication.onrender.com/tasks/${projectId}`);
                setGetTask(response.data); // 🔥 Store projects in state
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        }
        fetchProjects();
    }, [projectId,taskUpdated]);

    function handleSelectProject(e){
        setSelectProject(e);
        localStorage.setItem("projectId", e._id);
        localStorage.setItem("projectTitle", e.project_title);
    }
    // update Task *************************************
async function handleSlecetTaskStatus(taskId, status) {
    setTaskStatus(status); // ✅ State updates asynchronously

    try {
        const response = await axios.put(`https://taskmanagement-with-user-authentication.onrender.com/tasks/${taskId}/status`, { status });
        console.log("Updated Task:", response.data.task);
        alert("Task updated");
        setTaskUpdated(prev => !prev); // ✅ This will trigger a re-fetch in `useEffect`
    } catch (error) {
        console.error("Error updating task status:", error.response?.data?.error || error.message);
    }
}
    function handleEditeTaskPopup(task){
        setEditTaskPopup(true);
        setEditeTaskId(task)
    }
    // Edite Task ************************************
    async function handleEditeTask(taskId){
        try {
            const response = await axios.put(`https://taskmanagement-with-user-authentication.onrender.com/editeTask/${taskId}`, { title:editTaskcontent });
            console.log("Updated Task:", response.data.task);
            alert("Task Edited");
            setTaskUpdated(prev => !prev); // ✅ This will trigger a re-fetch in `useEffect`
        } catch (error) {
            console.error("Error updating task status:", error.response?.data?.error || error.message);
        }
    }

    async function handleDeleteTask( taskId){
        try {
            await axios.delete(`https://taskmanagement-with-user-authentication.onrender.com/deleteTasks/${taskId}`);
            alert("Task Deleted Successfully");
            
            // ✅ Remove the deleted task from UI without refreshing
            setGetTask(prevTasks => prevTasks.filter(task => task._id !== taskId));
    
        } catch (error) {
            console.error("Error deleting task:", error.response?.data?.error || error.message);
        }
    }
    return(
        <>
        <div className="project-page">
        <NavBar></NavBar>
        <div className="project-page-in">
            <div className="project-page-title">
                <div>
                    <p>Project : {projectTitle}</p>
                    <button onClick={()=> setProjectListPopup(true)}>Switch</button>
                </div>
                <hr className="project-line1"></hr>
            </div>

            <div className="task-management-container">
                <div className="add-task-container">
                <div className="task-management-title"><p>Add, Update, Edite Task</p></div>
                <div className="create-task">
                    <div className="create-task-in">
                        <input 
                            type="text" 
                            placeholder="Add Task" 
                            value={createTask}  // Ensure controlled input
                            onChange={(e) => setCreateTask(e.target.value)}
                        />
                            <button type="button" onClick={handleAddTask}>Add</button>
                    </div>
                </div>

                </div>
                <div className="task-management-container-in">
                    <div className="task-container"><p className="pending">Doing Task</p>
                    <div className="task-container-in">
                        {getTask.map((task)=>(
                            task.status === "Doing" && (
                                                    <div className="task-pending"><p>{task.title}</p><MdEdit id="edit-task" onClick={()=> handleEditeTaskPopup(task._id,task.title)}></MdEdit><MdDelete id="delete-task" onClick={()=> handleDeleteTask(task._id)}></MdDelete>
                                                    <select onChange={(e) => handleSlecetTaskStatus(task._id, e.target.value)}>
                                                    <option>{task.status}</option>
                                                    <option value="Doing" >Doing</option>
                                                    <option value="Later" >Later</option>
                                                    <option value="Completed" >Completed</option>
                                                    </select></div>
                            )
                        ))}
                    </div>
                    </div>
                    <div className="task-container"><p className="completed">Complete Task</p>
                    <div>
                        <div className="task-container-in">
                            {getTask.map((task)=> (
                                task.status ==="Completed" && (
                                                    <div className="task-complete"><p>{task.title}</p><MdEdit id="edit-task" onClick={()=> handleEditeTaskPopup(task)}></MdEdit><MdDelete id="delete-task" onClick={()=> handleDeleteTask(task._id)}></MdDelete>
                                                    <select onChange={(e) => handleSlecetTaskStatus(task._id, e.target.value)}>
                                                    <option>{task.status}</option>
                                                    <option value="Doing" >Doing</option>
                                                    <option value="Later" >Later</option>
                                                    <option value="Completed" >Completed</option>
                                                    </select></div>
                                )
                            ))}
                        </div>
                    </div>
                    </div>
                    <div className="task-container"><p className="cancelled">Doing Later</p>
                    <div>
                    <div className="task-container-in">
                            {getTask.map((task)=> (
                                task.status ==="Later" && (
                                                    <div className="task-later"><p>{task.title}</p><MdEdit id="edit-task" onClick={()=> handleEditeTaskPopup(task)}></MdEdit><MdDelete id="delete-task" onClick={()=> handleDeleteTask(task._id)}></MdDelete>
                                                    <select onChange={(e) => handleSlecetTaskStatus(task._id, e.target.value)}>
                                                    <option>{task.status}</option>
                                                    <option value="Doing" >Doing</option>
                                                    <option value="Later" >Later</option>
                                                    <option value="Completed" >Completed</option>
                                                    </select></div>
                                )
                            ))}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        {projectListPopup && (
            <div className="project-list-popup-overlay">
            <div className="project-list-popup-in">
            <div className="project-list-popup">
                {projects.map((project) => (
                    <div key={project._id}><p>{project.project_title}</p><button onClick={()=> handleSelectProject(project)}>select</button></div>
                ))}
            </div>
            <button className="project-list-popup-button" onClick={()=> setProjectListPopup(false)}>Cancel</button>
            </div>
        </div>
        )}

        {editTaskPopup && (
            <div className="edit-task-container-overlay">
            <div className="edit-task-container">
                <input type="text" placeholder="" onChange={(e)=> setEditTaskContent(e.target.value)}></input>
                <div>
                <button className=" edit-task-container-button-Update-task" onClick={()=> handleEditeTask(editTaskId)}>Update Task</button>
                <button className=" edit-task-container-button-cancel" onClick={()=> setEditTaskPopup(false)}>Cancel</button>
                </div>
            </div>
            </div>
        )}
        
        </>
    )
}
