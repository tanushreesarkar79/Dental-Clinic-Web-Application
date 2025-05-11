import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import "./PaymentHistory.css";

const PaymentHistory = () => {
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch consultants from Firestore
  const fetchConsultants = async () => {
    try {
      const consultantSnapshot = await getDocs(collection(db, "consultants"));
      const consultantsData = consultantSnapshot.docs.map((doc) => doc.data().name);
      setConsultants(consultantsData);
    } catch (err) {
      console.error("Error fetching consultants:", err);
    }
  };

  // Fetch payment history from Firestore
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const paymentRef = collection(db, "consultantPayments");
      let q = paymentRef;

      if (filters.name) {
        q = query(q, where("consultant", "==", filters.name));
      }
      if (filters.startDate && filters.endDate) {
        q = query(
          q,
          where("paymentDate", ">=", filters.startDate),
          where("paymentDate", "<=", filters.endDate)
        );
      }

      const paymentSnapshot = await getDocs(q);
      const payments = paymentSnapshot.docs.map((doc) => doc.data());
      setPaymentHistory(payments);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  // Export payment history as a DOC file
  const saveAsDoc = () => {
    const docContent = paymentHistory
      .map(
        (payment, index) =>
          `Payment ${index + 1}:\nConsultant: ${payment.consultant}\nPatient ID: ${payment.patientId}\nPatient Name: ${payment.patientName}\nPayment Date: ${payment.paymentDate}\nAmount Paid: ${payment.amountPaid}\nTotal Amount: ${payment.totalAmount}\nBalance: ${payment.amountBalance}\n`
      )
      .join("\n");

    const blob = new Blob([docContent], { type: "application/msword" });
    saveAs(blob, "payment-history.doc");
  };

  // Export payment history as CSV
  const downloadCSV = () => {
    const csvData = paymentHistory.map((payment) => ({
      Consultant: payment.consultant,
      "Patient ID": payment.patientId,
      "Patient Name": payment.patientName,
      "Payment Date": payment.paymentDate,
      "Amount Paid": payment.amountPaid,
      "Total Amount": payment.totalAmount,
      Balance: payment.amountBalance,
    }));

    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "payment-history.csv");
  };

  // Print payment history as PDF
  const printAsPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
  
    // Define headers
    const headers = [
      ["S.No", "Consultant", "Patient ID", "Patient Name", "Payment Date","Total Amount", "Amount Paid",  "Balance"],
    ];
  
    // Prepare rows
    const rows = paymentHistory.map((payment, index) => [
      index + 1,
      payment.consultant,
      payment.patientId,
      payment.patientName || "N/A",
      payment.paymentDate,
      payment.totalAmount,
      payment.amountPaid,
      payment.amountBalance,
    ]);
  
    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
      },
      bodyStyles: {
        lineColor: [221, 221, 221],
      },
      margin: { top: 10, left: 10, right: 10 },
    });
  
    // Save the PDF
    doc.save("payment-history.pdf");
  };
  

  return (
    <div className="payment-history-container">
      <h1>Payment History</h1>
      <form
        className="payment-history-form"
        onSubmit={(e) => {
          e.preventDefault();
          fetchPayments();
        }}
      >
        <label>
          Consultant:
          <select
            name="name"
            value={filters.name}
            onChange={(e) =>
              setFilters({ ...filters, name: e.target.value })
            }
          >
            <option value="">--Select--</option>
            {consultants.map((consultant, index) => (
              <option key={index} value={consultant}>
                {consultant}
              </option>
            ))}
          </select>
        </label>

        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </label>

        <button type="submit">Fetch Payments</button>
      </form>

      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : paymentHistory.length > 0 ? (
        <div>
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Consultant</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Payment Date</th>
                <th>Total Amount</th>
                <th>Amount Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{payment.consultant}</td>
                  <td>{payment.patientId}</td>
                  <td>{payment.patientName || "N/A"}</td>
                  <td>{payment.paymentDate}</td>
                  <td>{payment.totalAmount}</td>
                  <td>{payment.amountPaid}</td>
                  <td>{payment.amountBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="payment-history-actions">
            <button onClick={saveAsDoc}>Save as DOC</button>
            <button onClick={downloadCSV}>Download CSV</button>
            <button onClick={printAsPDF}>Print as PDF</button>
          </div>
        </div>
      ) : (
        <p className="no-records-message">No payment records found.</p>
      )}
    </div>
  );
};

export default PaymentHistory;
