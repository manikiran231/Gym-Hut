const mockGymOwnerData = {
    name: 'FitZone Elite',
    code: 'FZ2025',
    location: 'Bengaluru',
    status: 'Active',
    openHours: '5:00 AM - 10:00 PM',
    totalMembers: 180,
    pendingMembers: 12,
    activeTrainers: 9,
    revenue: '₹1,75,000',
    equipmentCount: 45,
    announcements: [
      '🎉 New Year Fitness Challenge starts Jan 1!',
      '⚠️ Maintenance on dumbbells section this Friday',
      '🧘 Yoga Workshop - Sunday 7:00 AM - Book Now!'
    ],
    members: [
      { id: 1, name: 'Rohit Singh', plan: 'Gold', status: 'Active' },
      { id: 2, name: 'Priya Sharma', plan: 'Silver', status: 'Pending' },
      { id: 3, name: 'Rahul Jain', plan: 'Platinum', status: 'Active' },
    ],
    trainers: [
      { id: 1, name: 'Ravi Kumar', specialty: 'Strength Training' },
      { id: 2, name: 'Anita Verma', specialty: 'Zumba & Cardio' },
      { id: 3, name: 'Manoj Shetty', specialty: 'CrossFit' },
    ],
    payments: [
      { month: 'May', amount: '₹60,000' },
      { month: 'June', amount: '₹57,000' },
      { month: 'July', amount: '₹58,000' },
    ],
    equipmentList: [
      { name: 'Treadmill', quantity: 5 },
      { name: 'Bench Press', quantity: 4 },
      { name: 'Dumbbells (Set)', quantity: 20 },
      { name: 'Lat Pulldown Machine', quantity: 2 },
    ],
    analytics: {
      monthlyNewJoins: [12, 15, 18, 22, 25, 20],
      attendanceRate: 78, // %
      averageWeightLoss: '3.4 kg',
    }
  };
   

export default mockGymOwnerData;