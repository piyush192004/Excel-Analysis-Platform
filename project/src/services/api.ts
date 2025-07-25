const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    username: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: createHeaders(false),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: createHeaders(false),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Files API
export const filesAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || 'Upload failed');
    }

    return response.json();
  },

  getFiles: async () => {
    return apiRequest('/files');
  },

  getFile: async (id: string) => {
    return apiRequest(`/files/${id}`);
  },

  deleteFile: async (id: string) => {
    return apiRequest(`/files/${id}`, {
      method: 'DELETE',
    });
  },
};

// Charts API
export const chartsAPI = {
  create: async (chartData: {
    fileId: string;
    title: string;
    type: string;
    xAxis: string;
    yAxis: string;
    data: any;
    config: any;
    is3D?: boolean;
  }) => {
    return apiRequest('/charts', {
      method: 'POST',
      body: JSON.stringify(chartData),
    });
  },

  getCharts: async () => {
    return apiRequest('/charts');
  },

  getChart: async (id: string) => {
    return apiRequest(`/charts/${id}`);
  },

  deleteChart: async (id: string) => {
    return apiRequest(`/charts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Insights API
export const insightsAPI = {
  create: async (insightData: {
    fileId: string;
    summary: string;
    insights: string[];
    recommendations: string[];
  }) => {
    return apiRequest('/insights', {
      method: 'POST',
      body: JSON.stringify(insightData),
    });
  },

  getInsights: async () => {
    return apiRequest('/insights');
  },

  deleteInsight: async (id: string) => {
    return apiRequest(`/insights/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  deleteUser: async (id: string) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};