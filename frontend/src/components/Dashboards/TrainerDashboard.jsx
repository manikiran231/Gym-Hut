import React, { useState, useEffect } from 'react';
import {
  FaUser, FaUsers, FaChartLine, FaCalendarAlt, FaSignOutAlt, FaEdit, FaEye
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './TrainerDashboard.css';

function TrainerDashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('profile');
  const [trainerData, setTrainerData] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ weightNow: '', bodyFat: '', transformationNotes: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("gymUser") || sessionStorage.getItem("gymUser"));
    if (!storedUser?.username || !storedUser?.gymcode) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
      return;
    }

    const fetchTrainerProfile = async () => {
      try {
        const res = await fetch(`https://gymhut-backend-sqrx.onrender.com/api/trainer/${storedUser.gymcode}/${storedUser.username}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch trainer data");

        setTrainerData({
          ...data,
          assignedMembers: data.assignedMembers || [],
          schedule: data.schedule || []
        });
      } catch (err) {
        console.error("❌ Error fetching trainer data:", err);
        toast.error("Failed to load your profile. Please try again.");
      }
    };

    fetchTrainerProfile();
  }, []);



  const handleLogout = () => {
    toast.success('Logged out successfully!', { autoClose: 2000 });
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    const m = trainerData.assignedMembers[index];
    setEditForm({
      weightNow: m.weightNow,
      bodyFat: m.bodyFat,
      transformationNotes: m.transformationNotes
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProgress = () => {
    const updated = [...trainerData.assignedMembers];
    updated[editingIndex] = {
      ...updated[editingIndex],
      ...editForm
    };
    setTrainerData({ ...trainerData, assignedMembers: updated });
    setEditingIndex(null);
    toast.success('Progress updated!');
  };

  const renderContent = () => {
    if (!trainerData) return <div className="content">Loading...</div>;

    switch (selected) {
      case 'profile':
        return (
          <div className="content profile-section">
            <h2><FaUser /> Trainer Profile</h2>
            <ul className="profile-details">
              <li><strong>Name:</strong> {trainerData.name}</li>
              <li><strong>Username:</strong> {trainerData.username}</li>
              <li><strong>Email:</strong> {trainerData.email}</li>
              <li><strong>Phone:</strong> {trainerData.phone}</li>
              <li><strong>Specialization:</strong> {trainerData.specialization}</li>
            </ul>
          </div>
        );

      case 'members':
        return (
          <div className="content members-section">
            <h2><FaUsers /> Assigned Members</h2>
            <div className="member-cards">
              {trainerData.assignedMembers.map((m, i) => (
                <div key={i} className="box">
                  <h3>{m.name}</h3>
                  <p><strong>Username:</strong> {m.username}</p>
                  <p><strong>Plan:</strong> {m.plan}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="action-button" onClick={() => setViewingIndex(i)}><FaEye /> View</button>
                    <button className="action-button" onClick={() => openEditModal(i)}><FaEdit /> Update Progress</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {editingIndex !== null && (
              <div className="modal-backdrop" >
                <div className="modal"style={{paddingRight:'20px'}}>
                  <h3>Edit Progress - {trainerData.assignedMembers[editingIndex].name}</h3>
                  <label>Weight (kg):</label>
                  <input type="number" name="weightNow" value={editForm.weightNow} onChange={handleEditChange} />
                  <label>Body Fat (%):</label>
                  <input type="number" name="bodyFat" value={editForm.bodyFat} onChange={handleEditChange} />
                  <label>Notes:</label>
                  <textarea name="transformationNotes" value={editForm.transformationNotes} onChange={handleEditChange} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button className="action-button" onClick={saveProgress}>Save</button>
                    <button className="action-button logout" onClick={() => setEditingIndex(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* View Modal */}
            {viewingIndex !== null && (
              <div className="modal-backdrop">
                <div className="modal">
                  <h3>Member Profile - {trainerData.assignedMembers[viewingIndex].name}</h3>
                  <p><strong>Username:</strong> {trainerData.assignedMembers[viewingIndex].username}</p>
                  <p><strong>Plan:</strong> {trainerData.assignedMembers[viewingIndex].plan}</p>
                  <p><strong>Weight:</strong> {trainerData.assignedMembers[viewingIndex].weightNow} kg</p>
                  <p><strong>Body Fat:</strong> {trainerData.assignedMembers[viewingIndex].bodyFat} %</p>
                  <p><strong>Progress Notes:</strong><br />{trainerData.assignedMembers[viewingIndex].transformationNotes}</p>
                  <div style={{ textAlign: 'right', marginTop: '12px' }}>
                    <button className="action-button logout" onClick={() => setViewingIndex(null)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'progress':
        return (
          <div className="content progress-section">
            <h2><FaChartLine /> Student Progress Overview</h2>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Weight (kg)</th>
                  <th>Body Fat (%)</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {trainerData.assignedMembers.map((m, i) => (
                  <tr key={i}>
                    <td>{m.name}</td>
                    <td>{m.username}</td>
                    <td>{m.weightNow}</td>
                    <td>{m.bodyFat}</td>
                    <td>{m.transformationNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'schedule':
        return (
          <div className="content schedule-section">
            <h2><FaCalendarAlt /> Weekly Schedule</h2>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(trainerData.schedule) && trainerData.schedule.length > 0 ? (
                    trainerData.schedule.map((s, i) => (
                      <tr key={i}>
                        <td>{s.day}</td>
                        <td>{s.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No schedule available</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="trainer-dashboard">
      <aside className="sidebar">
        <div className="logo">Trainer Dashboard</div>
        <nav>
          <button className={selected === 'profile' ? 'active' : ''} onClick={() => setSelected('profile')}><FaUser /> Profile</button>
          <button className={selected === 'members' ? 'active' : ''} onClick={() => setSelected('members')}><FaUsers /> Members</button>
          <button className={selected === 'progress' ? 'active' : ''} onClick={() => setSelected('progress')}><FaChartLine /> Progress</button>
          <button className={selected === 'schedule' ? 'active' : ''} onClick={() => setSelected('schedule')}><FaCalendarAlt /> Schedule</button>
          <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </nav>
      </aside>
      {renderContent()}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default TrainerDashboard;
