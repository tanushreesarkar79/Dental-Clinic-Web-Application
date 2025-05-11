import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/FirebaseConfig'; // Ensure this is your Firebase configuration file

const LabDetails = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchBasicInfo = async () => {
      try {
        const patientsCollection = collection(db, 'Patients Lab Reports');
        const patientsSnapshot = await getDocs(patientsCollection);
        const patientList = patientsSnapshot.docs.map((doc) => doc.data());
        setPatients(patientList);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchBasicInfo();
  }, []);

  return (
    <div style={{paddingLeft:'80px'}}>
      <h2 className="patient-diaries-header">Laboratory Reports</h2>

      {patients.length > 0 ? (
        <table className="patient-diaries-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Lab Advice</th>
              <th>Report Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={index} className="patient-basic-info-row">
                <td>{patient.patientId}</td>
                <td>{patient.patientName}</td>
                <td>{patient.pictureDetails || 'Not available'}</td>
                <td>{patient.pictureName || 'Pending'}</td>
                <td>{patient.uploadTime || 'Not available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2 className="foot">No Laboratory Reports Available</h2>
      )}
    </div>
  );
};

export default LabDetails;
