require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'https://hztms-frontend.vercel.app',
  'https://hztms.vercel.app',
];

function allowedOrigins() {
  const extra = (process.env.CLIENT_URL || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ORIGINS, ...extra])];
}

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins().includes(origin)) return callback(null, true);
    if (/^https:\/\/hztms(-frontend)?[a-z0-9-]*\.vercel\.app$/i.test(origin)) return callback(null, true);
    return callback(null, false);
  },
}));
app.use(express.json({ limit: '2mb' }));
app.get('/', (req, res) => { res.send('API running'); });
app.get('/api/health', (req, res) => { res.json({ ok: true }); });
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));
app.use('/api/lost-found', require('./routes/lostFoundRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`)));


