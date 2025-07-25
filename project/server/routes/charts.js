const express = require('express');
const Chart = require('../models/Chart');
const ExcelFile = require('../models/ExcelFile');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create new chart
router.post('/', auth, async (req, res) => {
  try {
    const { fileId, title, type, xAxis, yAxis, data, config, is3D } = req.body;

    // Verify file belongs to user
    const file = await ExcelFile.findOne({ _id: fileId, userId: req.user._id });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const chart = new Chart({
      fileId,
      userId: req.user._id,
      title,
      type,
      xAxis,
      yAxis,
      data,
      config,
      is3D: is3D || false
    });

    await chart.save();

    res.status(201).json({
      message: 'Chart created successfully',
      chart: {
        id: chart._id,
        fileId: chart.fileId,
        title: chart.title,
        type: chart.type,
        xAxis: chart.xAxis,
        yAxis: chart.yAxis,
        data: chart.data,
        config: chart.config,
        is3D: chart.is3D,
        createdAt: chart.createdAt
      }
    });
  } catch (error) {
    console.error('Create chart error:', error);
    res.status(500).json({ message: 'Error creating chart' });
  }
});

// Get user's charts
router.get('/', auth, async (req, res) => {
  try {
    const charts = await Chart.find({ userId: req.user._id })
      .populate('fileId', 'name')
      .sort({ createdAt: -1 });

    const chartsData = charts.map(chart => ({
      id: chart._id,
      fileId: chart.fileId._id,
      fileName: chart.fileId.name,
      title: chart.title,
      type: chart.type,
      xAxis: chart.xAxis,
      yAxis: chart.yAxis,
      data: chart.data,
      config: chart.config,
      is3D: chart.is3D,
      createdAt: chart.createdAt
    }));

    res.json({ charts: chartsData });
  } catch (error) {
    console.error('Get charts error:', error);
    res.status(500).json({ message: 'Error fetching charts' });
  }
});

// Get specific chart
router.get('/:id', auth, async (req, res) => {
  try {
    const chart = await Chart.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    }).populate('fileId', 'name');

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    const chartData = {
      id: chart._id,
      fileId: chart.fileId._id,
      fileName: chart.fileId.name,
      title: chart.title,
      type: chart.type,
      xAxis: chart.xAxis,
      yAxis: chart.yAxis,
      data: chart.data,
      config: chart.config,
      is3D: chart.is3D,
      createdAt: chart.createdAt
    };

    res.json({ chart: chartData });
  } catch (error) {
    console.error('Get chart error:', error);
    res.status(500).json({ message: 'Error fetching chart' });
  }
});

// Delete chart
router.delete('/:id', auth, async (req, res) => {
  try {
    const chart = await Chart.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    res.json({ message: 'Chart deleted successfully' });
  } catch (error) {
    console.error('Delete chart error:', error);
    res.status(500).json({ message: 'Error deleting chart' });
  }
});

module.exports = router;