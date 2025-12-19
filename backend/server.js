const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const careerRoutes = require('./routes/careers');
const recommendationRoutes = require('./routes/recommendations');
const dashboardRoutes = require('./routes/dashboard');
const mentorRoutes = require('./routes/mentor');
const resumeRoutes = require('./routes/resumeRoutes');     // New Route file
const { swaggerUi, specs } = require('./config/swagger');

// Mount Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/resume', resumeRoutes);                      // Resume Builder Route

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
