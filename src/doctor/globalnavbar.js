import React from 'react';
import {useNavigate} from 'react-router-dom';
import './globalnavbar.css';
import logo from '../landingpage/images/d.jpg';

const Globalnavbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication details (optional)
    // Example: localStorage.removeItem('authToken');
    
    onLogout(); // Call the logout function passed from App
    navigate('/'); // Redirect to the landing page
  };
  return(

<div className="global-navbar">
  <div>
      <div className="global-navbar-left">
        <img src={logo} alt="Clinic Logo" className="global-logo" />
        <span className="global-clinic-name">Dr. Nithya's Dental & Smile Design Clinic</span>
      </div>
      <div className="global-navbar-menu">
     
     <div className="global-login-icon">
     <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
     </div> 
  
 
   </div>
   </div>
   {/* <SideNavbar/> */}
    </div>
);
};

export default Globalnavbar;
