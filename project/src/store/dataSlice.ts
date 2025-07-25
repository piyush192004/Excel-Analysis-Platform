import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { DataState, ExcelFile, Chart, AIInsight } from '../types';
import { filesAPI, chartsAPI, insightsAPI } from '../services/api';

const initialState: DataState = {
  files: [],
  charts: [],
  insights: [],
  currentFile: null,
  loading: false,
  error: null,
};

// Async thunks for files
export const uploadFile = createAsyncThunk(
  'data/uploadFile',
  async (file: File) => {
    const response = await filesAPI.upload(file);
    return response;
  }
);

export const fetchFiles = createAsyncThunk(
  'data/fetchFiles',
  async () => {
    const response = await filesAPI.getFiles();
    return response;
  }
);

export const fetchFile = createAsyncThunk(
  'data/fetchFile',
  async (id: string) => {
    const response = await filesAPI.getFile(id);
    return response;
  }
);

export const deleteFileAsync = createAsyncThunk(
  'data/deleteFile',
  async (id: string) => {
    await filesAPI.deleteFile(id);
    return id;
  }
);

// Async thunks for charts
export const createChart = createAsyncThunk(
  'data/createChart',
  async (chartData: {
    fileId: string;
    title: string;
    type: string;
    xAxis: string;
    yAxis: string;
    data: any;
    config: any;
    is3D?: boolean;
  }) => {
    const response = await chartsAPI.create(chartData);
    return response;
  }
);

export const fetchCharts = createAsyncThunk(
  'data/fetchCharts',
  async () => {
    const response = await chartsAPI.getCharts();
    return response;
  }
);

export const deleteChartAsync = createAsyncThunk(
  'data/deleteChart',
  async (id: string) => {
    await chartsAPI.deleteChart(id);
    return id;
  }
);

// Async thunks for insights
export const createInsight = createAsyncThunk(
  'data/createInsight',
  async (insightData: {
    fileId: string;
    summary: string;
    insights: string[];
    recommendations: string[];
  }) => {
    const response = await insightsAPI.create(insightData);
    return response;
  }
);

export const fetchInsights = createAsyncThunk(
  'data/fetchInsights',
  async () => {
    const response = await insightsAPI.getInsights();
    return response;
  }
);

export const deleteInsightAsync = createAsyncThunk(
  'data/deleteInsight',
  async (id: string) => {
    await insightsAPI.deleteInsight(id);
    return id;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFiles: (state, action: PayloadAction<ExcelFile[]>) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<ExcelFile>) => {
      state.files.unshift(action.payload);
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      state.charts = state.charts.filter(chart => chart.fileId !== action.payload);
      state.insights = state.insights.filter(insight => insight.fileId !== action.payload);
    },
    setCurrentFile: (state, action: PayloadAction<ExcelFile | null>) => {
      state.currentFile = action.payload;
    },
    setCharts: (state, action: PayloadAction<Chart[]>) => {
      state.charts = action.payload;
    },
    addChart: (state, action: PayloadAction<Chart>) => {
      state.charts.unshift(action.payload);
    },
    deleteChart: (state, action: PayloadAction<string>) => {
      state.charts = state.charts.filter(chart => chart.id !== action.payload);
    },
    setInsights: (state, action: PayloadAction<AIInsight[]>) => {
      state.insights = action.payload;
    },
    addInsight: (state, action: PayloadAction<AIInsight>) => {
      state.insights.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.unshift(action.payload.file);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Upload failed';
      })
      // Fetch files
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.files = action.payload.files;
      })
      // Fetch file
      .addCase(fetchFile.fulfilled, (state, action) => {
        state.currentFile = action.payload.file;
      })
      // Delete file
      .addCase(deleteFileAsync.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file.id !== action.payload);
        state.charts = state.charts.filter(chart => chart.fileId !== action.payload);
        state.insights = state.insights.filter(insight => insight.fileId !== action.payload);
      })
      // Create chart
      .addCase(createChart.fulfilled, (state, action) => {
        state.charts.unshift(action.payload.chart);
      })
      // Fetch charts
      .addCase(fetchCharts.fulfilled, (state, action) => {
        state.charts = action.payload.charts;
      })
      // Delete chart
      .addCase(deleteChartAsync.fulfilled, (state, action) => {
        state.charts = state.charts.filter(chart => chart.id !== action.payload);
      })
      // Create insight
      .addCase(createInsight.fulfilled, (state, action) => {
        state.insights.unshift(action.payload.insight);
      })
      // Fetch insights
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.insights = action.payload.insights;
      })
      // Delete insight
      .addCase(deleteInsightAsync.fulfilled, (state, action) => {
        state.insights = state.insights.filter(insight => insight.id !== action.payload);
      });
  },
});

export const {
  setLoading,
  setError,
  setFiles,
  addFile,
  deleteFile,
  setCurrentFile,
  setCharts,
  addChart,
  deleteChart,
  setInsights,
  addInsight,
} = dataSlice.actions;

export default dataSlice.reducer;