import React, { useState } from 'react';
import './TrainerForm.css';
import { ToastContainer, toast } from 'react-toastify';

function AddTrainerForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    specialty: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("gymUser") || sessionStorage.getItem("gymUser"));
    const { name, email, phone, username, password, specialty } = formData;
    

    if (!name || !username || !specialty || !phone || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    try{
      const res = await fetch("http://localhost:8000/api/trainers/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            username,
            password,
            speciality: specialty, // notice spelling
            gymcode: storedUser.gymcode
      }),
        });
      const result = await res.json();
      if (res.ok) {
        toast.success("Trainer added!");
        onSubmit(formData);
      }else toast.error(result.error || "Failed to add");
    } catch (err) {
        console.error(err);
        toast.error("Error adding member");
      }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '400px', maxHeight: '90vh', overflow: 'hidden' }}>
        <h2>Register New Trainer</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            paddingRight: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <label>
            Name:
            <input name="name" style={{maxWidth:'90%'}} value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Username:
            <input name="username"style={{maxWidth:'90%'}}  value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" style={{maxWidth:'90%'}} name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <label>
            Specialty:
            <input name="specialty" style={{maxWidth:'90%'}} value={formData.specialty} onChange={handleChange} required />
          </label>
          <label>
            Phone:
            <input name="phone"style={{maxWidth:'90%'}}  value={formData.phone} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" style={{maxWidth:'90%'}} value={formData.email} onChange={handleChange} required />
          </label>
          <div className="modal-buttons">
            <button type="submit">Register</button>
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AddTrainerForm;
