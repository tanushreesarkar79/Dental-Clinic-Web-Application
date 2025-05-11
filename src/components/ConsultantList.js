import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig'; // Firebase config import
import ConsultantCard from './ConsultantCard'; // Import ConsultantCard component
import styled from 'styled-components'; // Styled Components for layout and styling

const ListContainer = styled.div`
 
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cards in a row */
  gap: 20px; /* Gap between cards */
  padding: 10px;
  justify-items: center; /* Center-align cards */
  margin-left:180px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 28px;
  margin-top: 100px;
  font-family: 'Arial', sans-serif;
`;

const Button = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #03c0c1;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #029fa0;
  }
`;

const ConsultantList = () => {
  const [consultants, setConsultants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // Number of consultants to show initially
  const [loading, setLoading] = useState(true);

  // Fetching consultants from Firestore
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'consultants'));
        const consultantsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConsultants(consultantsData);
      } catch (error) {
        console.error('Error fetching consultants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  // Delete consultant from the list
  const handleDelete = (id) => {
    setConsultants(consultants.filter((consultant) => consultant.id !== id));
  };

  // Show more consultants
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Show 3 more consultants each time
  };

  return (
    <div>
      <Title>Meet Our Consultants</Title>
      {loading ? (
        <p>Loading consultants...</p>
      ) : (
        <>
          <ListContainer>
            {consultants.slice(0, visibleCount).map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                onDelete={handleDelete}
              />
            ))}
          </ListContainer>
          {consultants.length > 2 && visibleCount < consultants.length && (
            <Button onClick={handleShowMore}>Show More</Button>
          )}
        </>
      )}
    </div>
  );
};

export default ConsultantList;
