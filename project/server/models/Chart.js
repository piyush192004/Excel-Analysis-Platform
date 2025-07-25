const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['line', 'bar', 'pie', 'scatter', 'doughnut', 'radar', 'polarArea'],
    required: true
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  config: {
    backgroundColor: String,
    borderColor: String,
    borderWidth: Number,
    fill: Boolean,
    tension: Number,
    pointRadius: Number,
    colors: [String]
  },
  is3D: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chart', chartSchema);