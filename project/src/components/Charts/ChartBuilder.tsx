import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Line, Bar, Pie, Scatter, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { RootState, AppDispatch } from '../../store';
import { createChart } from '../../store/dataSlice';
import { ChartType, Chart } from '../../types';
import { generateChartData, getChartOptions, downloadChart } from '../../utils/chartGenerator';
import { getColumnData } from '../../utils/excelParser';
import { Download, Save, Palette, BarChart3, LineChart, PieChart, ScatterChart as ScatterIcon, Loader } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface ChartBuilderProps {
  fileId: string;
}

const ChartBuilder: React.FC<ChartBuilderProps> = ({ fileId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { files, currentFile, loading } = useSelector((state: RootState) => state.data);
  const chartRef = useRef<any>(null);

  const file = currentFile || files.find(f => f.id === fileId);
  
  const [chartConfig, setChartConfig] = useState({
    title: '',
    type: 'bar' as ChartType,
    xAxis: '',
    yAxis: '',
    is3D: false,
  });

  const [customColors, setCustomColors] = useState({
    backgroundColor: '#3B82F6',
    borderColor: '#1D4ED8',
    borderWidth: 2,
  });

  const [saving, setSaving] = useState(false);

  if (!file) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">File not found</p>
      </div>
    );
  }

  const handleConfigChange = (key: string, value: any) => {
    setChartConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateChart = () => {
    if (!chartConfig.xAxis || !chartConfig.yAxis) return null;

    const xIndex = file.headers.indexOf(chartConfig.xAxis);
    const yIndex = file.headers.indexOf(chartConfig.yAxis);

    if (xIndex === -1 || yIndex === -1) return null;

    const xData = getColumnData(file.data, xIndex);
    const yData = getColumnData(file.data, yIndex);

    return generateChartData(xData, yData, chartConfig.type, customColors);
  };

  const saveChart = async () => {
    if (!user || !chartConfig.title || !chartConfig.xAxis || !chartConfig.yAxis) return;

    const chartData = generateChart();
    if (!chartData) return;

    setSaving(true);
    try {
      await dispatch(createChart({
        fileId: file.id,
        title: chartConfig.title,
        type: chartConfig.type,
        xAxis: chartConfig.xAxis,
        yAxis: chartConfig.yAxis,
        data: chartData,
        config: customColors,
        is3D: chartConfig.is3D,
      })).unwrap();

      // Reset form after successful save
      setChartConfig({
        title: '',
        type: 'bar' as ChartType,
        xAxis: '',
        yAxis: '',
        is3D: false,
      });
    } catch (error) {
      console.error('Failed to save chart:', error);
    } finally {
      setSaving(false);
    }
  };

  const chartData = generateChart();
  const chartOptions = getChartOptions(chartConfig.type, chartConfig.title);

  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
      ref: chartRef,
      data: chartData,
      options: chartOptions,
    };

    switch (chartConfig.type) {
      case 'line':
        return <Line {...commonProps} />;
      case 'bar':
        return <Bar {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'scatter':
        return <Scatter {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      case 'radar':
        return <Radar {...commonProps} />;
      case 'polarArea':
        return <PolarArea {...commonProps} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'scatter', label: 'Scatter Plot', icon: ScatterIcon },
    { value: 'doughnut', label: 'Doughnut', icon: PieChart },
    { value: 'radar', label: 'Radar Chart', icon: BarChart3 },
    { value: 'polarArea', label: 'Polar Area', icon: PieChart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Chart Configuration</h2>
            
            <div className="space-y-6">
              {/* Chart Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={chartConfig.title}
                  onChange={(e) => handleConfigChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter chart title"
                />
              </div>

              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleConfigChange('type', value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        chartConfig.type === value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="h-4 w-4 mx-auto mb-1" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* X Axis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X Axis
                </label>
                <select
                  value={chartConfig.xAxis}
                  onChange={(e) => handleConfigChange('xAxis', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select column</option>
                  {file.headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              {/* Y Axis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y Axis
                </label>
                <select
                  value={chartConfig.yAxis}
                  onChange={(e) => handleConfigChange('yAxis', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select column</option>
                  {file.headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Customization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="h-4 w-4 inline mr-1" />
                  Colors
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={customColors.backgroundColor}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-full h-8 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Border Color</label>
                    <input
                      type="color"
                      value={customColors.borderColor}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, borderColor: e.target.value }))}
                      className="w-full h-8 rounded border border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={saveChart}
                  disabled={!chartConfig.title || !chartConfig.xAxis || !chartConfig.yAxis || saving}
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Saving...' : 'Save Chart'}
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadChart(chartRef, chartConfig.title || 'chart', 'png')}
                    disabled={!chartData}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PNG
                  </button>
                  <button
                    onClick={() => downloadChart(chartRef, chartConfig.title || 'chart', 'pdf')}
                    disabled={!chartData}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Chart Preview</h2>
            
            {chartData ? (
              <div className="h-96">
                {renderChart()}
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select X and Y axes to generate chart preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartBuilder;