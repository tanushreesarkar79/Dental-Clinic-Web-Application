import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/FirebaseConfig'; // Ensure this is your Firebase configuration file

const PatientDiary = () => {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fetch Patient Appointments
        const patientsCollection = collection(db, 'Patient Appointments');
        const patientsSnapshot = await getDocs(patientsCollection);
        const patientList = patientsSnapshot.docs.map((doc) => doc.data());

        // Fetch Prescriptions
        const prescriptionsCollection = collection(db, 'Prescription');
        const prescriptionsSnapshot = await getDocs(prescriptionsCollection);
        const prescriptionList = prescriptionsSnapshot.docs.map((doc) => doc.data());

        setPatients(patientList);
        setPrescriptions(prescriptionList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPatientData();
  }, []);

  // Filter appointments based on selected date
  const filteredPatients = patients.filter((patient) => {
    const appointmentDate = patient.appointment_date?.replace(/_/g, '-'); // Replace underscores with hyphens for comparison
    return appointmentDate === selectedDate;
  });

  // Helper to get payment amount and status from prescriptions
  const getPaymentInfo = (patientId) => {
    const prescription = prescriptions.find((presc) => presc.patientId === patientId);
    if (prescription) {
      return {
        amount: prescription.paymentAmount,
        status: prescription.paymentAmount > 0 ? 'Done' : 'Pending',
      };
    }
    return { amount: 'N/A', status: 'Pending' };
  };

  return (
    <div style={{paddingLeft:'80px'}}>
      <h2 className="patient-diaries-header">Today's Diary</h2>

      {/* Calendar Input */}
      <input
        type="date"
        className="date-picker"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {filteredPatients.length > 0 ? (
        <table className="patient-diaries-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Patient ID</th>
              <th>Gender</th>
              <th>Advice</th>
              <th colSpan="2">Payment</th>
              <th>Time Slot</th>
            </tr>
            <tr>
              <th colSpan="4"></th> {/* Empty cells to align sub-columns */}
              <th>Amount</th>
              <th>Status</th>
              <th></th> {/* Empty cell for Time Slot */}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, index) => {
              const paymentInfo = getPaymentInfo(patient.patient_id);
              return (
                <tr key={index} className="patient-basic-info-row">
                  <td>{patient.patient_name}</td>
                  <td>{patient.patient_id}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.reason_for_visit || 'Not available'}</td>
                  <td>{paymentInfo.amount}</td>
                  <td>{paymentInfo.status}</td>
                  <td>{patient.slot_start_time || 'Not available'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h2 className="foot">No Patient Diaries Available</h2>
      )}
    </div>
  );
};

export default PatientDiary;
