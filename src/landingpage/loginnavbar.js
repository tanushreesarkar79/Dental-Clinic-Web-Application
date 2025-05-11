import React from 'react';
import './loginnavbar.css';
import {Link} from 'react-router-dom';
import logo from '../landingpage/images/d.jpg';
const Loginnavbar = () => {
  return(

<div className="login-navbar">
      <div className="login-navbar-left">
        <img src={logo} alt="Clinic Logo" className="login-logo" />
        <span className="login-clinic-name">
          Dr. Nithya's
          <br />
          <div className="login-clinic-name-1">
            Dental & Smile Design Clinic
          </div>
        </span>
      </div>
      <div className="login-navbar-menu">
     
          <div className="login-login-icon">
           <Link to="/"> Home</Link>
          </div> 
       
      
      </div>
    </div>

);
};

export default Loginnavbar;
