import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Admin from './components/Admin/Admin'
import Forgot from './components/Forgot/Forgot'
import About from './components/About/About'
import Courses from './components/Courses/Courses'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import ResetPassword from './components/Reset/ResetPassword'
import GymOwnerDashboard from './components/Dashboards/GymOwnerDashboard'
import MemberDashboard from './components/Dashboards/MemberDashboard'
import FeaturedCourses from './components/FeaturedCourses/FeaturedCourses'
import ContactUs from './components/ContactUs/ContactUs'
import MemberProfile from './components/Dashboards/AddOns/MemberProfile'
import TrainerDashboard from './components/Dashboards/TrainerDashboard'
import AdminDashboard from './components/Dashboards/AdminDashboard'
function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about-us" element={<About />} />
        <Route path="/all-courses" element={<Courses />} />
        <Route path="/featured-courses" element={<FeaturedCourses />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:username" element={<ResetPassword />} />
        <Route path="/owner/dashboard" element={<GymOwnerDashboard />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/member/:id" element={<MemberProfile />} />
        <Route path="*" element={<Home />} />
      </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
