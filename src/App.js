import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import { Link, Outlet } from 'react-router-dom';
import Cookies from "js-cookie";

import Landingpage from "./landingpage/landingpage";
import DoctorLogin from "./landingpage/DoctorLogin";
import Globalnavbar from "./doctor/globalnavbar";
import Dailyappointments from "./doctor/PatientVisit/Patient";
import Bookappointment from "./doctor/ManagementAppointment/Book";
import Rescheduleappointment from "./doctor/ManagementAppointment/DoctorReschedule";
import Cancelappointment from "./doctor/ManagementAppointment/DoctorCancel";
import Changepassword from "./doctor/changepassword";
import PatientDiary from "./doctor/diary/Diary";
import Patientlabrecords from "./doctor/patientlabrecords";
import ViewLabReports from "./doctor/viewlabRecord";
import LabUpload from "./doctor/labupload";
import LabHistory from "./doctor/labuploadhistory";
import ViewFutureAppointment from "./doctor/PatientVisit/View_list";
import AddPrescription from "./doctor/PatientVisit/Prescription";
import Approval from "./doctor/approval";
import ConsultantBooking from "./components/booking";
import BookingHistory from "./components/History";
import ConsultantPayments from "./components/Payment";
import ConsultantList from "./components/ConsultantList";
import ConsultantPaymentHistory from "./components/PaymentHistory";
import AddConsultant from "./components/AddConsultant";
import RescheduleConsultant from "./components/RescheduleConsultant";
import CancelConsultantAppointment from "./components/CancelAppointment";
import './doctor/sidenav.css';

function App() {
  const [isConsultantVisible, setIsConsultantVisible] = useState(false);  // Control consultant dropdown visibility
  const [isManageAppointment, setIsManageAppointment] = useState(false);
  const [isPatientVisit, setIsPatientVisit] = useState(false);
  const [isLabVisible, setIsLabVisible] = useState(false);  // Control lab dropdown visibility
  const [isProfileSettings, setIsProfileSettings] = useState(false);  // Control lab dropdown visibility
  const [isConsultantprofileVisible, setIsConsultantprofileVisible] = useState(false);  // Control consultant dropdown visibility

  const [isConsultantAppointment, setIsConsultantAppointment] = useState(false);  // Control consultant dropdown visibility

  const [isConsultantPaymentHistory, setIsConsultantPaymentHistory] = useState(false);  // Control consultant dropdown visibility

// Toggle Consultant div visibility
const toggleConsultantVisibility = () => {
  setIsConsultantVisible(prevState => !prevState);  // Toggle visibility state
};

const toggleConsultantprofileVisible = () => {
  setIsConsultantprofileVisible(prevState => !prevState);  // Toggle visibility state
};

const toggleConsultantAppointment = () => {
  setIsConsultantAppointment(prevState => !prevState);  // Toggle visibility state
};

const toggleConsultantPaymentHistory = () => {
  setIsConsultantPaymentHistory(prevState => !prevState);  // Toggle visibility state
};
const toggleManageAppointment = () => {
  setIsManageAppointment(prevState => !prevState);  // Toggle visibility state
};
const togglePatientVisit = () => {
  setIsPatientVisit(prevState => !prevState);  // Toggle visibility state
};
const toggleLabVisibility = () => {
  setIsLabVisible(prevState => !prevState);  // Toggle visibility state
};
const toggleProfileSettings = () => {
  setIsProfileSettings(prevState => !prevState);  // Toggle visibility state
};

  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const COOKIE_KEY = "session_expiration";
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Handles Login
  const handleLogin = () => {
    const expirationTime = new Date().getTime() + SESSION_TIMEOUT;
    Cookies.set(COOKIE_KEY, expirationTime, { expires: new Date(expirationTime) });
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Handles Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    Cookies.remove(COOKIE_KEY);
    localStorage.removeItem("isAuthenticated");
  };

  // Checks Session Expiration
  useEffect(() => {
    const savedExpiration = Cookies.get(COOKIE_KEY);
    const savedAuthState = localStorage.getItem("isAuthenticated") === "true";
    const currentTime = new Date().getTime();

    if (savedExpiration && savedAuthState) {
      if (currentTime > savedExpiration) {
        handleLogout();
      } else {
        setIsAuthenticated(true);
      }
    } else {
      handleLogout();
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  return (
    <Router>
      {isAuthenticated && <Globalnavbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/doctorlogin/dailyappointments" replace /> : <Landingpage />} />
        <Route path="/authenticate" element={!isAuthenticated ? <DoctorLogin onLogin={handleLogin} /> : <Navigate to="/doctorlogin/dailyappointments" />} />

        {isAuthenticated && (
          <Route path="/doctorlogin" element={<DoctorDashboardLayout />}>
            <Route path="dailyappointments" element={<Dailyappointments />} />
            <Route path="BookAppointment" element={<Bookappointment />} />
            <Route path="RescheduleAppointment" element={<Rescheduleappointment />} />
            <Route path="CancelAppointment" element={<Cancelappointment />} />
            <Route path="changepassword" element={<Changepassword />} />
            <Route path="diary" element={<PatientDiary />} />
            <Route path="patientlab" element={<Patientlabrecords />} />
            <Route path="viewLabReports" element={<ViewLabReports />} />
            <Route path="labUpload" element={<LabUpload />} />
            <Route path="labUploadHistory" element={<LabHistory />} />
            <Route path="approval" element={<Approval />} />
            <Route path="consultantBookAppointment" element={<ConsultantBooking />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="consultantpayment" element={<ConsultantPayments />} />
            <Route path="consultantpaymenthistory" element={<ConsultantPaymentHistory />} />
            <Route path="consultantList" element={<ConsultantList />} />
            <Route path="AddConsultant" element={<AddConsultant />} />
            <Route path="consultantAppointmentReschedule" element={<RescheduleConsultant />} />
            <Route path="consultantAppointmentCancel" element={<CancelConsultantAppointment />} />
            <Route path="view-Appointments" element={<ViewFutureAppointment />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Layout for Doctor Dashboard with Sidebar
const DoctorDashboardLayout = () => {
  const [isConsultantVisible, setIsConsultantVisible] = useState(false);  // Control consultant dropdown visibility
      const [isManageAppointment, setIsManageAppointment] = useState(false);
      const [isPatientVisit, setIsPatientVisit] = useState(false);
      const [isLabVisible, setIsLabVisible] = useState(false);  // Control lab dropdown visibility
      const [isProfileSettings, setIsProfileSettings] = useState(false);  // Control lab dropdown visibility
      const [isConsultantprofileVisible, setIsConsultantprofileVisible] = useState(false);  // Control consultant dropdown visibility
  
      const [isConsultantAppointment, setIsConsultantAppointment] = useState(false);  // Control consultant dropdown visibility
  
      const [isConsultantPaymentHistory, setIsConsultantPaymentHistory] = useState(false);  // Control consultant dropdown visibility
  
    // Toggle Consultant div visibility
    const toggleConsultantVisibility = () => {
      setIsConsultantVisible(prevState => !prevState);  // Toggle visibility state
    };
  
    const toggleConsultantprofileVisible = () => {
      setIsConsultantprofileVisible(prevState => !prevState);  // Toggle visibility state
    };
  
    const toggleConsultantAppointment = () => {
      setIsConsultantAppointment(prevState => !prevState);  // Toggle visibility state
    };
  
    const toggleConsultantPaymentHistory = () => {
      setIsConsultantPaymentHistory(prevState => !prevState);  // Toggle visibility state
    };
    const toggleManageAppointment = () => {
      setIsManageAppointment(prevState => !prevState);  // Toggle visibility state
    };
    const togglePatientVisit = () => {
      setIsPatientVisit(prevState => !prevState);  // Toggle visibility state
    };
    const toggleLabVisibility = () => {
      setIsLabVisible(prevState => !prevState);  // Toggle visibility state
    };
    const toggleProfileSettings = () => {
      setIsProfileSettings(prevState => !prevState);  // Toggle visibility state
    };
  
    return (
      <div className="side-navbar-container">
        <div className="side-navbar">
          <a onClick={toggleManageAppointment} style={{ color: '#fff' }}>
              Manage Appointment
          </a>
          {/* <Link to="/doctorlogin/dailyappointments">View Appointment</Link> */}
              {/* Show the consultant options based on isConsultantVisible state */}
              {isManageAppointment && (
                <div className="options">
                  <Link to="/doctorlogin/dailyappointments">View Appointment</Link>
                  <Link to="/doctorlogin/BookAppointment">Book Appointment</Link> 
                  <Link to="/doctorlogin/RescheduleAppointment">Reschedule Appointment</Link>
                  <Link to="/doctorlogin/CancelAppointment">Cancel Appointment</Link>
                  
                  
                 </div> 
               )} 
  {/*          <a onClick={togglePatientVisit} style={{ color: '#fff' }}>
            Patient Visit
          </a>  */}
  
            {/* Show the consultant options based on isConsultantVisible state */}
            {/* {isPatientVisit && ( 
                <div className="options"> 
                 <Link to="/doctorlogin/view&editpatient">View Patient</Link> 
                <Link to="/doctorlogin/addprescription">Add Prescription</Link>
              </div> 
              )}  */}
            
            
  
            {/* Toggle Consultant dropdown */}
            <a onClick={toggleConsultantVisibility} style={{ color: '#fff' }}>
              Consultant
            </a>
  
            {/* Show the consultant options based on isConsultantVisible state */}
            {isConsultantVisible  && (
              <div className="options">
                    <a onClick={toggleConsultantprofileVisible} style={{ color: '#fff' }}>
                      Consultant Management
                    </a>
  
                {/* Show the consultant options based on isConsultantVisible state */}
                {isConsultantprofileVisible && (
                  <div className="options" style={{paddingLeft:'25px'}}>
                    <Link to="/doctorlogin/consultantlist">View</Link>
                    <Link to="/doctorlogin/AddConsultant">Add</Link>
                  </div>
                )}
                <a onClick={toggleConsultantAppointment} style={{ color: '#fff' }}>
                  Consultant Appointment
                </a> 
  
                {/* Show the consultant options based on isConsultantVisible state */}
                {isConsultantAppointment && (
                  <div className="options" style={{paddingLeft:'25px'}}>
                    <Link to="/doctorlogin/consultantBookAppointment">Book Appointment</Link>
                    <Link to="/doctorlogin/consultantAppointmentReschedule">Reschedule</Link>
                    <Link to="/doctorlogin/consultantAppointmentCancel">Cancel</Link>
                  </div>
                )}
                <a onClick={toggleConsultantPaymentHistory} style={{ color: '#fff' }}>
                  Consultant Payment
                </a>
  
                {/* Show the consultant options based on isConsultantVisible state */}
                {isConsultantPaymentHistory && (
                  <div className="options" style={{paddingLeft:'25px'}}>
                    <Link to="/doctorlogin/consultantpayment">Payment</Link>
                    <Link to="/doctorlogin/consultantpaymenthistory">Payment History</Link>
                  </div>
                )}
              </div>
            )}
            <a onClick={toggleLabVisibility} style={{ color: '#fff' }}>
              Lab Management
            </a>
            {isLabVisible && (
              <div className="options" style={{paddingLeft:'25px'}}>
                  <Link to="/doctorlogin/viewLabReports">View Lab Reports</Link> 
                  <Link to="/doctorlogin/patientlab">Add Lab Records</Link>
                  <Link to="/doctorlogin/labUpload">Invoice Upload</Link>
                  <Link to="/doctorlogin/labUploadHistory">Invoice History</Link>
              </div>
            )}
            <Link to="/doctorlogin/diary">Diary</Link>
            
            {/* <Link to="/doctorlogin/approval">Approval</Link> */}
            <a onClick={toggleProfileSettings} style={{ color: '#fff' }}>
              Settings
            </a>
            {isProfileSettings && (
              <div className="options" style={{paddingLeft:'25px'}}>
                  
                  <Link to="/doctorlogin/changepassword">Change Password</Link>
                  
              </div>
              
            )}
            <div style={{margin:'10px',paddingTop:'110px'}}></div>
        </div>
        <Outlet />
      </div>
  );
};

export default App;
