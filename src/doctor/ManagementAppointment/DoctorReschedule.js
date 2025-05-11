import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import "./DoctorReschedule.css";
import { db } from "../../config/FirebaseConfig";

const DoctorReschedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotStartTimes, setSlotStartTimes] = useState([]);
  const allSlots = ["10:30", "11:00", "11:30", "12:00", "12:30", "17:00", "17:30", "18:00", "18:30", "19:00","19:30", "20:00"];
  const [newSlot, setNewSlot] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, "Patient Appointments");
        const appointmentsQuery = query(appointmentsCollection, orderBy("booking_time_stamp", "desc"));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const now = new Date();

        const formattedAppointments = appointmentsSnapshot.docs
          .map((doc) => {
            const appointment = doc.data();
            const appointmentDate = new Date(appointment.appointment_date.replace(/_/g, "-"));

            return {
              id: doc.id,
              date: appointmentDate,
              slot_start_time: appointment.slot_start_time,
              slot_end_time: appointment.slot_end_time,
              patient_name: appointment.patient_name,
              reason_for_visit: appointment.reason_for_visit,
            };
          })
          .filter((appointment) => {
            // Filter logic for future appointments
            if (appointment.date > now) {
              return true;
            } else if (
              appointment.date.toDateString() === now.toDateString() &&
              timeToMinutes(appointment.slot_start_time) >= timeToMinutes(now.toTimeString().slice(0, 5))
            ) {
              return true;
            }
            return false;
          });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(new Date());
    setNewSlot(null);
    setAvailableSlots([]);
    setSlotStartTimes([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date) {
      const formattedDate = formatDateString(date);
      const now = new Date();

      const bookedSlotsForDate = appointments
        .filter((appt) => formatDateString(appt.date) === formattedDate)
        .map((appt) => appt.slot_start_time);

      const freeSlots = allSlots.filter((slot) => {
        if (formatDateString(now) === formattedDate) {
          return !bookedSlotsForDate.includes(slot) && timeToMinutes(slot) >= timeToMinutes(now.toTimeString().slice(0, 5));
        }
        return !bookedSlotsForDate.includes(slot);
      });

      setAvailableSlots(freeSlots);

      const selectedDateAppointments = appointments.filter(
        (appt) => formatDateString(appt.date) === formattedDate
      );

      setSlotStartTimes(selectedDateAppointments.map((appt) => appt.slot_start_time));
      setNewSlot(null);
    }
  };

  const handleSlotSelect = (slot) => {
    setNewSlot(slot);
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !newSlot || !selectedDate) {
      alert("Please select an appointment, a date, and a slot!");
      return;
    }

    const selectedSlotIndex = allSlots.indexOf(newSlot);
    const slotNumber = selectedSlotIndex + 1;
    const endSlotIndex = selectedSlotIndex + 1;
    const newSlotEndTime = allSlots[endSlotIndex] || newSlot;

    const updatedAppointment = {
      ...selectedAppointment,
      appointment_date: formatDateString(selectedDate),
      slot_start_time: newSlot,
      slot_end_time: newSlotEndTime,
      slot_no: slotNumber,
    };

    try {
      const appointmentDocRef = doc(db, "Patient Appointments", selectedAppointment.id);
      console.log("Updating document:", appointmentDocRef.path, updatedAppointment);

      await updateDoc(appointmentDocRef, updatedAppointment);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === selectedAppointment.id ? updatedAppointment : appt
        )
      );

      alert(`Appointment rescheduled to ${selectedDate.toDateString()} from ${newSlot} to ${newSlotEndTime}`);
      setSelectedAppointment(null);
      setSelectedDate(new Date());
      setNewSlot(null);
    } catch (error) {
      console.error("Error updating appointment:", error.message);
      alert(`Failed to update appointment: ${error.message}`);
    }
  };

  function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}_${month}_${day}`;
  }

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const now = new Date();

  const todayAppointments = appointments.filter(
    (appt) =>
      formatDateString(appt.date) === formatDateString(now) &&
      timeToMinutes(appt.slot_start_time) >= timeToMinutes(now.toTimeString().slice(0, 5))
  );

  const upcomingAppointments = appointments.filter((appt) => appt.date > now);

  return (
    <div className="reschedule-container">
      <h2>Reschedule Appointments</h2>

      <div className="appointments-list">
        <h3>Today's Appointments</h3>
        <div className="appointments-grid">
          {todayAppointments.map((appointment) => (
            <button
              key={appointment.id}
              className={`appointment ${selectedAppointment?.id === appointment.id ? "selected" : ""}`}
              onClick={() => handleAppointmentSelect(appointment)}
            >
              {`${appointment.patient_name} | ${appointment.reason_for_visit} | ${appointment.slot_start_time} - ${appointment.slot_end_time} | ${appointment.date.toDateString()}`}
            </button>
          ))}
        </div>
      </div>

      <div className="appointments-list">
        <h3>Upcoming Appointments</h3>
        <div className="appointments-grid">
          {upcomingAppointments.map((appointment) => (
            <button
              key={appointment.id}
              className={`appointment ${selectedAppointment?.id === appointment.id ? "selected" : ""}`}
              onClick={() => handleAppointmentSelect(appointment)}
            >
              {`${appointment.patient_name} | ${appointment.reason_for_visit} | ${appointment.slot_start_time} - ${appointment.slot_end_time} | ${appointment.date.toDateString()}`}
            </button>
          ))}
        </div>
      </div>

      {selectedAppointment && (
        <>
          <h3>Select New Date</h3>
          <div className="calendar-container">
            <Calendar onChange={handleDateChange} value={selectedDate} minDate={new Date()} />
          </div>
        </>
      )}

      {selectedDate && (
        <div className="slots-container">
          <h3>Available Slots on {selectedDate.toDateString()}</h3>
          {availableSlots.length > 0 ? (
            <div className="slots">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  className={`slot ${newSlot === slot ? "selected" : ""}`}
                  onClick={() => handleSlotSelect(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p>No slots available for this date.</p>
          )}
        </div>
      )}

      {newSlot && (
        <button
          className="submit-btn"
          onClick={handleReschedule}
          disabled={!selectedAppointment || !newSlot || !selectedDate}
        >
          Confirm Reschedule
        </button>
      )}
    </div>
  );
};

export default DoctorReschedule;
