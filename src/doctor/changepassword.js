import React, { useState, useEffect } from "react";
import { db } from "../config/FirebaseConfig"; // Import Firestore instance
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore"; // Firestore imports
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [doctorId, setDoctorId] = useState(""); // To store the doctor ID from session storage

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    try {
      // Query to fetch the doctor by doctorId
      const q = query(collection(db, 'Doctor'), where('Doctor_id', '==', doctorId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doctorData = querySnapshot.docs[0].data(); // Get the first document's data

        // Verify if the old password matches the stored password
        const isOldPasswordCorrect = bcrypt.compareSync(oldPassword, doctorData.password);
        if (isOldPasswordCorrect) {
          // Old password is correct, hash the new password
          const hashedNewPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password
          const docRef = querySnapshot.docs[0].ref; // Get reference of the document to update
          await updateDoc(docRef, {
            password: hashedNewPassword, // Save the hashed password
          });
          alert("Password updated successfully!");
        } else {
          alert("Old password is incorrect.");
        }
      } else {
        alert("Doctor record not found.");
      }
    } catch (error) {
      console.error("Error updating password: ", error);
      alert("Error updating password: " + error.message);
    }

    // Reset form fields
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Update Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label htmlFor="oldPassword" className="form-label">Old Password</label>
          <input
            type={showOldPassword ? "text" : "password"}
            id="oldPassword"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <i
            className={`fas ${showOldPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowOldPassword(!showOldPassword)}
            style={{ position: "absolute", right: "10px", top: "42px", cursor: "pointer" }}
          ></i>
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <i
            className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowNewPassword(!showNewPassword)}
            style={{ position: "absolute", right: "10px", top: "42px", cursor: "pointer" }}
          ></i>
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <i
            className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: "absolute", right: "10px", top: "42px", cursor: "pointer" }}
          ></i>
        </div>

        <button type="submit" className="btn btn-primary w-100" style={{background:'#03c0c1',border:'none'}} >Submit</button>
      </form>
    </div>
  );
}

export default ChangePassword;
