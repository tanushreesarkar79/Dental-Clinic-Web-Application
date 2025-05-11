import React, { useEffect, useState } from "react";
import { db, storage } from "../config/FirebaseConfig";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./labuploadhistory.css";

function LaboratoryUploadHistory() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsCollection = collection(db, "invoices");
                const reportsQuery = query(reportsCollection, orderBy("uploadTime", "desc"));
                const reportsSnapshot = await getDocs(reportsQuery);

                const reportsList = reportsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReports(reportsList);
            } catch (error) {
                console.error("Error fetching reports:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);
    // Delete reports 
    /* const handleDelete = async (id, fileName) => {
        try {
            const fileRef = ref(storage, `Invoices/${fileName}`);
            await deleteObject(fileRef);
            await deleteDoc(doc(db, "invoices", id));
            setReports((prevReports) => prevReports.filter((report) => report.id !== id));
        } catch (error) {
            console.error("Error deleting report or file:", error.message);
        }
    }; */
    // Download files
    const handleDownload = async (report) => {
        try {
            const fileRef = ref(storage, `Invoices/${report.fileName}`);
            const downloadUrl = await getDownloadURL(fileRef);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = report.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error.message);
            alert("Failed to download file. Error: " + error.message);
        }
    };
    // Filter files by Name , Id and Time 
    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            (report.laboratoryName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (report.laboratoryId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || false) || // Convert int to string
            (new Date(report.uploadDate)?.toISOString().toLowerCase().includes(searchTerm.toLowerCase()) || false) || // Convert date to ISO string
            (new Date(report.uploadTime)?.toLocaleTimeString().toLowerCase().includes(searchTerm.toLowerCase()) || false) || // Format time
            (report.totalAmount?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || false) || // Convert number to string
            (report.amountPaid?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || false); // Convert number to string
    
        if (!matchesSearch) return false;
    
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
                <h1 className="view-labreport-header" style={{ paddingLeft: "650px", alignItems: "center" }}>Invoices History</h1>

                <div className="search-filter-container">
                    <input 
                        type="text" 
                        placeholder="Search by Laboratory Name or ID" 
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
                                <th>Laboratory Name</th>
                                <th>Total Amount</th>
                                <th>Amount Paid</th>
                                <th>Due Amount</th>
                                <th>Upload Date</th>
                                <th>Upload Time</th>
                                <th style={{ textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="labuploadhistorytbody">
                            {filteredReports.map((report) => (
                                <tr key={report.id}>
                                    <td>{report.laboratoryName}</td>
                                    <td>{report.totalAmount}</td>
                                    <td>{report.amountPaid}</td>
                                    <td>{report.dueAmount}</td>
                                    <td>{report.uploadDate}</td>
                                    <td>{report.uploadTime}</td>
                                    <td className="labuploadhistory-actionbutton">
                                        <button onClick={() => navigate(`/doctorlogin/labupload/${report.id}`)}>Edit</button>
                                        {/* <button onClick={() => handleDelete(report.id, report.fileName)}>Delete</button> */}
                                        <button onClick={() => handleDownload(report)}>Download</button>
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