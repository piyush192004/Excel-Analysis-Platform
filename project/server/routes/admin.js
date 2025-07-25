const express = require('express');
const User = require('../models/User');
const ExcelFile = require('../models/ExcelFile');
const Chart = require('../models/Chart');
const AIInsight = require('../models/AIInsight');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const usersData = users.map(user => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    }));

    res.json({ users: usersData });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get admin statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFiles = await ExcelFile.countDocuments();
    const totalCharts = await Chart.countDocuments();
    const totalInsights = await AIInsight.countDocuments();
    
    // Calculate total storage used
    const storageResult = await ExcelFile.aggregate([
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    const totalStorage = storageResult[0]?.totalSize || 0;

    res.json({
      totalUsers,
      totalFiles,
      totalCharts,
      totalInsights,
      totalStorage
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Don't allow admin to delete themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete user and all associated data
    await Promise.all([
      User.findByIdAndDelete(userId),
      ExcelFile.deleteMany({ userId }),
      Chart.deleteMany({ userId }),
      AIInsight.deleteMany({ userId })
    ]);

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;