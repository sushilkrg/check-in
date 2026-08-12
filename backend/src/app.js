import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import interviewRoutes from './routes/interviewRoutes.js';
import meetingRoutes from './routes/businessMeetingRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoute from './routes/healthRoute.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = process.env.CLIENT_URL?.split(',').map((origin) => origin.trim()) || [
  'http://localhost:3000',
];

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Visitor Check-In API is running' }),
);

app.use("/api/health", healthRoute);
app.use('/api/interviews', interviewRoutes);
app.use('/api/business-meetings', meetingRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

export default app;
