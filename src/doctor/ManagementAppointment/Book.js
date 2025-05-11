import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Book.css";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import moment from "moment-timezone";

const Book = () => {
  const [date, setDate] = useState(new Date());
  const [slotData, setSlotData] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const allSlots = [
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00"
  ];

  const generateAppointmentId = (length = 20) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const formattedDate = moment(date)
          .tz("Asia/Kolkata")
          .format("YYYY_MM_DD");
        const appointmentsQuery = query(
          collection(db, "Patient Appointments"),
          where("appointment_date", "==", formattedDate)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const bookedSlots = appointmentsSnapshot.docs.map((doc) => ({
          slot_start_time: doc.data().slot_start_time,
          slot_no: doc.data().slot_no,
          patient_name: doc.data().patient_name,
        }));
        setSlotData(bookedSlots);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [date]);

  const remainingSlots = allSlots.filter((slot) => {
    const currentTime = moment().tz("Asia/Kolkata");
    const selectedDate = moment(date).tz("Asia/Kolkata");
    const slotTime = moment(slot, "HH:mm").tz("Asia/Kolkata");

    // Exclude booked slots
    if (slotData.some((s) => s.slot_start_time === slot)) return false;

    // Exclude past slots for today
    if (selectedDate.isSame(currentTime, "day") && slotTime.isBefore(currentTime)) {
      return false;
    }

    return true;
  });

  const handleSlotSelection = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSlotBooking = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot before submitting.");
      return;
    }

    try {
      const appointmentDate = moment(date).tz("Asia/Kolkata").format("YYYY_MM_DD");
      const patientName = "Dr. Nithya";
      const reason = "Booked by doctor";
      const docId = "wLD2iYoIPIY70WSJfhLl";
      const gender = "Female";
      const bookingTimestamp = moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD_HH_mm_ss.ss");

      for (const slot of selectedSlots) {
        const appointmentId = generateAppointmentId();
        const slotStartTime = slot;
        const slotEndTime = moment(slot, "HH:mm").add(30, "minutes").format("HH:mm");
        const patientAccountId = generateAppointmentId();
        const patientId = generateAppointmentId();

        const slotNo = allSlots.indexOf(slotStartTime) + 1;

        await addDoc(collection(db, "Patient Appointments"), {
          appointment_date: appointmentDate,
          slot_start_time: slotStartTime,
          slot_end_time: slotEndTime,
          slot_no: slotNo,
          appointment_id: appointmentId,
          patient_name: patientName,
          reason_for_visit: reason,
          appointment_no: 0,
          doc_id: docId,
          gender: gender,
          booking_time_stamp: bookingTimestamp,
          is_nursing: false,
          is_pregnant: false,
          is_taking_birth_control_pills: false,
          patient_account_id: patientAccountId,
          patient_id: patientId,
          patient_dental_history: ["NA", "NA"],
        });
      }

      alert("Selected slots booked successfully!");
      setSlotData((prev) => [
        ...prev,
        ...selectedSlots.map((slot) => ({
          slot_start_time: slot,
          slot_no: allSlots.indexOf(slot) + 1,
          patient_name: patientName,
        })),
      ]);
      setSelectedSlots([]);
    } catch (error) {
      console.error("Error booking slots:", error);
      alert("Failed to book the slots. Please try again later.");
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book an Appointment</h2>

      <div className="calendar-container">
        <Calendar onChange={setDate} value={date} minDate={new Date()} />
      </div>

      <div className="slots-container">
        <h3>Available Slots</h3>
        <div className="slots">
          {remainingSlots.length > 0 ? (
            remainingSlots.map((slot, index) => (
              <button
                key={index}
                className={`slot ${selectedSlots.includes(slot) ? "selected" : ""}`}
                onClick={() => handleSlotSelection(slot)}
              >
                {slot}
              </button>
            ))
          ) : (
            <p style={{ marginLeft: "270px", width: "250px" }}>No available slots for this date.</p>
          )}
        </div>
      </div>

      {remainingSlots.length > 0 && selectedSlots.length > 0 && (
        <div className="submit-container">
          <button className="submit-btn" onClick={handleSlotBooking}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Book;
