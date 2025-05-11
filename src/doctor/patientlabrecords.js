import React, { useState, useEffect } from "react";
import { db, storage } from "../config/FirebaseConfig";
import { collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";

function Patientlabrecords() {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [pictureName, setPictureName] = useState("");
  const [customReportName, setCustomReportName] = useState("");
  const [pictureDetails, setPictureDetails] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [examinationDate, setExaminationDate] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [adviceToLabOptions, setAdviceToLabOptions] = useState([]);
  const [labreportDate, setlabreportDate] = useState([]); // Add this state to manage labreportDate
  const [createdAtOptions, setCreatedAtOptions] = useState([]); // State for createdAt options
  const [createdAtDates, setCreatedAtDates] = useState([]); // Add this state to manage createdAtDates
  const [customExaminationDate, setCustomExaminationDate] = useState(''); // Add state for the custom examination date


  const { id } = useParams();
  const navigate = useNavigate();

  const reportNames = [

  ];

  useEffect(() => {
    if (id) {
      const fetchPatientData = async () => {
        try {
          const patientDocRef = doc(db, "Patients Lab Reports", id);
          const patientDoc = await getDoc(patientDocRef);

          if (patientDoc.exists()) {
            const data = patientDoc.data();
            setPatientId(data.patientId);
            setPatientName(data.patientName);
            setPictureName(data.pictureName);
            setCustomReportName(data.customReportName || "");
            setPictureDetails(data.pictureDetails);
            setPreview(data.imageUrl);
            setExaminationDate(data.examinationDate);
            setReportDate(data.reportDate);
            setIsEditing(true);
            fetchPatientNameAndReports(data.patientId);
          } else {
            alert("Patient record not found!");
            navigate("/doctorlogin");
          }
        } catch (error) {
          console.error("Error fetching patient data: ", error);
        }
      };

      fetchPatientData();
    }
  }, [id, navigate]);

  const fetchPatientNameAndReports = async (patient_id) => {
    try {
      // Fetch patient name from Patients collection
      const patientRef = doc(db, "Patients", patient_id);
      const patientDoc = await getDoc(patientRef);
      if (patientDoc.exists()) {
        setPatientName(patientDoc.data().patient_name || "Unknown");
      } else {
        alert("Patient not found! You can manually enter Patient ID and Name.");
        setPatientName(""); // Allow manual entry
      }

      // Fetch adviceToLab from Prescription table for the given patientId
      const prescriptionQuery = query(
        collection(db, "Prescription"),
        where("patientId", "==", patient_id)
      );
      const querySnapshot = await getDocs(prescriptionQuery);
      const reports = [];
      const labreportDate = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.adviceToLab) {
          const date = data.createdAt.toDate().toLocaleDateString(); // Convert createdAt to date string
          //const adviceToLab = `${data.adviceToLab} (${date})`; // Append date to adviceToLab
          reports.push(data.adviceToLab);
          labreportDate.push(date);
        }
      });
      setlabreportDate(labreportDate);
      setAdviceToLabOptions(reports); // Set available reports as options

      // Fetch all createdAt dates from Patients Lab Reports collection
      const labReportsQuery = query(collection(db, "Patients Lab Reports"));
      const labReportsSnapshot = await getDocs(labReportsQuery);
      const createdAtDates = [];
      labReportsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          createdAtDates.push(data.createdAt);
        }
      });

      // Set createdAt dates as options
      setCreatedAtOptions(createdAtDates);

    } catch (error) {
      console.error("Error fetching patient name and reports: ", error);
      setPatientName(""); // Allow manual entry
      setAdviceToLabOptions([]); // Clear options in case of error
      setlabreportDate([]);
      setCreatedAtOptions([]); // Clear createdAt options
    }
  };

  const handlePatientIdChange = (e) => {
    const patient_id = e.target.value;
    setPatientId(patient_id);

    if (patient_id.trim() !== "") {
      fetchPatientNameAndReports(patient_id);
    } else {
      setPatientName("");
      setAdviceToLabOptions([]);
      setCreatedAtOptions([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId || !patientName || !pictureName || !pictureDetails || !image || !examinationDate || !reportDate ) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const selectedReportName = pictureName === "Others" ? customReportName : pictureName;

    if (pictureName === "Others" && !customReportName.trim()) {
      alert("Please provide a custom report name.");
      return;
    }

    try {
      const fileName = `${Date.now()}_${image.name}`;
      const imageRef = ref(storage, `Patients Lab Reports/${fileName}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      if (isEditing) {
        const patientDocRef = doc(db, "Patients Lab Reports", id);
        const patientDoc = await getDoc(patientDocRef);
        const oldImageUrl = patientDoc.data().imageUrl;

        if (oldImageUrl) {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        }

        await updateDoc(patientDocRef, {
          patientId,
          patientName,
          pictureName: selectedReportName,
          pictureDetails,
          imageUrl,
          fileName,
          examinationDate,
          reportDate,
          uploadDate: formattedDate,
          uploadTime: formattedTime,
        });

        alert("Patient report updated successfully!");
      } else {
        await addDoc(collection(db, "Patients Lab Reports"), {
          patientId,
          patientName,
          pictureName: selectedReportName,
          pictureDetails,
          imageUrl,
          fileName,
          examinationDate,
          reportDate,
          uploadDate: formattedDate,
          uploadTime: formattedTime,
        });

        alert("Patient report added successfully!");
      }

      setPatientId("");
      setPatientName("");
      setPictureName("");
      setCustomReportName("");
      setPictureDetails("");
      setImage(null);
      setPreview(null);
      setExaminationDate("");
      setReportDate("");

      navigate("/doctorlogin/viewLabReports");
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save data. Error: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <form className="p-4 bg-light rounded shadow">
        <h1 className="text-center mb-4 fs-4">
          {isEditing ? "Edit Patient Report" : "Patient Report Submission"}
        </h1>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Patient ID:</label>
            <input
              type="text"
              className="form-control"
              value={patientId}
              onChange={handlePatientIdChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Patient Name:</label>
            <input
              type="text"
              className="form-control"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Select Report Name:</label>
            <select
              className="form-select"
              value={pictureName}
              onChange={(e) => setPictureName(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a report
              </option>
              {reportNames.map((report) => (
                <option key={report} value={report}>
                  {report}
                </option>
              ))}
              {adviceToLabOptions.length > 0 &&
                adviceToLabOptions.map((advice, index) => (
                  <option key={index} value={advice}>
                    {advice}
                  </option>
                ))}
              <option value="Others">Others</option>
            </select>
          </div>

          {pictureName === "Others" && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Custom Report Name:</label>
              <input
                type="text"
                className="form-control"
                value={customReportName}
                onChange={(e) => setCustomReportName(e.target.value)}
                placeholder="Enter custom report name"
                required
              />
            </div>
          )}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Examination Date:</label>
            <select
              className="form-select"
              value={examinationDate}
              onChange={(e) => setExaminationDate(e.target.value)}
              required
            >
              <option value="" disabled>
                Select an examination date
              </option>
              {labreportDate.length > 0 ? (
                labreportDate.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))
              ) : (
                <option value="Others">Other</option>
              )}
            </select>
          </div>

          {examinationDate === "Others" && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Select Custom Examination Date:</label>
              <input
                type="date"
                className="form-control"
                value={customExaminationDate}
                onChange={(e) => setCustomExaminationDate(e.target.value)}
                required
              />
            </div>
          )}
        </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Report Details:</label>
              <textarea
                className="form-control"
                rows="3"
                value={pictureDetails}
                onChange={(e) => setPictureDetails(e.target.value)}
                placeholder="Enter picture details"
                required
              />
            </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Report Date:</label>
            <input
              type="date"
              className="form-control"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12">
            <label className="form-label fw-bold">Upload Report:</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
              required={!isEditing}
            />
          </div>
        </div>


        {preview && (
          <>
            <div className="row mb-3">
              <div className="col-md-12 text-center">
                <label className="form-label fw-bold">Preview:</label>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12 d-flex justify-content-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="img-fluid"
                  style={{ maxWidth: "400px", maxHeight: "400px" }}
                />
              </div>
            </div>
          </>
        )}



        <div className="text-center" style={{background:'#03c0c1'}} >
          <button type="submit" className="btn btn-primary" style={{background:'#03c0c1',border:'none'}}  onClick={handleSubmit}>
            {isEditing ? "Update Report" : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Patientlabrecords;
