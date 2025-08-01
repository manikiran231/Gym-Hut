import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsBoxArrowRight } from 'react-icons/bs';
import cycling from '../../assets/cycling.jpg';
import fitnessTrack from '../../assets/fitnesstrack.jpg';
import darkness from '../../assets/background.jpg';
import yogaMeditation from '../../assets/yoga.jpg';
import buildingBody from '../../assets/bodybuilding.jpg';
import fitnessFreak from '../../assets/fitnessfreak.jpg';
import gal1 from '../../assets/gal1.jpg';
import gal2 from '../../assets/gal2.jpg';
import gal3 from '../../assets/gal3.jpg';
import gal4 from '../../assets/gal4.jpg';
import weightLifting from '../../assets/weightlifting.jpg';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 style={{ color: 'white' }}>GymHut</h1>
        <p style={{ color: 'white' }}>One Platform. Three Purposes. Unlimited Fitness!</p>
        <button className="join_us_button" onClick={() => navigate("/login")}>
          <span>Join Us Now &nbsp;</span>
          <BsBoxArrowRight />
        </button>
      </header>

      <section className="home-cards">
        <div className="card">
          <h3>For Gym Owners</h3>
          <p>Register your gym and manage members, trainers, payments, and equipment seamlessly through a dedicated dashboard.</p>
        </div>
        <div className="card">
          <h3>For Gym Members</h3>
          <p>Track progress, receive real-time updates, manage schedules, provide trainer feedback, and view personalized fitness stats.</p>
        </div>
        <div className="card">
          <h3>For Fitness Enthusiasts</h3>
          <p>Access home workout guides, diet plans, and participate in free fitness sessions—all from the comfort of your home.</p>
        </div>
      </section>

      <section className="home-advertisement">
        <h2 style={{ color: 'white' }}>Unleash Your Potential</h2>
        <p style={{ color: 'white' }}>Register today and enjoy a 25% winter discount on premium features!</p>
      </section>

      <section className="home-services">
        <h2 style={{ color: 'white' }}>Our Services</h2>
        <p style={{ color: 'white' }}>For all levels and lifestyles – we have something for everyone.</p>
        <div className="service-cards">
          <div className="service-card">
            <img src={cycling} alt="Cycling" />
            <h3>Cycling</h3>
            <p>Improve cardiovascular fitness with expert-led indoor cycling programs.</p>
          </div>
          <div className="service-card">
            <img src={fitnessTrack} alt="Fitness Track" />
            <h3>Fitness Tracker</h3>
            <p>Monitor your fitness stats, weight progress, and workout achievements in real-time.</p>
          </div>
          <div className="service-card">
            <img src={weightLifting} alt="Weight Lifting" />
            <h3>Strength Training</h3>
            <p>Structured muscle-building plans and professional trainer guidance.</p>
          </div>
          <div className="service-card">
            <img src={yogaMeditation} alt="Yoga" />
            <h3>Yoga & Meditation</h3>
            <p>Balance body and mind with guided yoga and mindfulness practices.</p>
          </div>
          <div className="service-card">
            <img src={buildingBody} alt="Bodybuilding" />
            <h3>Body Sculpting</h3>
            <p>Advanced programs designed for hypertrophy and aesthetic transformation.</p>
          </div>
          <div className="service-card">
            <img src={fitnessFreak} alt="Fitness Freak" />
            <h3>Home Workout Guides</h3>
            <p>Free video-based training routines to stay active from home, no equipment needed.</p>
          </div>
        </div>
      </section>

      <section className="home-gallery">
        <h2 style={{ color: 'white' }}>Gallery</h2>
        <p style={{ color: 'white' }}>A glimpse into the world of GymHut: Members, Facilities, and Events</p>
        <div className="gallery-images">
          <img src={gal1} alt="Gallery Image 1" />
          <img src={gal2} alt="Gallery Image 2" />
          <img src={gal3} alt="Gallery Image 3" />
          <img src={gal4} alt="Gallery Image 4" />
        </div>
      </section>

      <section className="home-subscribe">
        <h2 style={{ color: 'white' }}>Want to Get Started?</h2>
        <p style={{ color: 'white' }}>Subscribe to our newsletter for updates, tips, and fitness plans.</p>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </div>
  );
}

export default Home;
