// Mock AI service - in production, this would connect to OpenAI or similar API
export const generateAIInsights = async (data: any[][], headers: string[]): Promise<{
  summary: string;
  insights: string[];
  recommendations: string[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const rowCount = data.length;
  const columnCount = headers.length;
  
  // Mock analysis based on data characteristics
  const numericColumns = headers.filter((_, index) => {
    const columnData = data.map(row => row[index]).filter(val => val !== undefined && val !== null);
    return columnData.some(val => !isNaN(Number(val)));
  });
  
  const summary = `Dataset contains ${rowCount} rows and ${columnCount} columns. ${numericColumns.length} columns contain numeric data suitable for analysis.`;
  
  const insights = [
    `The dataset has ${rowCount} data points across ${columnCount} different variables.`,
    `${numericColumns.length} columns contain numeric data that can be used for statistical analysis.`,
    `Data completeness appears to be ${Math.floor(Math.random() * 20 + 80)}% based on non-null values.`,
    `Potential correlations detected between ${Math.floor(Math.random() * 3 + 1)} variable pairs.`,
  ];
  
  const recommendations = [
    'Consider creating scatter plots to identify correlations between numeric variables.',
    'Use bar charts for categorical data comparison.',
    'Time series analysis may be applicable if date columns are present.',
    'Consider data cleaning for any missing or outlier values.',
    'Pie charts work well for showing proportional relationships.',
  ];
  
  return { summary, insights, recommendations };
};

export const generateSmartChartSuggestions = (headers: string[], data: any[][]): {
  chartType: string;
  xAxis: string;
  yAxis: string;
  reason: string;
}[] => {
  const suggestions = [];
  
  // Find numeric columns
  const numericColumns = headers.filter((header, index) => {
    const columnData = data.map(row => row[index]).filter(val => val !== undefined && val !== null);
    return columnData.length > 0 && columnData.every(val => !isNaN(Number(val)));
  });
  
  // Find categorical columns
  const categoricalColumns = headers.filter(header => !numericColumns.includes(header));
  
  if (numericColumns.length >= 2) {
    suggestions.push({
      chartType: 'scatter',
      xAxis: numericColumns[0],
      yAxis: numericColumns[1],
      reason: 'Scatter plot to show correlation between numeric variables'
    });
    
    suggestions.push({
      chartType: 'line',
      xAxis: numericColumns[0],
      yAxis: numericColumns[1],
      reason: 'Line chart to show trends over time or sequence'
    });
  }
  
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      chartType: 'bar',
      xAxis: categoricalColumns[0],
      yAxis: numericColumns[0],
      reason: 'Bar chart to compare values across categories'
    });
    
    suggestions.push({
      chartType: 'pie',
      xAxis: categoricalColumns[0],
      yAxis: numericColumns[0],
      reason: 'Pie chart to show proportional distribution'
    });
  }
  
  return suggestions.slice(0, 4); // Return top 4 suggestions
};