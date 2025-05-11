import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from "../config/FirebaseConfig"; // Adjust your Firebase import path

const Payment = () => {
  const [consultants, setConsultants] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [patientId, setPatientId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [amountBalance, setAmountBalance] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'consultants'));
        const fetchedConsultants = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConsultants(fetchedConsultants);
      } catch (error) {
        console.error('Error fetching consultants:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Patient Appointments'));
        const fetchedAppointments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          patientName: doc.data().patient_name,
          ...doc.data(),
        }));
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchConsultants();
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (totalAmount && amountPaid) {
      const balance = totalAmount - amountPaid;
      setAmountBalance(balance >= 0 ? balance : 0);
    }
  }, [totalAmount, amountPaid]);

  const validateAmounts = () => {
    if (parseFloat(amountPaid) > parseFloat(totalAmount)) {
      alert('Amount paid cannot exceed the total amount.');
      return false;
    }
  
    // Check if all amounts are valid
    if (
      parseFloat(totalAmount) <= 0 || // Ensure total amount is greater than 0
      parseFloat(amountPaid) < 0 ||  // Ensure paid amount is not negative
      isNaN(parseFloat(totalAmount)) ||
      isNaN(parseFloat(amountPaid)) ||
      isNaN(parseFloat(amountBalance))
    ) {
      alert('Please enter valid amounts.');
      return false;
    }
  
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateAmounts() && selectedConsultant && patientId && paymentDate) {
      const selectedPatient = appointments.find((appointment) => appointment.id === patientId);
      const patientName = selectedPatient ? selectedPatient.patientName : '';
      if (!patientName) {
        setPaymentSuccess(false);
        return;
      }
      const newPayment = {
        consultant: selectedConsultant,
        patientId,
        patientName,
        totalAmount: parseFloat(totalAmount),
        amountPaid: parseFloat(amountPaid),
        amountBalance: parseFloat(amountBalance),
        paymentDate,
        created_at: new Date().toISOString(),
      };

      try {
        await addDoc(collection(db, 'consultantPayments'), newPayment);
        setPaymentSuccess(true);
      } catch (error) {
        console.error('Error submitting payment:', error);
        setPaymentSuccess(false);
      }
      resetForm();
    } else {
      setPaymentSuccess(false);
    }
  };

  const resetForm = () => {
    setSelectedConsultant('');
    setPatientId('');
    setTotalAmount('');
    setAmountPaid('');
    setAmountBalance('');
    setPaymentDate('');
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  // Embedded styles
  const styles = {
    container: {
      backgroundColor:'#a4c3d3',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '800px',
      color: '#003366',
      margin: '100px auto',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
    },
    title: {
      textAlign: 'center',
      color: '#003366',
      fontSize: '1.8rem',
      marginBottom: '20px',
      
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '15px',
    },
    label: {
      fontWeight: 'bold',
      color: '#555',
      marginBottom: '5px',
      fontSize:'18px',
    },
    select: {
      width: '100%',
      padding: '8px',
      fontSize: '0.9rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      background: 'linear-gradient(135deg, #ffebeb, #ffe6f2)',
      outline: 'none',
    },
    input: {
      width: '96%',
      padding: '8px',
      fontSize: '0.9rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      background: 'linear-gradient(135deg, #ffebeb, #ffe6f2)',
      outline: 'none',
    },
    button: {
      padding: '10px 20px',
      background: 'linear-gradient(to right, #03c1c0, #007F80)',
      border: 'none',
      borderRadius: '8px',
      width: '200px',
      marginLeft :'280px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
      cursor: 'pointer',
    },
    message: {
      textAlign: 'center',
      marginTop: '10px',
      fontSize: '1rem',
    },
    success: {
      color: '#28a745',
    },
    error: {
      color: '#dc3545',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Consultant Payment</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Select Consultant</label>
            <select
              value={selectedConsultant}
              onChange={(e) => setSelectedConsultant(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">-- Choose Consultant --</option>
              {consultants.map((consultant) => (
                <option key={consultant.id} value={consultant.name}>
                  {consultant.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">-- Choose Patient --</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.patientName} ({appointment.id})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.row}>
  <div style={{ flex: 1 }}>
    <label style={styles.label}>Total Amount</label>
    <input
      type="text"
      value={totalAmount}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only numeric values
          setTotalAmount(value);
        }
      }}
      required
      style={styles.input}
    />
  </div>
  <div style={{ flex: 1 }}>
    <label style={styles.label}>Amount Paid</label>
    <input
      type="text"
      value={amountPaid}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only numeric values
          setAmountPaid(value);
        }
      }}
      required
      style={styles.input}
    />
  </div>
</div>
<div style={styles.row}>
  <div style={{ flex: 1 }}>
    <label style={styles.label}>Amount Balance</label>
    <input
      type="text"
      value={
        totalAmount && amountPaid
          ? Math.max(0, totalAmount - amountPaid)
          : ''
      } // Calculate balance
      disabled
      style={styles.input}
    />
  </div>


          <div style={{ flex: 1 }}>
            <label style={styles.label}>Payment Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              style={styles.input}
              max={todayDate}
            />
          </div>
        </div>
        <button type="submit" style={styles.button}>
          Submit Payment
        </button>
        {paymentSuccess !== null && (
          <p
            style={{
              ...styles.message,
              ...(paymentSuccess ? styles.success : styles.error),
            }}
          >
            {paymentSuccess
              ? 'Payment submitted successfully!'
              : 'Payment submission failed!'}
          </p>
        )}
      </form>
    </div>
  );
};

export default Payment;
