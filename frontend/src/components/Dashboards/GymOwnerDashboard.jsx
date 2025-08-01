// GymOwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import MemberProfile from './AddOns/MemberProfile';
import TrainerProfile from './AddOns/TrainerProfile';
import RegisterTrainerForm from './AddOns/AddTrainerForm';
import {
  FaEye, FaEyeSlash, FaUsers, FaChalkboardTeacher, FaMoneyCheckAlt,
  FaCalendarAlt, FaDumbbell, FaChartLine, FaSignOutAlt, FaWeightHanging,
  FaBicycle, FaHeartbeat
} from 'react-icons/fa';
import './GymOwnerDashboad.css';

function GymOwnerDashboard() {
  const [gymData, setGymData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('overview');
  const [memberForm, setMemberForm] = useState({
    name: "", email: "", phone: "", username: "", password: "",
    age: "", gender: "", membership: "", trainer: ""
  });
  const [viewMemberUsername, setViewMemberUsername] = useState(null);
  const [viewTrainer, setViewTrainer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEquipForm, setShowEquipForm] = useState(false);
  const [equipForm, setEquipForm] = useState({ name: "", quantity: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGymData = async () => {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('gymUser'));
      if (!storedUser || !storedUser.gymcode || !storedUser.username) {
        window.location.href = "/login";
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/api/gym/${storedUser.gymcode}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch gym data");
        setGymData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGymData();
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleAddMember = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("gymUser") || sessionStorage.getItem("gymUser"));
    const { name, email, phone, username, password, age, gender, membership, trainer } = memberForm;

    if (!name || !email || !phone || !username || !password || !age || !gender || !membership || !trainer) {
      return toast.error("All fields required");
    }
    if (age < 18) {
      return toast.error("Age must be 18 or older");
    }

    try {
      const res = await fetch("http://localhost:8000/api/members/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberForm, gymcode: storedUser.gymcode }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Member added!");
        setGymData({
          ...gymData,
          members: [...gymData.members, {
            id: result.memberId || Date.now(),
            ...memberForm,
            status: "Pending"
          }]
        });
        setMemberForm({
          name: "", email: "", phone: "", username: "", password: "",
          age: "", gender: "", membership: "", trainer: ""
        });
      } else toast.error(result.error || "Failed to add");
    } catch (err) {
      console.error(err);
      toast.error("Error adding member");
    }
  };

  const handleRemoveMember = async (username) => {
    if (!window.confirm(`Remove member "${username}"?`)) return;
    const storedUser = JSON.parse(localStorage.getItem("gymUser") || sessionStorage.getItem("gymUser"));
    try {
      const res = await fetch(`http://localhost:8000/api/members/delete/${storedUser.gymcode}/${username}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Member removed");
        setGymData({
          ...gymData,
          members: gymData.members.filter(m => m.username !== username)
        });
      } else toast.error(result.error);
    } catch (err) {
      toast.error("Error removing member");
    }
  };

  const handleRemoveTrainer = async (id) => {
    if (window.confirm('Remove this trainer?')) {
      setGymData({ ...gymData, trainers: gymData.trainers.filter(t => t.id !== id) });
      setViewTrainer(null);
    }
  };

  const handleRegisterTrainer = (newTrainer) => {

    setGymData({
      ...gymData,
      trainers: [...gymData.trainers, { id: Date.now(), ...newTrainer, comments: [] }]
    });
    setShowForm(false);
  };

  const handleMarkPaid = async (username) => {
    try {
      const res = await fetch(`http://localhost:8000/api/members/update-status/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active" })
      });
      const result = await res.json();
      if (res.ok) {
        setGymData({
          ...gymData,
          members: gymData.members.map(m =>
            m.username === username ? { ...m, status: "Active" } : m
          )
        });
        toast.success("Marked as paid");
      } else toast.error(result.error || "Update failed");
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    setGymData({
      ...gymData,
      equipmentList: [...gymData.equipmentList, equipForm]
    });
    toast.success("Thanks for ordering! COD preferred.");
    setEquipForm({ name: "", quantity: "" });
    setShowEquipForm(false);
  };

  const handleLogout = () => {
    toast.success('Logged out!');
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const renderContent = () => {
    if (loading) return <div className="content">Loading...</div>;
    if (!gymData) return <div className="content">Failed to load data.</div>;

    switch (selected) {
      case 'overview':
        return (
          <div className="content">
            <h2>Gym Overview</h2>
            <div className="overview-list">
              <div><strong>Name:</strong> {gymData.name}</div>
              <div><strong>Code:</strong> {gymData.code}</div>
              <div><strong>Location:</strong> {gymData.location}</div>
              <div><strong>Status:</strong> {gymData.status}</div>
              <div><strong>Open Hours:</strong> {gymData.openHours}</div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="content">
            <h2>Members</h2>
            {viewMemberUsername && (
              <MemberProfile
                member={gymData.members.find(m => m.username === viewMemberUsername)}
                onBack={() => setViewMemberUsername(null)}
              />
            )}
            <div className="member-cards-container">
              {gymData.members.map(member => (
                <div key={member.username} className="member-card">
                  <h3>{member.name}</h3>
                  <p><strong>Plan:</strong> {member.membership}</p>
                  <p><strong>Status:</strong> {member.status}</p>
                  <button onClick={() => setViewMemberUsername(member.username)}>View Profile</button>
                  <button className="remove-btn" onClick={() => handleRemoveMember(member.username)}>Remove</button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddMember} className="add-member-form">
              <h3>Add New Member</h3>
              <input placeholder="Name" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
              <input placeholder="Email" type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
              <input placeholder="Phone" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} />
              <input placeholder="Username" value={memberForm.username} onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })} />
              <div className="password-container" style={{ width: '100%' }}>
                <input placeholder="Password" type={showPassword ? "text" : "password"} value={memberForm.password} onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })} />
                <span className="eye-icon" onClick={togglePasswordVisibility}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              <input className='Age' type='number' placeholder="Age" value={memberForm.age} onChange={(e) => setMemberForm({ ...memberForm, age: e.target.value })} />
              <select style={{ width: '100%', marginBottom: '20px' }} value={memberForm.gender} onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}>
                <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
              <select style={{ width: '100%', marginBottom: '20px' }} value={memberForm.membership} onChange={(e) => setMemberForm({ ...memberForm, membership: e.target.value })}>
                <option value="">Membership</option><option>Normal</option><option>Premium</option>
              </select>
              <select required={false} style={{ width: '100%', marginBottom: '20px' }} value={memberForm.trainer} onChange={(e) => setMemberForm({ ...memberForm, trainer: e.target.value })}>
                <option value="">Assign Trainer</option>
                {gymData.trainers.length === 0 ? <option >No trainers available</option> :
                  gymData.trainers.map(t => <option key={t.id}>{t.name}</option>)}
              </select>
              <button type="submit">Add Member</button>
            </form>
          </div>
        );

      case 'trainers':
        return (
          <div className="content">
            <h2>Trainers</h2>
            {viewTrainer ? (
              <TrainerProfile trainer={viewTrainer} onBack={() => setViewTrainer(null)} onRemove={handleRemoveTrainer} />
            ) : (
              <>
                {gymData.trainers.length === 0 ? (
                  <p>No trainers as of now.</p>
                ) : (
                  <div className="trainer-cards-container">
                    {gymData.trainers.map(trainer => (
                      <div className="trainer-card" key={trainer.id}>
                        <h3>{trainer.name}</h3>
                        <p><strong>Username:</strong> {trainer.username}</p>
                        <p><strong>Specialty:</strong> {trainer.specialty}</p>
                        <p><strong>Phone:</strong> {trainer.phone}</p>
                        <p><strong>Email:</strong> {trainer.email}</p>
                        <button onClick={() => setViewTrainer({
                          ...trainer,
                          assignedMembers: gymData.members.filter(m => m.trainer === trainer.username),
                          comments: trainer.comments || []
                        })}>View Profile</button>
                      </div>
                    ))}
                  </div>
                )}
                {showForm && <RegisterTrainerForm onSubmit={handleRegisterTrainer} onCancel={() => setShowForm(false)} />}
                <button onClick={() => setShowForm(true)}>Register New Trainer</button>
              </>
            )}
          </div>
        );

      case 'payments':
        return (
          <div className="content">
            <h2>Payments</h2>
            <ul>
              {gymData.members.map(m => (
                <li key={m.username}>
                  {m.name}: {m.status === 'Active' ? '✅ Paid' : '❌ Not Paid'}
                  {m.status !== 'Active' && (
                    <button style={{ marginLeft: '30px' }} onClick={() => handleMarkPaid(m.username)}>Mark as Paid</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'schedule':
        return (
          <div className="content">
            <h2>Schedule</h2>
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
                <tr>
                  <td>Mon - Sat</td>
                  <td>{gymData.openHours}</td>
                  <td>Morning & Evening</td>
                  <td>Open</td>
                </tr>
                <tr>
                  <td>Sunday</td>
                  <td>-</td>
                  <td>-</td>
                  <td>Closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'equipment':
        return (
          <div className="content">
            <h2>Equipment</h2>
            <div className="equipment-cards-container">
              {gymData.equipmentList.map((e, i) => (
                <div className="equipment-card" key={i}>
                  <div className="icon">{e.name.toLowerCase().includes('bike') ? <FaBicycle /> : e.name.toLowerCase().includes('dumbbell') ? <FaWeightHanging /> : <FaHeartbeat />}</div>
                  <h4>{e.name}</h4>
                  <p><strong>Quantity:</strong> {e.quantity}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowEquipForm(true)}>Add More Equipment</button>
            {showEquipForm && (
              <form onSubmit={handleAddEquipment}>
                <select value={equipForm.name} onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })}>
                  <option value="">Select Equipment</option>
                  <option>Dumbbell</option>
                  <option>Treadmill</option>
                  <option>Bike</option>
                  <option>Bench Press</option>
                  <option>Rowing Machine</option>
                  <option>Elliptical</option>
                  <option>Barbell</option>
                  <option>Pull-up Bar</option>
                  <option>Kettlebell</option>
                  <option>Leg Press</option>
                  <option>Smith Machine</option>
                </select>

                <input type="number" value={equipForm.quantity} onChange={(e) => setEquipForm({ ...equipForm, quantity: e.target.value })} placeholder="Quantity" />
                <button type="submit">Order</button>
              </form>
            )}
          </div>
        );

      default:
        return <div className="content">Select a tab</div>;
    }
  };

  return (
    <div className="owner-dashboard">
      <aside className="sidebar">
        <div className="logo">Gym Admin</div>
        <nav>
          <button className={selected === 'overview' ? 'active' : ''} onClick={() => setSelected('overview')}><FaChartLine /> Overview</button>
          <button className={selected === 'members' ? 'active' : ''} onClick={() => setSelected('members')}><FaUsers /> Members</button>
          <button className={selected === 'trainers' ? 'active' : ''} onClick={() => setSelected('trainers')}><FaChalkboardTeacher /> Trainers</button>
          <button className={selected === 'payments' ? 'active' : ''} onClick={() => setSelected('payments')}><FaMoneyCheckAlt /> Payments</button>
          <button className={selected === 'schedule' ? 'active' : ''} onClick={() => setSelected('schedule')}><FaCalendarAlt /> Schedule</button>
          <button className={selected === 'equipment' ? 'active' : ''} onClick={() => setSelected('equipment')}><FaDumbbell /> Equipment</button>
          <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </nav>
      </aside>
      {renderContent()}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default GymOwnerDashboard;
