const mongoose = require('mongoose');

const excelFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: [[mongoose.Schema.Types.Mixed]],
    required: true
  },
  headers: {
    type: [String],
    required: true
  },
  rowCount: {
    type: Number,
    required: true
  },
  columnCount: {
    type: Number,
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExcelFile', excelFileSchema);