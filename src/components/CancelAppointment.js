import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'; // Firestore imports
import { db } from '../config/FirebaseConfig'; // Your Firebase config file

const CancelAppointment = () => {
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [consultantList, setConsultantList] = useState([]);
  const [loadingConsultants, setLoadingConsultants] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Fetch consultants from Firestore
  useEffect(() => {
    const fetchConsultants = async () => {
      setLoadingConsultants(true);
      try {
        const consultantCollection = collection(db, 'consultants');
        const consultantSnapshot = await getDocs(consultantCollection);
        const consultants = consultantSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConsultantList(consultants);
      } catch (error) {
        console.error('Error fetching consultants:', error);
      } finally {
        setLoadingConsultants(false);
      }
    };

    fetchConsultants();
  }, []);

  // Fetch all bookings for the selected consultant
  const fetchBookingsForConsultant = async (consultantName) => {
    setLoadingAppointments(true);
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingsQuery = query(
        bookingsCollection,
        where('consultantName', '==', consultantName)
      );
      const bookingSnapshot = await getDocs(bookingsQuery);
      const bookings = bookingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleConsultantChange = (e) => {
    const selectedName = e.target.value;
    setSelectedConsultant(selectedName);
    if (selectedName) {
      fetchBookingsForConsultant(selectedName);
    } else {
      setAppointments([]);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (appointmentId) {
      try {
        // Delete from Firestore
        const appointmentRef = doc(db, 'bookings', appointmentId);
        await deleteDoc(appointmentRef);
        console.log(`Cancelled appointment with ID: ${appointmentId}`);

        // Remove the appointment from the local state (UI)
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== appointmentId)
        );
      } catch (error) {
        console.error('Error canceling appointment:', error);
      }
    }
  };

  return (
    <div className="cancel-appointment-container">
      <h1>Cancel Appointment</h1>

      {loadingConsultants ? (
        <p>Loading consultants...</p>
      ) : (
        <div className="consultant-dropdown">
          <label>Select Consultant:</label>
          <select
            value={selectedConsultant}
            onChange={handleConsultantChange}
          >
            <option value="">Select Consultant</option>
            {consultantList.map((consultant) => (
              <option key={consultant.id} value={consultant.name}>
                {consultant.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingAppointments ? (
        <p>Loading appointments...</p>
      ) : appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <p>
              Appointment on{' '}
              {new Date(appointment.appointmentDate).toLocaleString()}
            </p>
            <button
              className="cancel-button"
              onClick={() => handleCancel(appointment.id)}
            >
              Cancel Appointment
            </button>
          </div>
        ))
      ) : (
        selectedConsultant && <p>No appointments found for this consultant.</p>
      )}

<style>
  {`
    .cancel-appointment-container {
      padding: 30px;
      max-width: 1500px;
      min-width:500px;
      margin-top: 50px;
          margin-left: 400px;
          margin-right: 350px;
          margin-bottom: 0;
      /* margin: 140px auto; */
      background: linear-gradient(135deg,#d9f8fa ,#24849c);
      border-radius: 20px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    h1 {
      font-size: 32px;
      color: #003366;
      margin-bottom: 25px;
      font-weight: bold;
    }

    .consultant-dropdown {
      margin-bottom: 25px;
      text-align: left;
    }

    .consultant-dropdown label {
      display: block;
      font-size: 18px;
      color: #005580;
      margin-bottom: 10px;
      font-weight: bold;
    }

    select {
      width: 100%;
      padding: 12px 15px;
      font-size: 16px;
      border-radius: 8px;
      border: 2px solid #007acc;
      background-color: #ffffff;
      color: #003366;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: border-color 0.3s ease;
    }

    select:focus {
      border-color: #005580;
      outline: none;
    }

    .appointment-card {
      padding: 20px;
      margin-bottom: 15px;
      background-color: #ffffff;
      border-left: 5px solid #007acc;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: fadeIn 0.5s ease-in-out;
    }

    .appointment-card p {
      font-size: 16px;
      color: #003366;
      margin: 0;
      flex-grow: 1;
      text-align: left;
    }

    .cancel-button {
      background-color: #ff4f4f;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .cancel-button:hover {
      background-color: #e63939;
      transform: scale(1.05);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .cancel-button:active {
      background-color: #cc3333;
      transform: scale(0.95);
    }

    p {
      font-size: 18px;
      color: #5c0725;
      margin-top: 20px;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}
</style>

    </div>
  );
};

export default CancelAppointment;
