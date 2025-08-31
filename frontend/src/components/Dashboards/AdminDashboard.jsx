import React, { useState, useEffect } from 'react';
import {
  FaHome, FaCheck, FaTimes, FaFlag, FaSignOutAlt, FaUserShield,
  FaHourglassHalf, FaThumbsUp, FaBan
} from 'react-icons/fa';
import './AdminDashboard.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("home");
  const [gyms, setGyms] = useState([]);

  // 🟡 Load real gym data from backend
  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const res = await fetch("https://gymhut-backend-sqrx.onrender.com/api/gyms"); // update URL if hosted
      const data = await res.json();
      setGyms(data);
    } catch (err) {
      console.error("Failed to fetch gyms:", err);
    }
  };

  const handleLogout = () => {
    toast.success('You have been logged out successfully!', { autoClose: 2000 });
    localStorage.clear();
    sessionStorage.clear();
    navigate('/admin');
  };

  const handleApprove = async (gymcode) => {
    const confirm = window.confirm("Are you sure you want to approve this gym?");
    if (!confirm) return;

    try {
      await fetch(`https://gymhut-backend-sqrx.onrender.com/api/gyms/approve/${gymcode}`, {
        method: "PATCH"
      });
      fetchGyms(); // Refresh data
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (gymcode) => {
    const confirm = window.confirm("Reject this application? This action cannot be undone.");
    if (!confirm) return;

    try {
      await fetch(`https://gymhut-backend-sqrx.onrender.com/api/gyms/reject/${gymcode}`, {
        method: "DELETE"
      });
      fetchGyms(); // Refresh data
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const handleFlag = (gymcode) => {
    setGyms(gyms.map(gym =>
      gym._id === gymcode ? { ...gym, status: "flagged" } : gym
    ));
    // Optional: add endpoint to persist flagging in DB
  };

  const renderStatusBadge = (status) => {
    const color = {
      pending: 'orange',
      approved: 'green',
      flagged: 'red'
    }[status] || 'gray';

    return <span className={`badge ${color}`}>{status?.toUpperCase()}</span>;
  };

  const pendingGyms = gyms.filter(g => g.status === "pending");
  const approvedGyms = gyms.filter(g => g.status === "approved");
  const flaggedGyms = gyms.filter(g => g.status === "flagged");

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="logo">🏋️‍♂️ GymHut Admin</div>
        <nav>
          <button onClick={() => setSelectedTab("home")} className={selectedTab === "home" ? "active" : ""}>
            <FaHome /> Dashboard
          </button>
          <button onClick={() => setSelectedTab("manageGyms")} className={selectedTab === "manageGyms" ? "active" : ""}>
            <FaUserShield /> Manage Gyms
          </button>
          <button onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="content">
        {selectedTab === "home" && (
          <>
            <h2>Welcome, Admin</h2>
            <p>Here's a summary of current gym registration activity:</p>

            <div className="stats">
              <div className="stat-card orange">
                <FaHourglassHalf />
                <div>
                  <h3>{pendingGyms.length}</h3>
                  <p>Pending Applications</p>
                </div>
              </div>
              <div className="stat-card green">
                <FaThumbsUp />
                <div>
                  <h3>{approvedGyms.length}</h3>
                  <p>Approved Gyms</p>
                </div>
              </div>
              <div className="stat-card red">
                <FaBan />
                <div>
                  <h3>{flaggedGyms.length}</h3>
                  <p>Flagged Gyms</p>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === "manageGyms" && (
          <>
            <h2>Manage Gym Applications</h2>
            <div className="gym-list">
              {gyms.length === 0 ? (
                <p>No gym data available.</p>
              ) : (
                gyms.map(gym => (
                  <div className="gym-card" key={gym.gymcode}>
                    <h3>{gym.gymname}</h3>
                    <p><strong>Owner:</strong> {gym.owner}</p>
                    <p><strong>Location:</strong> {gym.gymAddress}</p>
                    <p><strong>Email:</strong> {gym.email}</p>
                    <p><strong>Phone:</strong> {gym.phone}</p>
                    <p><strong>Status:</strong> {renderStatusBadge(gym.status)}</p>

                    <div className="gym-actions">
                      {gym.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(gym.gymcode)} className="btn green">
                            <FaCheck /> Approve
                          </button>
                          <button onClick={() => handleReject(gym.gymcode)} className="btn red">
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}
                      {gym.status !== "flagged" && (
                        <button onClick={() => handleFlag(gym.gymcode)} className="btn orange">
                          <FaFlag /> Flag
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
