const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const ExcelFile = require('../models/ExcelFile');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.toLowerCase().endsWith('.xls') || 
        file.originalname.toLowerCase().endsWith('.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xls, .xlsx) are allowed'), false);
    }
  }
});

// Upload and parse Excel file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }
    
    const headers = jsonData[0] || [];
    const dataRows = jsonData.slice(1);
    
    // Create Excel file record
    const excelFile = new ExcelFile({
      name: req.file.originalname.replace(/\.[^/.]+$/, ''),
      originalName: req.file.originalname,
      size: req.file.size,
      userId: req.user._id,
      data: dataRows,
      headers: headers.map(h => h?.toString() || ''),
      rowCount: dataRows.length,
      columnCount: headers.length
    });

    await excelFile.save();

    res.status(201).json({
      message: 'File uploaded and parsed successfully',
      file: {
        id: excelFile._id,
        name: excelFile.name,
        originalName: excelFile.originalName,
        size: excelFile.size,
        headers: excelFile.headers,
        rowCount: excelFile.rowCount,
        columnCount: excelFile.columnCount,
        uploadedAt: excelFile.createdAt
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
});

// Get user's files
router.get('/', auth, async (req, res) => {
  try {
    const files = await ExcelFile.find({ userId: req.user._id })
      .select('-data') // Exclude large data field
      .sort({ createdAt: -1 });

    const filesData = files.map(file => ({
      id: file._id,
      name: file.name,
      originalName: file.originalName,
      size: file.size,
      headers: file.headers,
      rowCount: file.rowCount,
      columnCount: file.columnCount,
      uploadedAt: file.createdAt
    }));

    res.json({ files: filesData });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Get specific file with data
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await ExcelFile.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileData = {
      id: file._id,
      name: file.name,
      originalName: file.originalName,
      size: file.size,
      data: file.data,
      headers: file.headers,
      rowCount: file.rowCount,
      columnCount: file.columnCount,
      uploadedAt: file.createdAt
    };

    res.json({ file: fileData });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Error fetching file' });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await ExcelFile.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router;