import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
    const navigate = useNavigate();
    const { username, userType } = useParams();


    useEffect(() => {
            
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };
    

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (timeLeft === 0) {
            toast.error("OTP has expired. Please request a new one.");
            return;
        }

        const otpCode = otp.join("");
        const payload = { username, userType, passcode: otpCode, newPassword };

        console.log("Submitting payload:", payload);
        try {
            const res = await axios.post("https://gymhut-backend-sqrx.onrender.com/api/auth/reset-password", payload);
            toast.success(res.data.message || "Password reset successful!");
                setTimeout(() => {
                navigate("/login");
            }, 2000); // wait 2 seconds before navigating

        } catch (err) {
            toast.error(err.response?.data?.error || "Error resetting password");
        }
    };

    return (
        <div className="reset-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter OTP</label>
                <div className="otp-inputs">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                        />
                    ))}
                </div>

                <div className="timer">
                    {timeLeft > 0 ? (
                        <p>OTP expires in: <strong>{formatTime(timeLeft)}</strong></p>
                    ) : (
                        <p className="expired">OTP has expired. Please request a new one.</p>
                    )}
                </div>

                <label>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <label>Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" className="reset-button" disabled={timeLeft === 0}>Reset Password</button>

            </form>
            <ToastContainer />
        </div>
    );
}

export default ResetPassword;
