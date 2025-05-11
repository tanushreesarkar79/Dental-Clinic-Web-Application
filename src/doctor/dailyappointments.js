import React, { useState, useEffect } from "react";
import "./dailyappointments.css";

const patients = [
  {
    time: "10:30",
    name: "Abdul",
    age: 25,
    problem: "Bleeding gums",
    gender: "Male",
    patientId: 1,
    dob: "05 May 1999",
    extra_illness: false,
    on_medication: true,
    blood_transfusion: false,
    allergy: "None",
    blood_transfusion_date: "",
  },
  {
    time: "11:00",
    name: "Ahmed",
    age: 22,
    problem: "Bad Breath",
    gender: "Male",
    patientId: 2,
    dob: "01 August 2002",
    extra_illness: false,
    on_medication: true,
    blood_transfusion: false,
    allergy: "Ice",
  },
  {
    time: "11:30",
    name: "Krishna",
    age: 28,
    problem: "Jaw Pain",
    gender: "Male",
    patientId: 3,
    dob: "28 July 1996",
    extra_illness: false,
    on_medication: false,
    blood_transfusion: true,
    allergy: "None",
    blood_transfusion_date: "02/09/2024",
  },
  {
    time: "12:00",
    name: "Radha",
    age: 26,
    problem: "Sensitivity when biting",
    gender: "Female",
    patientId: 4,
    dob: "25 September 1997",
    extra_illness: true,
    on_medication: true,
    blood_transfusion: false,
    allergy: "None",
  },
  {
    time: "12:30",
    name: "Shahjahan",
    age: 24,
    problem: "Grinding teeth",
    gender: "Male",
    patientId: 5,
    dob: "15 February 2000",
    extra_illness: true,
    on_medication: false,
    blood_transfusion: true,
    allergy: "None",
  },
  {
    time: "5:00",
    name: "Mumtaz",
    age: 27,
    problem: "Periodontal problem",
    gender: "Female",
    patientId: 6,
    dob: "22 December 1996",
    extra_illness: true,
    on_medication: true,
    blood_transfusion: false,
    allergy: "None",
  },
  {
    time: "5:30",
    name: "Arjith Singh",
    age: 37,
    problem: "Sores",
    gender: "Male",
    patientId: 7,
    dob: "25 May 1986",
    extra_illness: false,
    on_medication: false,
    blood_transfusion: true,
    allergy: "None",
  },
  {
    time: "6:00",
    name: "Harini",
    age: 21,
    problem: "Gum/Tooth Pain",
    gender: "Female",
    patientId: 8,
    dob: "31 January 2003",
    extra_illness: false,
    on_medication: false,
    blood_transfusion: false,
    allergy: "None",
  },
  {
    time: "6:30",
    name: "Hema",
    age: 22,
    problem: "Food collection between teeth and bleeding gums",
    gender: "Female",
    patientId: 9,
    dob: "28 February 2002",
    extra_illness: true,
    on_medication: false,
    blood_transfusion: true,
    allergy: "None",
  },
];

const yesterdayPatients = [
  {
    time: "10:30",
    name: "Wafiq",
    age: 25,
    problem: "Tooth Extraction",
    gender: "Male",
    patientId: 10,
    dob: "05 May 1999",
    extra_illness: false,
    on_medication: true,
    blood_transfusion: false,
    allergy: "None",
  },
  {
    time: "11:00",
    name: "Sara",
    age: 22,
    problem: "Cavity",
    gender: "Female",
    patientId: 11,
    dob: "05 May 1999",
    extra_illness: false,
    on_medication: true,
    blood_transfusion: false,
    allergy: "None",
  },
  {
    time: "11:30",
    name: "Raj",
    age: 28,
    problem: "Gum Disease",
    gender: "Male",
    patientId: 12,
    dob: "1 June 1996",
    extra_illness: true,
    on_medication: false,
    blood_transfusion: false,
    allergy: "latex",
  },
];

const PatientCard = ({ patient, isExpanded, onClick }) => {
  return (
    <div className={`card ${isExpanded ? "expanded" : ""}`}>
      <div className="time">{patient.time}</div>
      <table className="dailyappointments-table">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{patient.name}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{patient.age}</td>
          </tr>
          <tr>
            <td>Problem</td>
            <td>{patient.problem}</td>
          </tr>
          {isExpanded && (
            <>
              <tr>
                <td>Gender</td>
                <td>{patient.gender}</td>
              </tr>
              <tr>
                <td>Patient Id</td>
                <td>{patient.patientId}</td>
              </tr>
              <tr>
                <td>DOB</td>
                <td>{patient.dob}</td>
              </tr>
              <tr>
                <td>Extra Illness</td>
                <td>{patient.extra_illness ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>On Medication</td>
                <td>{patient.on_medication ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Blood Transfusion</td>
                <td>{patient.blood_transfusion ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td>Allergy</td>
                <td>{patient.allergy}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <div className="button-container">
        <button onClick={onClick}>{isExpanded ? "Back" : "Details"}</button>
      </div>
    </div>
  );
};

function Dailyappointments() {
  const [selectedDate, setSelectedDate] = useState("today");
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpandCard = (patientId) => {
    setExpandedCard(patientId === expandedCard ? null : patientId);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setExpandedCard(null); // Collapse all cards when changing filter
  };

  const getFilteredPatients = () => {
    switch (selectedDate) {
      case "yesterday":
        return yesterdayPatients;
      case "today":
      default:
        return patients;
    }
  };

  const filteredPatients = getFilteredPatients();

  return (
    <div className="app">
      <div className="heading">
        <h2 id="patientLabel">
          {selectedDate === "yesterday" ? "Consultant" : "Today's Patient list"}
        </h2>
   
      <div className="filter"> 
        <select
          id="dateFilter"
          className="patient-filter"
          value={selectedDate}
          onChange={handleDateChange}
        >
          <option value="today">Patient</option>
          <option value="yesterday">Consultant</option>
        </select>
      </div>
      </div>
      <div className="card-container">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.patientId}
            patient={patient}
            isExpanded={expandedCard === patient.patientId}
            onClick={() => handleExpandCard(patient.patientId)}
          />
        ))}
      </div>
    </div>
  );
}

export default Dailyappointments;
