import React, { useEffect, useState } from "react";
import { db, storage } from "../config/FirebaseConfig";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function LabInvoiceUpload() {
    const [laboratoryName, setLaboratoryName] = useState("");
    const [customLaboratoryName, setCustomLaboratoryName] = useState(""); // State for custom lab name
    const [totalAmount, setTotalAmount] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [invoiceIssueDate, setInvoiceIssueDate] = useState(""); // New state for issue date

    const { id } = useParams();
    const navigate = useNavigate();

    const laboratoryOptions = ["Lab A", "Lab B", "Lab C", "Lab D", "Lab E", "Other"];

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            if (!id) return;

            try {
                const docRef = doc(db, "invoices", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setLaboratoryName(data.laboratoryName);
                    setTotalAmount(data.totalAmount.toString());
                    setAmountPaid(data.amountPaid.toString());
                    setPreview(data.fileUrl);
                    setInvoiceIssueDate(data.invoiceIssueDate); // Set the issue date if editing
                    setIsEditing(true);
                }
            } catch (error) {
                console.error("Error fetching invoice details: ", error.message);
            }
        };

        fetchInvoiceDetails();
    }, [id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setPreview(selectedFile && selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!laboratoryName || !totalAmount || !amountPaid || (!file && !isEditing) || !invoiceIssueDate) {
            alert("Please fill in all fields, including the invoice issue date and upload a file.");
            return;
        }

        const dueAmount = (parseFloat(totalAmount) - parseFloat(amountPaid)).toFixed(2);

        try {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();
            const formattedTime = currentDate.toLocaleTimeString();

            // If "Other" is selected, use the custom laboratory name
            const finalLaboratoryName = laboratoryName === "Other" ? customLaboratoryName : laboratoryName;

            if (isEditing) {
                // Update existing invoice
                const invoiceRef = doc(db, "invoices", id);
                const updatedData = { 
                    laboratoryName: finalLaboratoryName, 
                    totalAmount: parseFloat(totalAmount), 
                    amountPaid: parseFloat(amountPaid), 
                    dueAmount, 
                    uploadDate: formattedDate,    // Update the upload date
                    uploadTime: formattedTime,    // Update the upload time
                    invoiceIssueDate,            // Include the issue date in the update
                };

                const docSnap = await getDoc(invoiceRef);

                if (docSnap.exists() && file) {
                    const oldFileUrl = docSnap.data().fileUrl;
                    const oldFileRef = ref(storage, `Invoices/${docSnap.data().fileName}`);
                    
                    // Delete old file if a new file is uploaded
                    await deleteObject(oldFileRef);

                    const fileExtension = file.name.split('.').pop();
                    const fileName = `${id}.${fileExtension}`;
                    const fileRef = ref(storage, `Invoices/${fileName}`);
                    await uploadBytes(fileRef, file);
                    updatedData.fileName = fileName;
                    updatedData.fileUrl = await getDownloadURL(fileRef);
                }

                await updateDoc(invoiceRef, updatedData);
                alert("Invoice updated successfully!");
            } else {
                // Add new invoice
                const LaboratoryId = Date.now();
                const fileExtension = file.name.split('.').pop();
                const fileName = `${id}.${fileExtension}`;
                const fileRef = ref(storage, `Invoices/${fileName}`);
                await uploadBytes(fileRef, file);
                const fileUrl = await getDownloadURL(fileRef);

                await addDoc(collection(db, "invoices"), {
                    LaboratoryId,
                    laboratoryName: finalLaboratoryName, // Use the final lab name here
                    totalAmount: parseFloat(totalAmount),
                    amountPaid: parseFloat(amountPaid),
                    dueAmount,
                    fileName,
                    fileUrl,
                    invoiceIssueDate,            // Add issue date when creating new invoice
                    uploadDate: formattedDate,    // Set the upload date
                    uploadTime: formattedTime,    // Set the upload time
                });

                alert("Invoice uploaded successfully!");
            }

            navigate("/doctorlogin/labuploadhistory");
        } catch (error) {
            console.error("Error saving data:", error.message);
            alert("Failed to save data. Error: " + error.message);
        }
    };

    return (
        <div  className="container mt-4">
            <form className="shadow p-4 bg-light rounded" onSubmit={handleSubmit}>
                <h1 className="text-center mb-4">{isEditing ? "Edit Monthly Invoice" : "Upload Monthly Invoice"}</h1>
                <div className="mb-3">
                    <label className="form-label">Laboratory Name</label>
                    <select
                        className="form-select"
                        value={laboratoryName}
                        onChange={(e) => setLaboratoryName(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a laboratory</option>
                        {laboratoryOptions.map((lab) => (
                            <option key={lab} value={lab}>
                                {lab}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Conditional rendering for custom lab name */}
                {laboratoryName === "Other" && (
                    <div className="mb-3">
                        <label className="form-label">Custom Laboratory Name</label>
                        <input
                            type="text"
                            value={customLaboratoryName}
                            onChange={(e) => setCustomLaboratoryName(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Total Amount:</label>
                    <input
                        type="text"
                        value={totalAmount}
                        onChange={(e) => {
                            const inputValue1 = e.target.value;
                            // Allow only numbers
                            if (/^\d*$/.test(inputValue1)) {
                                setTotalAmount(inputValue1);
                            }
                        }}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Amount Paid:</label>
                        <input
                            type="text"
                            value={amountPaid}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                // Allow only numbers
                                if (/^\d*$/.test(inputValue)) {
                                    setAmountPaid(inputValue);
                                }
                            }}
                            className="form-control"
                            required
                        />
                </div>
                <div className="mb-3">
                    <label className="form-label">Invoice Issue Date:</label>
                    <input
                        type="date"
                        value={invoiceIssueDate}
                        onChange={(e) => setInvoiceIssueDate(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Upload File:</label>
                    <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
                {preview && (
                    <div className="mb-3">
                        <h3>Invoice Preview:</h3>
                        <div className="col-md-12 d-flex justify-content-center">
                            <img
                            src={preview}
                            alt="Preview"
                            className="img-fluid"
                            style={{ maxWidth: "400px", maxHeight: "400px" }}
                            />
                        </div>
                    </div>
                )}
                <div className="d-flex justify-content-center" style={{background:'#03c0c1'}}>
                    <button className="btn btn-primary" style={{background:'#03c0c1',border:'none'}} type="submit">{isEditing ? "Update" : "Submit"}</button>
                </div>
            </form>
        </div>
    );
}

export default LabInvoiceUpload;
