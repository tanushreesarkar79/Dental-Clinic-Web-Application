import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for layout
const BookingHistoryContainer = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f4f4f4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-family: Arial, sans-serif;
  font-weight: bold;
`;

// Filter section for both time frame and consultant name
const FilterSection = styled.div`
  position: fixed;
  top: 90px;
  right: 20px;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100; /* Ensure it stays on top of other elements */
`;

const FilterLabel = styled.label`
  margin-right: 10px;
  font-family: Arial, sans-serif;
  font-weight: bold;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  margin-bottom: 10px;
  transition: border-color 0.3s ease;
  font-family: Arial, sans-serif;

  &:focus {
    border-color: #03c1c0;
    outline: none;
  }
`;

const BookingList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
`;

const BookingItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: 1px solid transparent;
  }
`;

const NoBookingsMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* Center vertically */
`;

const BookingHistory = () => {
  const [filter, setFilter] = useState('lastWeek');
  const [selectedConsultant, setSelectedConsultant] = useState('');

  // Dummy consultant and booking data for demonstration purposes
  const consultants = ['Dr. John', 'Dr. Jane', 'Dr. Smith'];
  const filteredBookings = [
    { consultantName: 'Dr. John', date: '2024-10-01', time: '10:00 AM' },
    { consultantName: 'Dr. Jane', date: '2024-10-05', time: '02:00 PM' }
    // Add more bookings as needed
  ];

  // Filter bookings based on both time frame and consultant
  const filteredResults = filteredBookings.filter((booking) => {
    const matchesConsultant = selectedConsultant
      ? booking.consultantName === selectedConsultant
      : true; // If no consultant is selected, match all
    const matchesTimeFrame = filter === 'lastWeek'; // You can add more time frame logic
    return matchesConsultant && matchesTimeFrame;
  });

  return (
    <>
      {/* Filter section for both time frame and consultant */}
      <FilterSection>
        <FilterLabel htmlFor="filter">Filter by Time Frame:</FilterLabel>
        <FilterSelect
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Date">Date</option>
          <option value="Month"> Month</option>
          
        </FilterSelect>

        <FilterLabel htmlFor="consultant">Filter by Consultant:</FilterLabel>
        <FilterSelect
          id="consultant"
          value={selectedConsultant}
          onChange={(e) => setSelectedConsultant(e.target.value)}
        >
          <option value="">All Consultants</option>
          {consultants.map((consultant, index) => (
            <option key={index} value={consultant}>
              {consultant}
            </option>
          ))}
        </FilterSelect>
      </FilterSection>

      {/* Booking history container */}
      <BookingHistoryContainer>
        <Title>Booking History</Title>

        {/* Booking list */}
        <BookingList>
          {filteredResults.length > 0 ? (
            filteredResults.map((booking, index) => (
              <BookingItem key={index}>
                <p>{booking.consultantName} - {booking.date} at {booking.time}</p>
              </BookingItem>
            ))
          ) : (
            <NoBookingsMessage>No bookings found for the selected criteria.</NoBookingsMessage>
          )}
        </BookingList>
      </BookingHistoryContainer>
    </>
  );
};

export default BookingHistory;
