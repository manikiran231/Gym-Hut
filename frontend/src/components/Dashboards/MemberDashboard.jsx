import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaUser,
  FaBuilding,
  FaChartLine,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaSignOutAlt,
  FaCalendarCheck,
  FaComments,
} from 'react-icons/fa';
import './MemberDashboard.css';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

function MemberDashboard() {
  const navigate = useNavigate();
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('profile');
  const [trainerFeedback, setTrainerFeedback] = useState('');
  const [gymFeedback, setGymFeedback] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("gymUser") || sessionStorage.getItem("gymUser"));
    if (!storedUser?.username || !storedUser?.gymcode) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://gymhut-backend-sqrx.onrender.com/api/member/${storedUser.gymcode}/${storedUser.username}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch member data");

        setData({
          ...data,
          name: data.member.name,
          username: data.member.username,
          age: data.member.age,
          gender: data.member.gender,
          phone: data.member.phone,
          email: data.member.email,
          trainerName: data.trainer.name,
          trainerPhone: data.trainer.phone,
          trainerEmail: data.trainer.email,
          speciality: data.trainer.speciality,
          gymName: data.gym.gymname,
          gymCode: data.gym.gymcode,
          location: data.gym.gymAddress,
          paymentHistory: data.paymentHistory && data.paymentHistory.length > 0
            ? data.paymentHistory
            : [
                { month: 'July 2025', amount: 2500, status: 'Paid' },
                { month: 'June 2025', amount: 2500, status: 'Paid' },
                { month: 'May 2025', amount: 2500, status: 'Pending' }
              ],
          enrollments: data.enrollments || [],
          schedule: data.schedule || [],
          dietSchedule: data.dietSchedule || []
        });
      } catch (err) {
        console.error("❌ Error fetching member data:", err);
        toast.error("Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    toast.success('You have been logged out successfully!', { autoClose: 2000 });
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const handleFeedbackSubmit = (type) => {
    if (type === 'trainer') {
      if (!trainerFeedback.trim()) return toast.error('Trainer feedback cannot be empty!', { autoClose: 2000 });
      toast.success(`Trainer feedback submitted: ${trainerFeedback}`, { autoClose: 2000 });
      setTrainerFeedback('');
    } else if (type === 'gym') {
      if (!gymFeedback.trim()) return toast.error('Gym feedback cannot be empty!', { autoClose: 2000 });
      toast.success(`Gym feedback submitted: ${gymFeedback}`, { autoClose: 2000 });
      setGymFeedback('');
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const renderContent = () => {
    if (loading) return <div className="content">Loading...</div>;
    if (!Data) return <div className="content">Could not load data.</div>;

    switch (selected) {
      case 'profile':
        return (
          <div className="content profile-section">
            <h2><FaUser /> Welcome to your personal space, {Data.name}!</h2>
            <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                {getInitials(Data.name)}
              </div>
              <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{Data.name}</h3>
            </div>
            <ul className="profile-details">
              <li><strong>Username:</strong> {Data.username}</li>
              <li><strong>Age:</strong> {Data.age}</li>
              <li><strong>Gender:</strong> {Data.gender}</li>
              <li><strong>Phone:</strong> {Data.phone}</li>
              <li><strong>Email:</strong> {Data.email}</li>
            </ul>
            <h3>Enrollments</h3>
            <div className="enrollment-cards">
              {Data.enrollments.length > 0 ? (
                Data.enrollments.map((course, i) => (
                  <div className="card" key={i}>{course}</div>
                ))
              ) : (
                <p>No enrollments found.</p>
              )}
            </div>
          </div>
        );

      case 'gym':
        return (
          <div className="content gym-section">
            <h2><FaBuilding /> Gym & Trainer</h2>
            <div className="box">
              <h3>Gym Info</h3>
              <p><strong>Name:</strong> {Data.gymName}</p>
              <p><strong>Code:</strong> {Data.gymCode}</p>
              <p><strong>Location:</strong> {Data.location}</p>
            </div>
            <div className="box">
              <h3>Trainer Info</h3>
              <p><strong>Name:</strong> {Data.trainerName}</p>
              <p><strong>Specialization:</strong> {Data.speciality}</p>
              <p><strong>Contact:</strong> {Data.trainerPhone}</p>
              <p><strong>Email:</strong> {Data.trainerEmail}</p>
            </div>
          </div>
        );

      case 'progress':
        const barData = {
          labels: ['Start Weight', 'Current Weight'],
          datasets: [{
            label: 'Weight (kg)',
            data: [Data.weightStart, Data.weightNow],
            backgroundColor: ['#42a5f5', '#66bb6a'],
            borderRadius: 6,
            barThickness: 60,
          }]
        };

        const barOptions = {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Weight Transformation' }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 5 }
            }
          }
        };

        return (
          <div className="content progress-section">
            <h2><FaChartLine /> Progress</h2>
            <div className="chart-container">
              <Bar data={barData} options={barOptions} />
            </div>
            <ul>
              <li><strong>Body Fat:</strong> {Data.bodyFat}%</li>
              <li><strong>Measurements:</strong> {Data.measurements}</li>
              <li><strong>Notes:</strong> {Data.transformationNotes}</li>
            </ul>
          </div>
        );

      case 'payments':
        return (
          <div className="content-payments-section" style={{padding: '20px'}}>
            <h2><FaMoneyCheckAlt /> Payments</h2>
            <p style={{color:'black'}} ><strong>Current Status:</strong> {Data.paymentStatus || 'Active'}</p>
            <p style={{color:'black'}} ><strong>Next Due:</strong> {Data.nextDue || 'August 2025'}</p>
            <h3 style={{color:'black'}} >Payment History</h3>
            <ul>
              {Data.paymentHistory.map((p, i) => (
                <li style={{color:'black'}} key={i}>{p.month}: ₹{p.amount} [{p.status}]</li>
              ))}
            </ul>
          </div>
        );

      case 'schedule':
        return (
          <div className="content">
            <h2><FaCalendarAlt /> Schedule</h2>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Opening Time</th>
                  <th>Shifts</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Data.schedule.length > 0 ? (
                  Data.schedule.map((s, i) => (
                    <tr key={i}>
                      <td>{s.day}</td>
                      <td>{s.open} - {s.close}</td>
                      <td>Morning & Evening</td>
                      <td>{s.open && s.close ? 'Open' : 'Closed'}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr><td>Mon - Sat</td><td>6 AM - 9 PM</td><td>Morning & Evening</td><td>Open</td></tr>
                    <tr><td>Sunday</td><td>-</td><td>-</td><td>Closed</td></tr>
                  </>
                )}
              </tbody>
            </table>

            <h3 style={{ marginTop: '30px' }}>Dietician Timings</h3>
            {Data.dietSchedule.length > 0 ? (
              <table className="schedule-table">
                <thead>
                  <tr><th>Day</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {Data.dietSchedule.map((d, i) => (
                    <tr key={i}><td>{d.day}</td><td>{d.time}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No dietician schedule available.</p>
            )}
          </div>
        );

      case 'feedback':
        return (
          <div className="content feedback-section">
            <h2><FaComments /> Feedback</h2>
            <div className="box">
              <h3>Trainer Feedback</h3>
              <textarea
                value={trainerFeedback}
                onChange={(e) => setTrainerFeedback(e.target.value)}
                rows={4}
                placeholder={`Write feedback for ${Data.trainerName}...`}
                className="feedback-textarea"
              />
              <button className="action-button" onClick={() => handleFeedbackSubmit('trainer')}>
                Submit Trainer Feedback
              </button>
            </div>
            <div className="box">
              <h3>Gym Feedback</h3>
              <textarea
                value={gymFeedback}
                onChange={(e) => setGymFeedback(e.target.value)}
                rows={4}
                placeholder={`Write feedback for ${Data.gymName}...`}
                className="feedback-textarea"
              />
              <button className="action-button" onClick={() => handleFeedbackSubmit('gym')}>
                Submit Gym Feedback
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="member-dashboard">
      <aside className="sidebar">
        <div className="logo">Member Dashboard</div>
        <nav>
          <button className={selected === 'profile' ? 'active' : ''} onClick={() => setSelected('profile')}><FaUser /> Profile</button>
          <button className={selected === 'gym' ? 'active' : ''} onClick={() => setSelected('gym')}><FaBuilding /> Gym & Trainer</button>
          <button className={selected === 'progress' ? 'active' : ''} onClick={() => setSelected('progress')}><FaChartLine /> Progress</button>
          <button className={selected === 'payments' ? 'active' : ''} onClick={() => setSelected('payments')}><FaMoneyCheckAlt /> Payments</button>
          <button className={selected === 'schedule' ? 'active' : ''} onClick={() => setSelected('schedule')}><FaCalendarAlt /> Schedule</button>
          <button className={selected === 'feedback' ? 'active' : ''} onClick={() => setSelected('feedback')}><FaComments /> Feedback</button>
          <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </nav>
      </aside>
      {renderContent()}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default MemberDashboard;
