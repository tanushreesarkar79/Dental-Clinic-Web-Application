import React, { useState, useEffect } from "react";
import { db } from "../config/FirebaseConfig"; // Import Firestore instance
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from "firebase/firestore"; // Firestore imports
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords
import "./patientlabrecords.css";

function Patientlabrecords() {
  const [doctorName, setDoctorName] = useState("");
  const [emailidDetails, setEmailIdDetails] = useState("");
  const [phonenumberDetails, setPhonenumberDetails] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [passwordDetails, setPasswordDetails] = useState("");
  const [doctorId, setDoctorId] = useState(""); // To store the doctor ID from session storage

  useEffect(() => {
    // Retrieve doctorId from sessionStorage on component load
    const storedDoctorId = sessionStorage.getItem("Doctor_id");
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    } else {
      alert("No doctor logged in. Please login first.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Hash the password
      const hashedPassword = bcrypt.hashSync(passwordDetails, 10); // Hash with a salt of 10 rounds

      // Get current date and time
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      // Query to check if doctor record exists based on doctorId
      const q = query(collection(db, "Doctor"), where("Doctor_id", "==", doctorId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If the document exists, update it
        const doctorRef = querySnapshot.docs[0].ref; // Get document reference

        await updateDoc(doctorRef, {
          doctorName: doctorName,
          email: emailidDetails,
          phonenumber: phonenumberDetails,
          address: addressDetails,
          password: hashedPassword,
          uploadDate: formattedDate,
          uploadTime: formattedTime,
        });

        console.log("Doctor data successfully updated.");
        alert("Doctor data updated successfully!");
      } else {
        // If no document exists, create a new one
        const newDoctorRef = doc(collection(db, "Doctor"), doctorId); // Create a new doc reference using doctorId

        await setDoc(newDoctorRef, {
          Doctor_id: doctorId,
          doctorName: doctorName,
          email: emailidDetails,
          phonenumber: phonenumberDetails,
          address: addressDetails,
          password: hashedPassword,
          uploadDate: formattedDate,
          uploadTime: formattedTime,
        });

        console.log("Doctor data successfully added.");
        alert("Doctor data added successfully!");
      }

      // Reset form
      setDoctorName("");
      setEmailIdDetails("");
      setPhonenumberDetails("");
      setAddressDetails("");
      setPasswordDetails("");
    } catch (error) {
      console.error("Error saving or updating data: ", error);
      alert("Failed to save data. Error: " + error.message);
    }
  };

  return (
    <div className="App-con">
      <form className="body-container" onSubmit={handleSubmit}>
        <h1>Doctor Profile</h1>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={emailidDetails}
            onChange={(e) => setEmailIdDetails(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phonenumberDetails}
            onChange={(e) => setPhonenumberDetails(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={addressDetails}
            onChange={(e) => setAddressDetails(e.target.value)}
            required
          />
        </div>
        

        <button className="patientlabrecordsbutton" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Patientlabrecords;
