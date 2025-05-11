import React, { useEffect, useState } from "react";
import { db, storage } from "../config/FirebaseConfig";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./labuploadhistory.css";

function LaboratoryUploadHistory() {
    const [PatientsLabReports, setPatientsLabReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientsLabReports = async () => {
            try {
                const PatientsLabReportsCollection = collection(db, "Patients Lab Reports");
                const PatientsLabReportsQuery = query(PatientsLabReportsCollection, orderBy("uploadTime", "desc"));
                const PatientsLabReportsSnapshot = await getDocs(PatientsLabReportsQuery);

                const PatientsLabReportsList = [];
                for (const doc of PatientsLabReportsSnapshot.docs) {
                    const data = doc.data();
                    const fileRef = ref(storage, `Patients Lab Reports/${data.fileName}`);
                    const imageUrl = await getDownloadURL(fileRef); // Fetch image URL
                    PatientsLabReportsList.push({ id: doc.id, imageUrl, ...data });
                }

                setPatientsLabReports(PatientsLabReportsList);
            } catch (error) {
                console.error("Error fetching reports: ", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientsLabReports();
    }, []);
    const handleDownload = async (PatientsLabReport) => {
        try {
            const fileRef = ref(storage, `Patients Lab Reports/${PatientsLabReport.fileName}`);
            const downloadUrl = await getDownloadURL(fileRef);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = PatientsLabReport.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file: ", error.message);
            alert("Failed to download file. Error: " + error.message);
        }
    };
    // Filter files by Name , Id and Time 
    const filteredReports = PatientsLabReports.filter((report) => {
        const withinSearchTerm = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 report.pictureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 report.pictureDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 report.patientId.toLowerCase().includes(searchTerm.toLowerCase());

        if (!withinSearchTerm) return false;

        if (filterOption === "All") return true;

        const today = new Date();
        const reportDate = new Date(report.uploadDate);

        switch (filterOption) {
            case "1 Day":
                return today - reportDate <= 1 * 24 * 60 * 60 * 1000;
            case "7 Days":
                return today - reportDate <= 7 * 24 * 60 * 60 * 1000;
            case "15 Days":
                return today - reportDate <= 15 * 24 * 60 * 60 * 1000;
            case "1 Month":
                return today - reportDate <= 30 * 24 * 60 * 60 * 1000;
            case "1 Year":
                return today - reportDate <= 365 * 24 * 60 * 60 * 1000;
            default:
                return true;
        }
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="labuploadhistoryApp-con">
            <div className="view-labreport-header-container">
                <h1 className="view-labreport-header" style={{ paddingLeft: "550px", alignItems: "center" }}>View Patients Lab Reports</h1>

                <div className="search-filter-container">
                    <input 
                        type="text" 
                        placeholder="Search by Patient Name or ID" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="view-labreport-search-input"
                    />

                    <select
                        className="filter-select"
                        value={filterOption}
                        onChange={(e) => setFilterOption(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="1 Day">1 Day</option>
                        <option value="7 Days">7 Days</option>
                        <option value="15 Days">15 Days</option>
                        <option value="1 Month">1 Month</option>
                        <option value="1 Year">1 Year</option>
                    </select>
                </div>
            </div>

            <div className="history-container">
                {filteredReports.length === 0 ? (
                    <p>No reports found.</p>
                ) : (
                    <table className="labuploadhistorytable">
                        <thead>
                            <tr>
                                <th>Patient Id</th>
                                <th>Patient Name</th> 
                                <th>Report Name</th>
                                <th>Report Details</th>
                                <th>Upload Date</th>
                                <th>Examine Date</th>
                                <th>Picture Preview</th>
                                <th style={{ textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map((PatientsLabReport) => (
                                <tr key={PatientsLabReport.id}>
                                    <td>{PatientsLabReport.patientId}</td>
                                    <td>{PatientsLabReport.patientName}</td>
                                    <td>{PatientsLabReport.pictureName}</td>
                                    <td>{PatientsLabReport.pictureDetails}</td>
                                    <td>{PatientsLabReport.uploadDate}</td>
                                    <td>{PatientsLabReport.examinationDate}</td>
                                    <td>
                                        <center><img 
                                            src={PatientsLabReport.imageUrl} 
                                            alt={PatientsLabReport.pictureName} 
                                            style={{ height: "50px", width: "40px" ,alignItems: "center" }} 
                                        /></center>
                                    </td>
                                    <td className="labuploadhistory-actionbutton">
                                        <button onClick={() => navigate(`/doctorlogin/patientlab/${PatientsLabReport.id}`)}>Edit</button>
                                        {/* <button onClick={() => handleDelete(PatientsLabReport.id, PatientsLabReport.fileName)}>Delete</button> */}
                                        <button onClick={() => handleDownload(PatientsLabReport)}>Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default LaboratoryUploadHistory;
