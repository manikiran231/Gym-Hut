import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gymcode, setGymcode] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState(''); // New: user type selected

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      setError('Please select your login type');
      return;
    }

    try {

      const response = await axios.post('http://localhost:8000/api/auth/login', {
        username,
        password,
        gymcode,
        userType,
      });

      const { user } = response.data;
      localStorage.setItem('gymUser', JSON.stringify(user));


      // Navigate based on userType
      if (userType === 'owner') {
        navigate('/owner/dashboard');
      } else if (userType === 'member') {
        navigate('/member/dashboard');
      } else if (userType === 'trainer') {
        navigate('/trainer/dashboard');
      }else{
        setError('Invalid user type');
        return;
      }
    } catch (err) {
        console.error("Login error:", err.response ? err.response.data : err.message);
        setError(err?.response?.data?.error || 'Invalid username, password, or user type');
      }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="login-container">
      <header>
        <h1>Login</h1>
      </header>

      {/* Login Type Selection */}
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

        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="password-input"
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label htmlFor="gymcode">GYM Code</label>
        <div className="gymcode-container">
          <input
            type='text'
            id="gymcode"
            value={gymcode}
            onChange={(e) => setGymcode(e.target.value)}
            placeholder="Enter your gymcode"
            required
            className="gymcode-input"
          />
        </div>

        <div className="forgot">
          <Link to="/forgot">Forgot Password?</Link>
        </div>

        <button type="submit" className="login-button">Sign In</button>

        <div className="signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
