import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Lendsqr Backend API',
    version: '1.0.0',
    message: 'Welcome to Lendsqr Backend API',
    endpoints: {
      authentication: {
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout'
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        updateStatus: 'PUT /api/users/:id'
      },
      dashboard: {
        stats: 'GET /api/dashboard/stats'
      }
    },
    demoCredentials: {
      email: 'demo@lendsqr.com',
      password: 'password123'
    },
    documentation: 'See README.md for full documentation'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Postman Collection: Import from /postman-collection.json`);
});
