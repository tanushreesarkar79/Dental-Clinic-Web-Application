import React, { useState } from 'react';
import PatientDiary from './components/PatientDiary';
import LabDetails from './components/LabDetails';
import PaymentDetails from './components/PaymentDetails';
import './App.css';
import './Diary.css';

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleShowComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="App">
      {!activeComponent && (
        <div className="landing-container">
          <h2>Patient Diary</h2>
          <div className="card-container">
            <div className="card">
              <h3>Patients</h3>
              <p>View detailed information about patients.</p>
              <button className="main-button" onClick={() => handleShowComponent('PatientDiary')}>
                View Patients
              </button>
            </div>
            <div className="card">
              <h3>Lab Details</h3>
              <p>Check all laboratory details and reports.</p>
              <button className="main-button" onClick={() => handleShowComponent('LabDetails')}>
                View Lab Details
              </button>
            </div>
            <div className="card">
              <h3>Payment</h3>
              <p>Verify payment status and transactions.</p>
              <button className="main-button" onClick={() => handleShowComponent('PaymentDetails')}>
                View Payments
              </button>
            </div>
          </div>
        </div>
      )}

      {activeComponent === 'PatientDiary' && <PatientDiary />}
      {activeComponent === 'LabDetails' && <LabDetails />}
      {activeComponent === 'PaymentDetails' && <PaymentDetails />}
    </div>
  );
}

export default App;
