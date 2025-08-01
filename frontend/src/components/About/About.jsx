import React, { useRef, useEffect } from 'react';
import './About.css';
import team1 from '../../assets/yoga.jpg';
import team2 from '../../assets/zumba.jpg';
import team3 from '../../assets/bootcamp.jpg';

function About() {
  const scrollRef = useRef(null); 

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 320,
          behavior: 'smooth',
        });

        const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScrollLeft - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aboutus-container">
      <header>
        <h1 className="mani">About Us</h1>
        <p style={{color:"#dddddd"}}>Your all-in-one platform for gym owners, fitness members, and home workout enthusiasts.</p>
      </header>

      <section>
        <h2>Our Story</h2>
        <p>
          GymHut started with a vision to revolutionize the way fitness is accessed and managed. From enabling gym owners to digitize
          their operations, to empowering individuals with home workouts, we've grown into a one-stop fitness solution.
        </p>
      </section>

      <section>
        <h2>Our Mission</h2>
        <p>
          To make fitness accessible, manageable, and enjoyable for everyone—whether you're a gym owner, a dedicated member, or someone
          working out from home. We combine technology, community, and expert guidance into one dynamic platform.
        </p>
      </section>

      <section className="highlight-sction">
        <h2>Our Goals</h2>
        <ul>
          <li>Help gym owners streamline management and boost productivity.</li>
          <li>Allow members to track progress, schedule sessions, and get live updates.</li>
          <li>Provide free home fitness guidance and workouts for every body type.</li>
        </ul>
      </section>


      <section className="core-team-section">
        <h2>Our Core Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={team1} alt="Manikiran" />
            <h4>Manikiran</h4>
            <p>UI/UX Designer & Frontend Developer</p>
          </div>
          <div className="team-member">
            <img src={team2} alt="Abdullah" />
            <h4>Abdullah</h4>
            <p>Backend Developer & DB Architect</p>
          </div>
          <div className="team-member">
            <img src={team3} alt="Dileep" />
            <h4>Dileep</h4>
            <p>UI/UX Designer & QA Specialist</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-scroll" ref={scrollRef}>
          <div className="testimonial">
            <p>"GymHut helped me manage my gym effortlessly. Tracking payments and members is now a breeze!" — <strong>Ravi Shetty (Gym Owner)</strong></p>
          </div>
          <div className="testimonial">
            <p>"I'm finally able to monitor my progress with visuals and feedback from trainers. Love this app!" — <strong>Priya R (Member)</strong></p>
          </div>
          <div className="testimonial">
            <p>"The home workouts are excellent! It’s like having a trainer with me every day." — <strong>Vikram D (Home User)</strong></p>
          </div>
          <div className="testimonial">
            <p>"Yoga and meditation programs gave me inner peace and flexibility!" — <strong>Anjali Verma</strong></p>
          </div>
          <div className="testimonial">
            <p>"As a trainer, this platform helps me stay organized and connected with clients." — <strong>Karan Kapoor</strong></p>
          </div>
          <div className="testimonial">
            <p>"The user interface is clean, intuitive, and helpful. Great job GymHut!" — <strong>Meena Iyer</strong></p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
