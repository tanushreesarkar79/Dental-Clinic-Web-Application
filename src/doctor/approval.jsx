import React, { useState } from 'react';
import './approval.css';

function Approval() {
  const [labRequests, setLabRequests] = useState([
    { name: 'Sameer Gupta',email:'abc@gmail.com', phone: '555-555-5555' },
    { name: 'Virat Kohli',email:'abcd@gmail.com', phone: '444-444-4444' },
  ]);

  const approveLab = (index) => {
    const updatedRequests = [...labRequests];
    updatedRequests.splice(index, 1);
    setLabRequests(updatedRequests);
  };

  const deleteLab = (index) => {
    const updatedRequests = [...labRequests];
    updatedRequests.splice(index, 1);
    setLabRequests(updatedRequests);
  };

  return (
    <div className="admin-container">
      <h2>Consultant's Request for New Account</h2>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email Id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {labRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.name}</td>
              <td>{request.phone}</td>
              <td>{request.email}</td>
              <td>
                <button onClick={() => approveLab(index)} className="approve-button">Approve</button>
                <button onClick={() => deleteLab(index)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Approval;
