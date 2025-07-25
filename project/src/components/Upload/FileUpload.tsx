import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { uploadFile } from '../../store/dataSlice';
import { RootState, AppDispatch } from '../../store';

const FileUpload: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.data);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleFiles = useCallback(async (files: FileList) => {
    if (!user) return;

    const file = files[0];
    if (!file) return;

    // Validate file
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setUploadStatus({ type: 'error', message: 'Please upload a valid Excel file (.xls or .xlsx)' });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadStatus({ type: 'error', message: 'File size must be less than 10MB' });
      return;
    }

    setUploadStatus({ type: null, message: '' });

    try {
      const result = await dispatch(uploadFile(file)).unwrap();
      setUploadStatus({ 
        type: 'success', 
        message: `Successfully uploaded ${file.name} with ${result.file.rowCount} rows and ${result.file.columnCount} columns` 
      });
      
      // Navigate to analyze page after successful upload
      setTimeout(() => {
        navigate(`/analyze/${result.file.id}`);
      }, 2000);
    } catch (error: any) {
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Failed to upload file' 
      });
    }
  }, [dispatch, user, navigate]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Excel File</h1>
          <p className="text-gray-600 mb-8">
            Upload your Excel file (.xls or .xlsx) to start analyzing your data and creating interactive charts.
          </p>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />
            
            <div className="space-y-4">
              {loading ? (
                <Loader className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
              ) : (
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
              )}
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {loading ? 'Processing file...' : 'Drop your Excel file here, or click to browse'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports .xls and .xlsx files up to 10MB
                </p>
              </div>
            </div>
          </div>

          {uploadStatus.type && (
            <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
              uploadStatus.type === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{uploadStatus.message}</span>
              <button
                onClick={() => setUploadStatus({ type: null, message: '' })}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Upload className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Easy Upload</h3>
              <p className="text-sm text-gray-600">Drag & drop or click to upload your Excel files</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileSpreadsheet className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Auto Analysis</h3>
              <p className="text-sm text-gray-600">Automatic parsing and data type detection</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Instant Results</h3>
              <p className="text-sm text-gray-600">Start creating charts immediately after upload</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;