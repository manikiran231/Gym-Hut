import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Forgot.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forgot() {
  const [username, setUsername] = useState('');
  const [gymcode, setGymcode] = useState('');
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType) {
      setError('Please select user type');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/forgot-password', {
        username,
        gymcode,
        userType,
      });

      setMessage(response.data.message || 'Check your email for reset instructions.');
      toast.success("OTP sent to your email!");
      setTimeout(() => {
        navigate(`/reset-password/${userType}/${username}`);
      }, 2000);
      setError('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setMessage('');
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="forgot-container">
        <header>
          <h1>Forgot Password</h1>
        </header>

        {/* User Type Selection */}
        <div className="user-type-buttons">
          <button
            type="button"
            className={userType === 'owner' ? 'active' : ''}
            onClick={() => setUserType('owner')}
          >
            Gym Owner
          </button>
          <button
            type="button"
            className={userType === 'member' ? 'active' : ''}
            onClick={() => setUserType('member')}
          >
            Gym Member
          </button>
          <button
            type="button"
            className={userType === 'trainer' ? 'active' : ''}
            onClick={() => setUserType('trainer')}
          >
            Gym Trainer
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <label htmlFor="gymcode">GYMCODE</label>
          <input
            type="text"
            id="gymcode"
            value={gymcode}
            onChange={(e) => setGymcode(e.target.value)}
            placeholder="Enter your gymcode"
            required
          />

          <button type="submit" className="forgot-button">Send Passcode</button>
        </form>
        <ToastContainer />
      </div>
      <div className="empty" style={{ height: "12.25rem" }}></div>
    </>
  );
}

export default Forgot;
