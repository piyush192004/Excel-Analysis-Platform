const express = require('express');
const AIInsight = require('../models/AIInsight');
const ExcelFile = require('../models/ExcelFile');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create new AI insight
router.post('/', auth, async (req, res) => {
  try {
    const { fileId, summary, insights, recommendations } = req.body;

    // Verify file belongs to user
    const file = await ExcelFile.findOne({ _id: fileId, userId: req.user._id });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const aiInsight = new AIInsight({
      fileId,
      userId: req.user._id,
      summary,
      insights,
      recommendations
    });

    await aiInsight.save();

    res.status(201).json({
      message: 'AI insight created successfully',
      insight: {
        id: aiInsight._id,
        fileId: aiInsight.fileId,
        summary: aiInsight.summary,
        insights: aiInsight.insights,
        recommendations: aiInsight.recommendations,
        createdAt: aiInsight.createdAt
      }
    });
  } catch (error) {
    console.error('Create insight error:', error);
    res.status(500).json({ message: 'Error creating insight' });
  }
});

// Get user's insights
router.get('/', auth, async (req, res) => {
  try {
    const insights = await AIInsight.find({ userId: req.user._id })
      .populate('fileId', 'name')
      .sort({ createdAt: -1 });

    const insightsData = insights.map(insight => ({
      id: insight._id,
      fileId: insight.fileId._id,
      fileName: insight.fileId.name,
      summary: insight.summary,
      insights: insight.insights,
      recommendations: insight.recommendations,
      createdAt: insight.createdAt
    }));

    res.json({ insights: insightsData });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ message: 'Error fetching insights' });
  }
});

// Delete insight
router.delete('/:id', auth, async (req, res) => {
  try {
    const insight = await AIInsight.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }

    res.json({ message: 'Insight deleted successfully' });
  } catch (error) {
    console.error('Delete insight error:', error);
    res.status(500).json({ message: 'Error deleting insight' });
  }
});

module.exports = router;