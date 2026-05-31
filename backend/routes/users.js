import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { mockUsers } from '../data/mockUsers.js';

const router = express.Router();

// GET /api/users - Get all users with pagination, search, and filtering
router.get('/', verifyToken, (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  let filtered = [...mockUsers];

  // Search by name, email, or phone
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(search)
    );
  }

  // Filter by status
  if (status && status !== 'all') {
    filtered = filtered.filter((user) => user.status === status);
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const paginatedUsers = filtered.slice(skip, skip + limitNum);

  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filtered.length,
      pages: Math.ceil(filtered.length / limitNum),
    },
  });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', verifyToken, (req, res) => {
  const user = mockUsers.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    success: true,
    data: user,
  });
});

// PUT /api/users/:id - Update user status
router.put('/:id', verifyToken, (req, res) => {
  const user = mockUsers.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  user.status = status;

  res.json({
    success: true,
    message: 'User status updated successfully',
    data: user,
  });
});

export default router;
