import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { db } from '../config/FirebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useFormikContext } from 'formik';

const validationSchema = Yup.object().shape({
  consultantName: Yup.string().required('Consultant name is required'),
  appointmentDate: Yup.date()
    .required('Appointment date and time are required')
    .min(new Date(), 'Date cannot be in the past'),
  patientName: Yup.string().required('Patient name is required'),
  treatmentDetails: Yup.string().required('Treatment details are required'),
});

const Booking = () => {
  const [isBooked, setIsBooked] = useState(false);
  const [consultantName, setConsultantName] = useState('');
  const [consultants, setConsultants] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const initialValues = {
    consultantName: '',
    appointmentDate: '',
    patientName: '',
    treatmentDetails: '',
  };

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const consultantCollection = collection(db, 'consultants');
        const querySnapshot = await getDocs(consultantCollection);
        setConsultants(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching consultants:', error);
      }
    };

    fetchConsultants();
  }, []);

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToStorage = async () => {
    if (!imageFile) return null;

    const storage = getStorage();
    const storageRef = ref(storage, `labImages/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (values, { resetForm, setFieldValue }) => {
    try {
      const imageURL = await uploadImageToStorage();

      await addDoc(collection(db, 'bookings'), {
        consultantName: values.consultantName,
        appointmentDate: values.appointmentDate,
        patientName: values.patientName,
        treatmentDetails: values.treatmentDetails,
        labImage: imageURL || '',
        created_at: new Date().toISOString(),
      });

      setConsultantName(values.consultantName);
      setIsBooked(true);
      setImageFile(null);
      setPreview(null);
      resetForm();
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('There was an error processing your booking. Please try again.');
    }
  };

  return (
    <div className="booking-container">
      <h1>{isBooked ? 'Booking Confirmed!' : 'Book an Appointment'}</h1>
      {isBooked ? (
        <div className="confirmation-message">
          <h2>Booking Confirmed!</h2>
          <p>Your appointment with {consultantName} has been successfully booked.</p>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="consultantName">Consultant Name</label>
                  <Field as="select" id="consultantName" name="consultantName" className="form-field">
                    <option value="" label="Select a consultant" />
                    {consultants.map((consultant) => (
                      <option key={consultant.id} value={consultant.name}>
                        {consultant.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="consultantName" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="patientName">Patient Name</label>
                  <Field
                    type="text"
                    id="patientName"
                    name="patientName"
                    className="form-field"
                    placeholder="Enter patient name"
                  />
                  <ErrorMessage name="patientName" component="div" className="error-message" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="appointmentDate">Appointment Date & Time</label>
                <Field
                  type="datetime-local"
                  id="appointmentDate"
                  name="appointmentDate"
                  className="form-field"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <ErrorMessage name="appointmentDate" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="treatmentDetails">Treatment Details</label>
                <Field
                  as="textarea"
                  id="treatmentDetails"
                  name="treatmentDetails"
                  className="form-field"
                />
                <ErrorMessage name="treatmentDetails" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="labImage">Upload Lab Image</label>
                <input
                  type="file"
                  id="labImage"
                  accept="image/*"
                  className="form-field"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFieldValue('labImage', file); // Accessing setFieldValue from context
                    handleImageUpload(file);
                  }}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Lab Preview"
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      marginTop: '10px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                )}
              </div>

              <button type="submit" className="submit-button">
                Save Appointment
              </button>
            </Form>
          )}
        </Formik>
      )}


      <style>
        {`
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
        
        }
      
        .booking-container {
          max-width: 1500px;
          min-width:800px;
          margin-top: 50px;
          margin-left: 400px;
          margin-right: 100px;
          margin-bottom: 0;
          padding: 10px;
          background-color:#a4c3d3;          ;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }
      
        .booking-container:hover {
          /*transform: scale(1.02);*/
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }
      
        h1 {
          color: #4a4e69;
          margin-bottom: 20px;
          font-family: 'Poppins', sans-serif;
          text-align: center;
        }
      
        form {
         
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      
        .form-row {
          display: flex;
          justify-content: space-between;
          gap: 20px; /* Adjust spacing between fields */
        }
    
        .form-group {
          flex: 1; /* Allow fields to take equal width */
        }
    
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #352991;
        }
    
        .form-field {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 2px solid #03c1c0;
          border-radius: 12px;
          background-color: #e0f7fa;
          color: #d32f2f;
          transition: all 0.3s ease-in-out;
        }
    
        .form-field::placeholder {
          color: red;
        }
    
        .form-field:focus {
          border-color: #0288d1;
          box-shadow: 0 0 10px rgba(2, 136, 209, 0.5);
        }
    
        .error-message {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 5px;
        }
        .form-group {
          margin-bottom: 20px;
        }
      
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 8px;
          color: #352991;
        }
      
        /* Style for Select Dropdown */
        select.form-field {
          width: 97%;
          padding: 10px;
          font-size: 1rem;
          border: 2px solid #03c1c0;
          border-radius: 12px;
          background-color: #e0f7fa;
          color:  #d32f2f;
          transition: all 0.3s ease-in-out;
        }
      
        select.form-field:focus {
          border-color: #0288d1;
          box-shadow: 0 0 10px rgba(2, 136, 209, 0.5);
        }
      
        /* Style for Text Input (Patient Name) */
        input[type="text"].form-field {
          width: 92.5%;
          padding: 10px;
          font-size: 1rem;
          border:  2px solid #03c1c0;
          border-radius: 12px;
          background-color: #e0f7fa;
          color: #d32f2f;
          transition: all 0.3s ease-in-out;
    }
    input[type="text"]:focus {
      border-color: #0288d1;
      box-shadow: 0 0 10px rgba(94, 53, 177, 0.5);
    }
    /* Style for Patient Name Placeholder */
    input[type="text"].form-field::placeholder {
      color: #d32f2f; /* Set placeholder color to red */
      opacity: 1; /* Ensure full opacity for visibility */
    }
        /* Style for Date Input */
        input[type="datetime-local"] {
          width: 96.5%;
          padding: 10px;
          font-size: 1rem;
          border:  2px solid #03c1c0;
          border-radius: 12px;
          background-color: #e0f7fa;
          color: #d32f2f;
          transition: all 0.3s ease-in-out;
        }
      
        input[type="datetime-local"]:focus {
          border-color: #0288d1;
          box-shadow: 0 0 10px rgba(94, 53, 177, 0.5);
        }
      
        /* Style for Textbox (textarea) */
        textarea.form-field {
          width: 96.5%;
          padding: 10px;
          font-size: 1rem;
          border:  2px solid #03c1c0;
          border-radius: 12px;
          background-color:#e0f7fa;
          color: #131414;
          transition: all 0.3s ease-in-out;
        }
      
        textarea.form-field:focus {
          border-color:  #0288d1;
          box-shadow: 0 0 10px rgba(230, 74, 25, 0.5);
        }
      
        .error-message {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 5px;
        }
      
        /* Button Styles */
        .submit-button {
          background: linear-gradient(to right, #03c1c0, #007F80);
          color:#132e54;
          padding: 12px 20px;
          border: none;
          border-radius: 18px;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          width: 100%;
          text-align: center;
        }
      
        .submit-button:hover {
          background: linear-gradient(to right, #007F80, #03c1c0);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 128, 128, 0.4);
        }
      
        .submit-button:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(3, 193, 192, 0.7);
        }
      
        /* Confirmation Message */
        .confirmation-message {
          text-align: center;
          margin: 20px 0;
        }
      
        .confirmation-message h2 {
          color: #4caf50;
          margin: 10px 0;
          font-size: 1.5rem;
        }
      
        .confirmation-message p {
          font-size: 1rem;
          color: #333;
        }
        .input[type="file"].form-field {
          width: 96.5%; /* Match the width of other fields */
          padding: 10px;
          font-size: 1rem;
          border: 2px solid #03c1c0;
          border-radius: 12px;
          background-color: #e0f7fa;
          color: #d32f2f;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }
      
        /* Responsive Design */
        @media (max-width: 768px) {
          .booking-container {
            margin: 20px;
            padding: 15px;
          }
      
          .submit-button {
            padding: 10px 15px;
            font-size: 0.9rem;
          }
        `}
      </style>
    </div>
  );
};

export default Booking;
