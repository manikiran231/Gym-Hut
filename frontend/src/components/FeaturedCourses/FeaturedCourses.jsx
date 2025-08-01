import React, { useEffect, useState } from 'react';
import './Courses.css';
import pilates from '../../assets/pilates.jpg';
import yoga from '../../assets/yoga.jpg';
import zumba from '../../assets/zumba.jpg';
import hiit from '../../assets/highintensity.jpg';
import kickboxing from '../../assets/kickboxing.jpg';
import bootcamp from '../../assets/bootcamp.jpg';
import waterAerobics from '../../assets/wateraerobics.jpg';
import circuitTraining from '../../assets/circuittraining.jpg';

function FeaturedCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Simulated data from API
    const courseData = [
      {
        _id: '1',
        name: 'Pilates',
        description: 'Pilates focuses on core strength, flexibility, and overall body alignment.',
        features: [
          'Enhances core muscle strength, improving posture and stability.',
          'Increases flexibility and joint mobility.',
          'Promotes muscle endurance and overall body toning.',
          'Reduces the risk of injury by balancing muscular strength.',
          'Supports rehabilitation from injuries by emphasizing controlled movements.'
        ],
        image: pilates
      },
      {
        _id: '2',
        name: 'Yoga',
        description: 'Yoga combines physical postures, breathing techniques, and meditation.',
        features: [
          'Improves flexibility, balance, and muscle strength.',
          'Reduces stress and promotes mental clarity.',
          'Enhances respiratory efficiency through focused breathing.',
          'Supports cardiovascular health.',
          'Encourages mindfulness and overall well-being.'
        ],
        image: yoga
      },
      {
        _id: '3',
        name: 'Zumba',
        description: 'Zumba is a dance-based fitness program set to energetic music.',
        features: [
          'Provides a full-body workout that burns calories effectively.',
          'Improves cardiovascular fitness.',
          'Enhances coordination and rhythm.',
          'Boosts mood and energy levels.',
          'Offers a fun and social exercise environment.'
        ],
        image: zumba
      },
      {
        _id: '4',
        name: 'HIIT',
        description: 'HIIT involves short bursts of intense exercise followed by rest periods.',
        features: [
          'Burns a significant number of calories in a short time.',
          'Increases metabolic rate, aiding in weight loss.',
          'Improves cardiovascular health.',
          'Enhances muscle tone and endurance.',
          'Offers time-efficient workouts suitable for busy schedules.'
        ],
        image: hiit
      },
      {
        _id: '5',
        name: 'Kickboxing',
        description: 'Kickboxing combines martial arts techniques with high-energy cardio.',
        features: [
          'Improves cardiovascular endurance.',
          'Enhances strength, particularly in the core and lower body.',
          'Boosts coordination and balance.',
          'Provides stress relief through high-intensity movements.',
          'Increases agility and reflexes.'
        ],
        image: kickboxing
      },
      {
        _id: '6',
        name: 'Bootcamp',
        description: 'Bootcamp classes are high-intensity sessions that combine strength and cardio exercises.',
        features: [
          'Offers a comprehensive full-body workout.',
          'Improves cardiovascular fitness and muscle strength.',
          'Promotes weight loss through high-calorie burn.',
          'Enhances teamwork and motivation in a group setting.',
          'Increases mental toughness and discipline.'
        ],
        image: bootcamp
      },
      {
        _id: '8',
        name: 'Water Aerobics',
        description: 'Water aerobics involves performing aerobic exercises in a pool setting.',
        features: [
          'Provides low-impact resistance training, gentle on joints.',
          'Enhances cardiovascular fitness.',
          'Improves muscle strength and flexibility.',
          'Supports rehabilitation and recovery from injuries.',
          'Offers a cooling and refreshing workout environment.'
        ],
        image: waterAerobics
      },
      {
        _id: '9',
        name: 'Circuit Training',
        description: 'Circuit training involves rotating through various exercise stations targeting different muscle groups.',
        features: [
          'Provides a comprehensive full-body workout.',
          'Improves muscular strength and cardiovascular endurance.',
          'Enhances flexibility and coordination.',
          'Offers time-efficient workouts by combining strength and cardio.',
          'Prevents workout monotony through varied exercises.'
        ],
        image: circuitTraining
      }
    ];

    // Show only the first 4 courses
    const limitedCourses = courseData.slice(0, 4);
    setCourses(limitedCourses);
  }, []);

  return (
    <div className="courses-container">
      <h1>Our Popular Courses</h1>
      <div className="courses-grid">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <img src={course.image} alt={course.name} className="course-image" />
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <ul>
              {course.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="login-message">
        <h3>Want to explore all our fitness courses and tutorials?</h3>
        <p><strong>Please <a href="/login">Login</a> to access unlimited free fitness content!</strong></p>
      </div>
    </div>
  );
}

export default FeaturedCourses;
