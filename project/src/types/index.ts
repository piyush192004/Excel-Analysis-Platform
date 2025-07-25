export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

export interface ExcelFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  uploadedAt: Date;
  userId: string;
  data: any[][];
  headers: string[];
  rowCount: number;
  columnCount: number;
}

export interface Chart {
  id: string;
  fileId: string;
  userId: string;
  title: string;
  type: ChartType;
  xAxis: string;
  yAxis: string;
  data: any;
  config: ChartConfig;
  createdAt: Date;
  is3D: boolean;
}

export interface ChartConfig {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  colors?: string[];
}

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'doughnut' | 'radar' | 'polarArea';

export interface AIInsight {
  id: string;
  fileId: string;
  userId: string;
  summary: string;
  insights: string[];
  recommendations: string[];
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface DataState {
  files: ExcelFile[];
  charts: Chart[];
  insights: AIInsight[];
  currentFile: ExcelFile | null;
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  users: User[];
  totalUploads: number;
  totalCharts: number;
  storageUsed: number;
  loading: boolean;
}

// Blog-related types (keeping for future use)
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  category: string;
  tags: string[];
  coverImage?: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  blogId: string;
  createdAt: Date;
  likes: string[];
}

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
}