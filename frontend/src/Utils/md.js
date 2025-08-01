const mockMemberData = {
    name: 'Rohit Singh',
    username: 'rohit_s',
    age: 28,
    sex: 'Male',
    email: 'rohit@example.com',
    phone: '9876543210',
    enrollments: ['Weight Training', 'Cardio', 'Yoga'],
  
    gymName: 'FitZone Elite',
    gymCode: 'FZ2025',
    location: 'Bengaluru',
  
    trainer: 'Ravi Kumar',
    specialization: 'Strength Training',
    trainerPhone: '8888888888',
    trainerEmail: 'ravi@fitzone.com',
  
    weightStart: 85,
    weightNow: 76,
    bodyFat: 19,
    measurements: 'Chest: 40", Waist: 34", Arms: 15"',
    transformationNotes: 'Lost 9 kg in 3 months. Improved endurance.',
  
    paymentStatus: 'Paid',
    nextDue: '2025-08-01',
    paymentHistory: [
      { month: 'May', amount: '₹2000', status: 'Paid' },
      { month: 'June', amount: '₹2000', status: 'Paid' },
      { month: 'July', amount: '₹2000', status: 'Paid' },
    ],
  
    schedule: [
      { day: 'Monday - Saturday', open: '5:00 AM', close: '10:00 PM' },
      { day: 'Sunday', open: '-', close: '-' }
    ],
  
    dietSchedule: [
      { day: 'Monday', time: '7:30 AM' },
      { day: 'Wednesday', time: '8:00 AM' },
      { day: 'Friday', time: '7:00 AM' },
    ]
  };
  
  export default mockMemberData;
  