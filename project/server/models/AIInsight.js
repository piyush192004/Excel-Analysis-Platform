const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelFile',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  insights: {
    type: [String],
    required: true
  },
  recommendations: {
    type: [String],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);