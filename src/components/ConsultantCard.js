import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';

// Styled Components
const Card = styled.div`
  background: linear-gradient(135deg,#24849c,#a4c3d3);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  margin-right: 10px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

const Name = styled.h3`
  font-size: 20px;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const Info = styled.p`
  font-size: 14px;
  color: #e0f7fa;
  margin: 5px 0;
  line-height: 1.6;
`;

const Button = styled.button`
  background-color: #9dc8ec;
  color: black;
  border: none;
  margin-left: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #e8ca92;
    transform: scale(1.1);
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e53935;
  color: yellow;

  &:hover {
    background-color: #b71c1c;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PatientsList = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 30px;
  color: #e53935; /* Red color for the close button */
  cursor: pointer;

  &:hover {
    color: #b71c1c; /* Darker red on hover */
  }
`;

const ConsultantCard = ({ consultant, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [patients, setPatients] = useState([]);
  const [showPatients, setShowPatients] = useState(false);

  // Fetching patients associated with the consultant from the bookings collection
  const fetchPatients = async () => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('consultantName', '==', consultant.name)
      );
      const querySnapshot = await getDocs(q);
      const patientsData = querySnapshot.docs.map((doc) => doc.data().patientName);
      setPatients(patientsData);
      setShowPatients(true);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleDelete = async () => {
    try {
      const consultantRef = doc(db, 'consultants', consultant.id);
      await deleteDoc(consultantRef);
      onDelete(consultant.id); // Notify parent component to remove the consultant from the list
    } catch (error) {
      console.error('Error deleting consultant:', error);
    }
  };

  return (
    <>
      <Card>
        <Name>{consultant.name}</Name>
        <Info><strong>Email:</strong> {consultant.email}</Info>
        <Info><strong>Phone:</strong> {consultant.phone}</Info>
        <Info><strong>Specialty:</strong> {consultant.specialty}</Info>

        <Button onClick={handleToggleExpand}>View Details</Button>
        <Button onClick={fetchPatients}>View Patients</Button>
        <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      </Card>

      {isExpanded && (
        <Overlay>
          <PatientsList>
            <CloseButton onClick={handleToggleExpand}>&times;</CloseButton>
            <h3>Details for {consultant.name}</h3>
            <p><strong>Email:</strong> {consultant.email}</p>
            <p><strong>Phone:</strong> {consultant.phone}</p>
            <p><strong>Specialty:</strong> {consultant.specialty}</p>
          </PatientsList>
        </Overlay>
      )}

      {showPatients && (
        <Overlay>
          <PatientsList>
            <CloseButton onClick={() => setShowPatients(false)}>&times;</CloseButton>
            <h3>Patients for {consultant.name}</h3>
            {patients.length > 0 ? (
              patients.map((patientName, index) => (
                <p key={index}>{patientName}</p>
              ))
            ) : (
              <p>No patients found.</p>
            )}
          </PatientsList>
        </Overlay>
      )}
    </>
  );
};

export default ConsultantCard;
