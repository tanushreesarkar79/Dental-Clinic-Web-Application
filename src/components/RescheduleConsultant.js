import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, updateDoc, doc } from 'firebase/firestore';
import { db} from '../config/FirebaseConfig'; // Adjust this to your Firebase config file path
import './RescheduleConsultant.css'; // Importing the CSS file

const RescheduleConsultant = () => {
    const [consultants, setConsultants] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
    const [minDateTime, setMinDateTime] = useState('');

    // Function to fetch consultant names from the consultants collection
    const fetchConsultants = async () => {
        try {
            const consultantsRef = collection(db, 'consultants');
            const q = query(consultantsRef);
            const querySnapshot = await getDocs(q);
            const consultantNamesList = [];

            querySnapshot.docs.forEach((doc) => {
                const consultantName = doc.data().name;
                if (consultantName) {
                    consultantNamesList.push(consultantName);
                }
            });

            setConsultants(consultantNamesList);
        } catch (error) {
            console.error('Error fetching consultants:', error);
            setError('Failed to fetch consultants. Please try again.');
        }
    };

    // Function to fetch bookings based on consultant name
    const fetchAppointments = async (consultantName) => {
        setLoading(true);
        setError(null);
        try {
            const bookingsRef = collection(db, 'bookings');
            const q = query(bookingsRef, where('consultantName', '==', consultantName)); 
            const querySnapshot = await getDocs(q);

            const appointmentsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setAppointments(appointmentsList);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Failed to fetch appointments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle dropdown selection change
    const handleConsultantChange = (e) => {
        const consultantName = e.target.value;
        setSelectedConsultant(consultantName);

        if (consultantName) {
            fetchAppointments(consultantName);
        } else {
            setAppointments([]);
        }
    };

    // Handle reschedule button click
    const handleRescheduleClick = (appointment) => {
        setAppointmentToReschedule(appointment); // Store the selected appointment
    };

    // Handle Date-Time selection
    const handleDateTimeChange = (e) => {
        setSelectedDateTime(e.target.value);
    };

    // Update the appointment in Firestore
    const handleRescheduleSubmit = async () => {
        if (!selectedDateTime || !appointmentToReschedule) {
            setError('Please select a date and time to reschedule.');
            return;
        }

        try {
            const appointmentRef = doc(db, 'bookings', appointmentToReschedule.id); // Get the specific appointment document
            await updateDoc(appointmentRef, { appointmentDate: selectedDateTime }); // Update appointment date

            // Clear the state after successful rescheduling
            setSelectedDateTime('');
            setAppointmentToReschedule(null);
            fetchAppointments(selectedConsultant); // Refresh appointments
            alert('Appointment rescheduled successfully.');
        } catch (error) {
            console.error('Error updating appointment:', error);
            setError('Failed to reschedule appointment. Please try again.');
        }
    };

    // Set min date-time when the component mounts
    useEffect(() => {
        // Get current date and time in the format required for datetime-local
        const now = new Date();
        const minDateTimeString = now.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
        setMinDateTime(minDateTimeString);
        
        fetchConsultants();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Reschedule Consultant</h1>

            <div className="select-container">
                <select
                    id="consultant"
                    value={selectedConsultant}
                    onChange={handleConsultantChange}
                    className="select-dropdown"
                >
                    <option value="">--Select Consultant--</option>
                    {consultants.map((consultant, index) => (
                        <option key={index} value={consultant}>
                            {consultant}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="loading">Loading appointments...</p>}
            {error && <p className="error">{error}</p>}

            {appointments.length === 0 && !loading && !error && selectedConsultant && (
                <p className="no-appointments">No appointments found for this consultant.</p>
            )}

            <ul className="appointments-list">
                {appointments.map((appointment) => (
                    <li key={appointment.id} className="appointment-card">
                        <p><strong>Patient Name:</strong> {appointment.patientName}</p>
                        <p><strong>Appointment Date:</strong> {appointment.appointmentDate}</p>
                        <p><strong>Treatment Details:</strong> {appointment.treatmentDetails}</p>
                        <button
                            className="reschedule-btn"
                            onClick={() => handleRescheduleClick(appointment)}
                        >
                            Reschedule
                        </button>

                        {appointmentToReschedule && appointmentToReschedule.id === appointment.id && (
    <div className="reschedule-section-inline">
        <input
            type="datetime-local"
            value={selectedDateTime}
            min={minDateTime}
            onChange={handleDateTimeChange}
            className="datetime-picker-inline"
        />
        <button
            className="notify-btn-inline"
            onClick={handleRescheduleSubmit}
        >
            Notify
        </button>
    </div>
)}

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RescheduleConsultant;
