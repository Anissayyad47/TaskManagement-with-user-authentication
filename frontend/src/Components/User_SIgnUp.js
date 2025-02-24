import "./CSS/User_SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function User_SignUp(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Name,setName]=useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    if(password!==password2){
      alert("Password Doesn't Match")
        setMessage("Password Doesn't Match")
        return
    }else {
        e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/sign-up", {
        username,
        password,
        Name,
      });
      localStorage.setItem("userId", response.data.userId);

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "An error occurred");
    }
    }
  };

  if(message==="User registered successfully"){
    localStorage.setItem("Username",Name );
    alert("User registered successfully");
    navigate("/Home");

  }

  return (
    <div className="sign-container">
      <div className="sign-box">
        <h2>Sign Up</h2>
        <form className="sign-form" onSubmit={handleSignUp}>
        <input 
            type="text" 
            placeholder="Enter Display Name" 
            className="input-field" 
            required 
            onChange={(e) => setName(e.target.value)} 
          />
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
            <input 
            type="password" 
            placeholder="Conform Password" 
            className="input-field" 
            onChange={(e) => setPassword2(e.target.value)} 
          />
          <button className="sign-button" type="submit">
            Sign In
          </button>
        </form>
        <p>Already have account? 
          <span className="loginAcc" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );

}