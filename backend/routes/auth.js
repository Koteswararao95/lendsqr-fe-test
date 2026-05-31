import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Demo credentials
const DEMO_USER = {
  email: 'demo@lendsqr.com',
  password: 'password123',
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Simple validation - only accept demo credentials
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    const token = jwt.sign(
      { email, id: 1 },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: 1,
        email,
        name: 'Demo User',
      },
    });
  }

  res.status(401).json({
    success: false,
    message: 'Invalid credentials. Use demo@lendsqr.com / password123',
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
