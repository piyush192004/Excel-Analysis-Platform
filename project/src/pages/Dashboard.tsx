import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RootState, AppDispatch } from '../store';
import { fetchFiles, fetchCharts, fetchInsights, deleteFileAsync, deleteChartAsync } from '../store/dataSlice';
import { 
  FileSpreadsheet, 
  BarChart3, 
  Brain, 
  Upload, 
  Eye, 
  Download,
  Trash2,
  Plus,
  TrendingUp,
  Loader
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { files, charts, insights, loading } = useSelector((state: RootState) => state.data);
  const [activeTab, setActiveTab] = useState<'files' | 'charts' | 'insights'>('files');
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      dispatch(fetchFiles());
      dispatch(fetchCharts());
      dispatch(fetchInsights());
    }
  }, [dispatch, user]);

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file? This will also delete all associated charts and insights.')) {
      setDeletingItems(prev => new Set(prev).add(fileId));
      try {
        await dispatch(deleteFileAsync(fileId)).unwrap();
      } catch (error) {
        console.error('Failed to delete file:', error);
      } finally {
        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }
  };

  const handleDeleteChart = async (chartId: string) => {
    if (window.confirm('Are you sure you want to delete this chart?')) {
      setDeletingItems(prev => new Set(prev).add(chartId));
      try {
        await dispatch(deleteChartAsync(chartId)).unwrap();
      } catch (error) {
        console.error('Failed to delete chart:', error);
      } finally {
        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(chartId);
          return newSet;
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h1>
        </div>
      </div>
    );
  }

  const totalStorage = files.reduce((sum, file) => sum + file.size, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.fullName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Files</p>
              <p className="text-2xl font-semibold text-gray-900">{files.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Charts Created</p>
              <p className="text-2xl font-semibold text-gray-900">{charts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">AI Insights</p>
              <p className="text-2xl font-semibold text-gray-900">{insights.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Storage Used</p>
              <p className="text-2xl font-semibold text-gray-900">{formatFileSize(totalStorage)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Excel File
          </Link>
          {files.length > 0 && (
            <Link
              to={`/analyze/${files[0].id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Create Chart
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'files', label: 'Files', icon: FileSpreadsheet },
              { key: 'charts', label: 'Charts', icon: BarChart3 },
              { key: 'insights', label: 'AI Insights', icon: Brain },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && !loading && (
            <div>
              {files.length === 0 ? (
                <div className="text-center py-12">
                  <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
                  <p className="text-gray-600 mb-4">Upload your first Excel file to get started</p>
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileSpreadsheet className="h-8 w-8 text-green-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">{file.name}</h3>
                            <p className="text-sm text-gray-500">
                              {file.rowCount} rows × {file.columnCount} columns • {formatFileSize(file.size)}
                            </p>
                            <p className="text-xs text-gray-400">
                              Uploaded {format(new Date(file.uploadedAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/analyze/${file.id}`}
                            className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analyze
                          </Link>
                          <button 
                            onClick={() => handleDeleteFile(file.id)}
                            disabled={deletingItems.has(file.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            {deletingItems.has(file.id) ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Charts Tab */}
          {activeTab === 'charts' && !loading && (
            <div>
              {charts.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No charts created yet</h3>
                  <p className="text-gray-600 mb-4">Create your first chart from uploaded data</p>
                  {files.length > 0 ? (
                    <Link
                      to={`/analyze/${files[0].id}`}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Chart
                    </Link>
                  ) : (
                    <Link
                      to="/upload"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File First
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charts.map((chart) => (
                    <div key={chart.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 truncate">{chart.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {chart.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {chart.xAxis} vs {chart.yAxis}
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        Created {format(new Date(chart.createdAt), 'MMM dd, yyyy')}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button className="flex-1 inline-flex items-center justify-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteChart(chart.id)}
                          disabled={deletingItems.has(chart.id)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          {deletingItems.has(chart.id) ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && !loading && (
            <div>
              {insights.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No AI insights generated yet</h3>
                  <p className="text-gray-600 mb-4">Upload data and generate insights to see them here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {insights.map((insight) => (
                    <div key={insight.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">AI Analysis</h3>
                        <span className="text-xs text-gray-500">
                          {format(new Date(insight.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
                          <p className="text-gray-600">{insight.summary}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Key Insights</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {insight.insights.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {insight.recommendations.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;