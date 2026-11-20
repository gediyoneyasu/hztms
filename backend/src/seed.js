const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Route = require('./models/Route');
const Schedule = require('./models/Schedule');
const Announcement = require('./models/Announcement');
const connectDB = require('./config/db');

dotenv.config();

const routes = [
  { from: 'Hossana', to: 'Addis Ababa', price: 450, duration: '4h 30m', frequency: 'Every 3 hours' },
  { from: 'Hossana', to: 'Hawassa', price: 300, duration: '3h 15m', frequency: 'Every 5 hours' },
  { from: 'Hossana', to: 'Wolkite', price: 250, duration: '2h 45m', frequency: 'Twice daily' },
  { from: 'Hossana', to: 'Butajira', price: 200, duration: '2h 00m', frequency: 'Daily 08:00' },
];

const schedules = [
  { busId: 'HZ-101', from: 'Hossana', to: 'Addis Ababa', departure: '06:00', arrival: '10:30', price: 450, status: 'Boarding' },
  { busId: 'HZ-102', from: 'Hossana', to: 'Addis Ababa', departure: '09:00', arrival: '13:30', price: 450, status: 'Available' },
  { busId: 'HZ-201', from: 'Hossana', to: 'Hawassa', departure: '07:30', arrival: '10:45', price: 300, status: 'Full' },
  { busId: 'HZ-202', from: 'Hossana', to: 'Hawassa', departure: '13:00', arrival: '16:15', price: 300, status: 'Available' },
  { busId: 'HZ-301', from: 'Hossana', to: 'Wolkite', departure: '08:00', arrival: '10:45', price: 250, status: 'Boarding' },
];

const announcements = [
  { title: 'New express service to Addis', date: 'Nov 10, 2026', body: 'A new 06:00 express departure has been added on weekdays.' },
  { title: 'Holiday schedule', date: 'Nov 05, 2026', body: 'Extra buses will run during the upcoming holiday period.' },
  { title: 'Ticket office hours extended', date: 'Oct 28, 2026', body: 'The ticket office now opens at 05:30 daily.' },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Route.deleteMany();
    await Schedule.deleteMany();
    await Announcement.deleteMany();

    // Insert new data
    await Route.insertMany(routes);
    await Schedule.insertMany(schedules);
    await Announcement.insertMany(announcements);

    console.log('✅ Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
