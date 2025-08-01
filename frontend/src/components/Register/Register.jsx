import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [gymname, setGymName] = useState('');
  const [gymAddress, setGymAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      phone,
      username,
      password,
      gymname, 
      gymAddress
    };


    try {
      const response = await axios.post("http://localhost:8000/register", userData);

      if (response.status === 201 && response.data.message === "Gym registration started") {
        toast.success("Registration started", {
          autoClose: 2000,
          onClose: () => navigate("/login"),
        });
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMsg = data.error;

        if (status === 409) {
          toast.error(errorMsg || "Conflict error.");
        } else {
          toast.error(errorMsg || "Server error occurred.");
        }
      } else if (error.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error("Error in request: " + error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <header>
        <h1>Register a New GYM</h1>
      </header>

      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Phone</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <label>Email address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />


        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="password-input"
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

          <label>Gym Name</label>
          <input type="text" value={gymname} onChange={(e) => setGymName(e.target.value)} required />

          <label>Gym Address</label>
          <input type="text" value={gymAddress} onChange={(e) => setGymAddress(e.target.value)} required />
          

        <button type="submit" className="register-button">
          Register
        </button>

        <div className="signup-link">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Register;
