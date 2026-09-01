import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import revisionRoutes from './routes/revisionRoutes';
import statisticsRoutes from './routes/statisticsRoutes';
import calendarRoutes from './routes/calendarRoutes';
import todoRoutes from './routes/todoRoutes';

const app = express();
const PORT = config.port;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: config.clientUrl,
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('DSA Revision Tracker API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
