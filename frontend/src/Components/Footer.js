import React from "react";
import "./CSS/Footer.css"; // External CSS file
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a href="https://github.com/Anissayyad47" target="_blank" rel="noopener noreferrer">
          <FaGithub className="icon" />
        </a>
        <a href="https://www.linkedin.com/in/anis-sayyad-4aa710231/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="icon" />
        </a>
        <a href="mailto:sayyadanis356@gmail.com">
          <FaEnvelope className="icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
