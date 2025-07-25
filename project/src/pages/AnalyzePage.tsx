import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchFile, createInsight } from '../store/dataSlice';
import ChartBuilder from '../components/Charts/ChartBuilder';
import Chart3D from '../components/Charts/Chart3D';
import { generateAIInsights, generateSmartChartSuggestions } from '../utils/aiService';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  BarChart3, 
  Loader,
  FileSpreadsheet,
  Table,
  Zap
} from 'lucide-react';

const AnalyzePage: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentFile, insights, loading } = useSelector((state: RootState) => state.data);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | '3d' | 'insights'>('overview');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [chartSuggestions, setChartSuggestions] = useState<any[]>([]);

  // Get insights for current file
  const fileInsights = insights.filter(insight => insight.fileId === fileId);

  useEffect(() => {
    if (fileId) {
      dispatch(fetchFile(fileId));
    }
  }, [fileId, dispatch]);

  useEffect(() => {
    if (currentFile) {
      // Generate chart suggestions
      const suggestions = generateSmartChartSuggestions(currentFile.headers, currentFile.data);
      setChartSuggestions(suggestions);
    }
  }, [currentFile]);

  const handleGenerateInsights = async () => {
    if (!currentFile || !user) return;

    setLoadingInsights(true);
    try {
      const aiInsights = await generateAIInsights(currentFile.data, currentFile.headers);
      
      await dispatch(createInsight({
        fileId: currentFile.id,
        summary: aiInsights.summary,
        insights: aiInsights.insights,
        recommendations: aiInsights.recommendations,
      })).unwrap();
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!currentFile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">File not found</h1>
          <p className="text-gray-600">The requested file could not be found.</p>
        </div>
      </div>
    );
  }

  // Generate sample 3D data
  const sample3DData = currentFile.data.slice(0, 20).map((row, index) => ({
    x: Number(row[0]) || index,
    y: Number(row[1]) || Math.random() * 100,
    z: Number(row[2]) || Math.random() * 50,
    label: `Point ${index + 1}`,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyze: {currentFile.name}</h1>
        <p className="text-gray-600">
          {currentFile.rowCount} rows × {currentFile.columnCount} columns
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview', icon: Table },
              { key: 'charts', label: '2D Charts', icon: BarChart3 },
              { key: '3d', label: '3D Visualization', icon: TrendingUp },
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
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Data Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Preview</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {currentFile.headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentFile.data.slice(0, 10).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cell?.toString() || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {currentFile.data.length > 10 && (
              <p className="mt-4 text-sm text-gray-500 text-center">
                Showing first 10 rows of {currentFile.data.length} total rows
              </p>
            )}
          </div>

          {/* Smart Suggestions */}
          {chartSuggestions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Smart Chart Suggestions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chartSuggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-2">{suggestion.chartType} Chart</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {suggestion.xAxis} vs {suggestion.yAxis}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">{suggestion.reason}</p>
                    <button
                      onClick={() => setActiveTab('charts')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Create Chart →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'charts' && <ChartBuilder fileId={currentFile.id} />}

      {activeTab === '3d' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">3D Visualization</h2>
          <Chart3D
            data={sample3DData}
            type="3d-scatter"
            title={`3D Scatter Plot - ${currentFile.name}`}
            colors={['#3B82F6', '#EF4444', '#10B981']}
          />
          <p className="mt-4 text-sm text-gray-600 text-center">
            Interactive 3D visualization using the first three numeric columns of your data
          </p>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI-Powered Insights
            </h2>
            <button
              onClick={handleGenerateInsights}
              disabled={loadingInsights}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingInsights ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              {loadingInsights ? 'Analyzing...' : 'Generate Insights'}
            </button>
          </div>

          {fileInsights.length > 0 ? (
            <div className="space-y-6">
              {fileInsights.map((insight) => (
                <div key={insight.id}>
                  <div className="bg-blue-50 rounded-lg p-6 mb-4">
                    <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Summary
                    </h3>
                    <p className="text-blue-800">{insight.summary}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 mb-4">
                    <h3 className="font-medium text-green-900 mb-3 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Key Insights
                    </h3>
                    <ul className="space-y-2">
                      {insight.insights.map((item, index) => (
                        <li key={index} className="flex items-start text-green-800">
                          <span className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="font-medium text-yellow-900 mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {insight.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start text-yellow-800">
                          <span className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights generated yet</h3>
              <p className="text-gray-600 mb-4">
                Click "Generate Insights" to get AI-powered analysis of your data
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;