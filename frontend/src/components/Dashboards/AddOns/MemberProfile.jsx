// src/components/AddOns/MemberProfile.jsx
import React from 'react';
import './MemberProfile.css'; // optional: include your modal styling here

const MemberProfile = ({ member, onBack }) => {
  if (!member) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{member.name}'s Profile</h2>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Phone:</strong> {member.phone}</p>
        <p><strong>Username:</strong> {member.username}</p>
        <p><strong>Age:</strong> {member.age}</p>
        <p><strong>Gender:</strong> {member.gender}</p>
        <p><strong>Membership:</strong> {member.membership}</p>
        <p><strong>Trainer:</strong> {member.trainer || 'Not Assigned'}</p>
        <p><strong>Status:</strong> {member.status}</p>
        
        <button onClick={onBack}>Close</button>
      </div>
    </div>
  );
};

export default MemberProfile;
