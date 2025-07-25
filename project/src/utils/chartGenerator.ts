import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import { ChartType, ChartConfig } from '../types';

export const generateChartData = (
  xData: any[],
  yData: any[],
  chartType: ChartType,
  config: ChartConfig = {}
) => {
  const colors = config.colors || [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  switch (chartType) {
    case 'pie':
    case 'doughnut':
      return {
        labels: xData,
        datasets: [{
          data: yData,
          backgroundColor: colors,
          borderColor: colors.map(color => color + '80'),
          borderWidth: config.borderWidth || 2,
        }]
      };
    
    case 'radar':
    case 'polarArea':
      return {
        labels: xData,
        datasets: [{
          label: 'Data',
          data: yData,
          backgroundColor: colors[0] + '40',
          borderColor: colors[0],
          borderWidth: config.borderWidth || 2,
          pointBackgroundColor: colors[0],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors[0],
        }]
      };
    
    default:
      return {
        labels: xData,
        datasets: [{
          label: 'Data',
          data: yData,
          backgroundColor: config.backgroundColor || colors[0] + '40',
          borderColor: config.borderColor || colors[0],
          borderWidth: config.borderWidth || 2,
          fill: config.fill || false,
          tension: config.tension || 0.1,
          pointRadius: config.pointRadius || 4,
        }]
      };
  }
};

export const getChartOptions = (chartType: ChartType, title: string) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  if (['pie', 'doughnut', 'radar', 'polarArea'].includes(chartType)) {
    return baseOptions;
  }

  return {
    ...baseOptions,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'X Axis',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Y Axis',
        },
      },
    },
  };
};

export const downloadChart = async (chartRef: any, filename: string, format: 'png' | 'pdf' = 'png') => {
  if (!chartRef?.current) return;

  const canvas = chartRef.current;
  
  if (format === 'png') {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = url;
    link.click();
  } else {
    // For PDF, we'd need jsPDF
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
    pdf.save(`${filename}.pdf`);
  }
};