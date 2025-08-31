import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaUser,
  FaUserGraduate,
  FaThumbsUp,
  FaExclamationTriangle,
  FaTrash
} from 'react-icons/fa';
import './TrainerProfile.css';

function TrainerProfile({ trainer, onBack, onRemove }) {
  const [students, setStudents] = useState([]);
  const mockReviews = ['Very motivating', 'Good energy in Zumba class'];
  const mockComplaints = ['Was late once', 'Music was too loud'];

  useEffect(() => {
    const fetchAssignedMembers = async () => {
      const storedUser = JSON.parse(localStorage.getItem("gymUser") || sessionStorage.getItem("gymUser"));
      try {
        const res = await fetch(`https://gymhut-backend-sqrx.onrender.com/api/trainers/${storedUser.gymcode}/${trainer.username}/members`);
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
        } else {
          toast.error(data.error || "Failed to fetch students");
        }
      } catch (err) {
        toast.error("Error loading assigned members");
      }
    };

    fetchAssignedMembers();
  }, [trainer]);

  const handleRemove = async () => {
    if (!window.confirm(`Are you sure you want to remove ${trainer.name}?`)) return;
    const storedUser = JSON.parse(localStorage.getItem("gymUser") || sessionStorage.getItem("gymUser"));
    try {
      const res = await fetch(`https://gymhut-backend-sqrx.onrender.com/api/trainers/delete/${storedUser.gymcode}/${trainer.username}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Trainer removed");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else toast.error(result.error);
    } catch (err) {
      toast.error("Error removing trainer");
    }
  };

  return (
    <div className="trainer-profile content">
      <button className="back-bt" onClick={onBack}>← Back</button>
      <h2><FaUser /> {trainer.name}</h2>
      <p><strong>Username:</strong> {trainer.username}</p>
      <p><strong>Specialty:</strong> {trainer.specialty}</p>
      <p><strong>Email:</strong> {trainer.email || "N/A"}</p>
      <p><strong>Phone:</strong> {trainer.phone || "N/A"}</p>

      <section>
        <h3>Assigned Members:</h3>
        <ul>
          {students.length === 0 ? (
            <li>No members assigned</li>
          ) : (
            students.map((student) => (
              <li key={student.username}>
                <FaUserGraduate className="icon" /> {student.name}
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h3>Reviews:</h3>
        <ul>
          {mockReviews.map((r, i) => (
            <li key={i}><FaThumbsUp className="icon success" /> {r}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Complaints:</h3>
        <ul>
          {mockComplaints.map((c, i) => (
            <li key={i}><FaExclamationTriangle className="icon warning" /> {c}</li>
          ))}
        </ul>
      </section>

      <button className="remove-trainer-btn" onClick={handleRemove}>
        <FaTrash /> Remove Trainer
      </button>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default TrainerProfile;
