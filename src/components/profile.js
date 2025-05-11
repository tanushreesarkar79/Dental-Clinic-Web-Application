import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Profile = () => {
  // Sample data for the consultant
  const consultant = {
    name: 'Dr. Jane Smith',
    qualifications: 'DDS, PhD',
    experience: '15 years in Periodontics',
    specialty: 'Periodontics',
    availability: [
      '2024-09-20T09:00:00',
      '2024-09-20T10:00:00',
      '2024-09-21T14:00:00',
      '2024-09-22T11:00:00'
    ]
  };

  // Sample function to render calendar slots
  const renderSlots = () => {
    return consultant.availability.map((slot, index) => (
      <div key={index} className="slot">
        {new Date(slot).toLocaleString()}
      </div>
    ));
  };

  return (
    <>
      <style>
        {`
          .profile-container {
            padding: 30px;
            background-color: #f4f4f4;
            max-width: 700px;
            margin: 40px auto;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .profile-name {
            text-align: center;
            color: #333;
            font-size: 20px; /* Main heading size */
          }

          .profile-details {
            margin-top: 20px;
            font-size: 16px;
            color: #555;
          }

          .profile-details strong {
            font-size: 18px; /* Subtopic font size */
          }

          .calendar-container {
            margin-top: 30px;
          }

          .slots-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .slot {
            background-color: #575757;
            color: #fff;
            padding: 10px;
            border-radius: 4px;
            margin: 5px 0;
            width: 100%;
            text-align: center;
          }

          .book-button {
            display: inline-block;
            margin-top: 20px;
            background-color: #03c1c0;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            text-align: center;
            width: 200px; /* Fixed width for centering */
          }

          .book-button:hover {
            background-color: #007F80;
          }

          .button-container {
            display: flex;
            justify-content: center; /* Centers the button horizontally */
            margin-top: 30px;
          }
        `}
      </style>
      <div className="profile-container">
        <h1 className="profile-name">{consultant.name}</h1>
        <div className="profile-details">
          <p><strong>Qualifications:</strong> {consultant.qualifications}</p>
          <p><strong>Experience:</strong> {consultant.experience}</p>
          <p><strong>Specialty:</strong> {consultant.specialty}</p>
        </div>
        <div className="calendar-container">
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Available Appointment Slots</h2>
          <div className="slots-container">
            {renderSlots()}
          </div>
          {/* Book Appointment Button centered */}
          <div className="button-container">
            <Link to="/booking" className="book-button">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
