import { useState } from 'react';
import axios from 'axios';
import "./CSS/User_Login.css"
import { useNavigate } from "react-router-dom";

export default function User_Login (){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://taskmanagement-with-user-authentication.onrender.com/Login", {
        username,
        password,
      });
      if (response.status === 200) {
        console.log("Login successful", response.data);

        // Store userId in localStorage
        localStorage.setItem("userId", response.data.userId);

        alert("Login Successful! Redirecting...");
        // Redirect to dashboard or another page
    }
      console.log(response.data.userId);
      setMessage(response.data.message);
      // Store the userId after successful login
      // localStorage.setItem('userId');
      // Redirect to TaskList
      // navigate("/TaskList");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  if (message === "Login successful") {
    navigate("/Home");

  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Enter Username" 
            className="input-field" 
            required 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Enter Password" 
            className="input-field" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <p>Don't have an account? 
          <span className="createAcc" onClick={() => navigate("/signup")}>
            Create Account
          </span>
        </p>
        {message && <p className="message">{message}</p>}
      </div>
      <div className='Backend-message'>
  <p>
    If you encounter any errors, please try again after 1–2 minutes. 
    This website is hosted on Render, and the backend may take some time to restart if it was in sleep mode.
  </p>
</div>
    </div>
  );

}
