import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { mockUsers } from '../data/mockUsers.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', verifyToken, (req, res) => {
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === 'Active').length;
  const usersWithLoans = mockUsers.filter((u) => u.loanAmount > 0).length;
  const totalTransactions = Math.floor(totalUsers * 2.5);
  const usersVisitedToday = Math.floor(totalUsers * 0.15);
  const activeLoans = usersWithLoans;

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      usersWithLoans,
      totalTransactions,
      usersVisitedToday,
      activeLoans,
    },
  });
});

export default router;
