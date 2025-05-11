import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DoctorCancel.css";
import { db } from "../../config/FirebaseConfig";

const DoctorCancel = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSlotsData, setBookedSlotsData] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Fetch appointments from Firestore
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, "Patient Appointments");
        const appointmentsQuery = query(appointmentsCollection, orderBy("appointment_date", "desc"));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const appointmentsData = [];
        appointmentsSnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsData.push({ id: doc.id, ...data });
        });

        setBookedSlotsData(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter slots for the selected date and ensure times are >= current time
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA").replace(/-/g, "_");
      const currentTime = new Date();
      
      const selectedData = bookedSlotsData.filter((item) => {
        const appointmentDate = new Date(item.appointment_date.replace(/_/g, "-"));
        const appointmentTime = new Date(
          `${appointmentDate.toDateString()} ${item.slot_start_time}`
        );
        
        return (
          item.appointment_date === formattedDate &&
          appointmentTime >= currentTime
        );
      });

      setBookedSlots(selectedData);
      setSelectedSlots([]);
    }
  }, [selectedDate, bookedSlotsData]);

  // Toggle slot selection
  const handleSlotClick = (slot) => {
    setSelectedSlots((prevSelected) =>
      prevSelected.includes(slot)
        ? prevSelected.filter((s) => s !== slot) // Deselect
        : [...prevSelected, slot]
    );
  };

  // Cancel selected slots
  const handleCancel = async () => {
    if (selectedDate && selectedSlots.length > 0) {
      for (const slot of selectedSlots) {
        const docRef = doc(db, "Patient Appointments", slot.id);
        await deleteDoc(docRef);
      }

      const updatedSlots = bookedSlots.filter(
        (slot) => !selectedSlots.includes(slot)
      );
      setBookedSlots(updatedSlots);
      setSelectedSlots([]);
      alert("Selected appointments have been canceled!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cancel-container">
      <h2>Cancel Appointments</h2>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
        />
      </div>
      {selectedDate && (
        <div className="slots-container">
          <h3>Booked Slots on {selectedDate.toDateString()}</h3>
          {bookedSlots.length > 0 ? (
            <div className="slots">
              {bookedSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`slot ${
                    selectedSlots.includes(slot) ? "selected" : ""
                  }`}
                  onClick={() => handleSlotClick(slot)}
                >
                  {`${slot.slot_start_time} - ${slot.slot_end_time}`}
                  <br />
                  {slot.patient_name}
                  <br />
                  {slot.reason_for_visit}
                </button>
              ))}
            </div>
          ) : (
            <p>No booked slots on this date.</p>
          )}
          {selectedSlots.length > 0 && (
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel Selected Slots
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorCancel;
