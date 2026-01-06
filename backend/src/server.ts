import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import careerRoutes from './routes/careers';
import recommendationRoutes from './routes/recommendations';
import dashboardRoutes from './routes/dashboard';
import mentorRoutes from './routes/mentor';
import resumeRoutes from './routes/resumeRoutes';
import jobRoutes from './routes/jobs';
// @ts-ignore
import { swaggerUi, specs } from './config/swagger';

// Mount Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
