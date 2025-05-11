import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/FirebaseConfig"; // Firebase config
import bcrypt from 'bcryptjs'; // Import bcryptjs
 import './login.css'; 

import Loginnavbar from './loginnavbar';

function DoctorLogin({ onLogin }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to fetch and validate login credentials from Firestore
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = query(collection(db, 'Doctor'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let doctorData = null;

        querySnapshot.forEach((doc) => {
          doctorData = doc.data(); // Get the doctor data
        });

        if (doctorData) {
          const passwordMatch = await bcrypt.compare(password, doctorData.password);

          if (passwordMatch) {
            alert('Login Successfully');
            sessionStorage.setItem('Doctor_id', doctorData.Doctor_id);
            onLogin();
            navigate("/doctorlogin/dailyappointments");
          } else {
            alert('Invalid password');
          }
        } else {
          alert('Doctor data not found');
        }
      } else {
        alert('Username does not exist');
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      alert('Error logging in, please try again later. ' + error.message);
    }
  };

  return (
    <div className='login-body'>
      <Loginnavbar />
      <div className="container mt-4 "style={{ backgroundColor: 'transparent',boxShadow:'none' }}>
        <div className="row login-body-container justify-content-center" >
          <div className="col-md-7 col-sm-12" >
            <div className="signup-login-container p-5 rounded" style={{backgroundColor:'whitesmoke', boxShadow:'0px 0px 10px #03C0C1',  marginTop: 0}}>
              <h1 className="text-center mb-4">Doctor</h1>
              <h3 className="text-center mb-4">Log In</h3>

              <div className="login-div">
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Enter Your Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      placeholder="Enter Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                    </span>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary" style={{backgroundColor:'#03C0C1',border:'none',fontSize:'20px'}} onClick={handleLogin}>Log In</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
