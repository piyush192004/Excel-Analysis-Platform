import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogState, Blog, Comment } from '../types';

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  searchQuery: '',
  selectedCategory: '',
  categories: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education'],
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.unshift(action.payload);
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    },
    deleteBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
    },
    setCurrentBlog: (state, action: PayloadAction<Blog | null>) => {
      state.currentBlog = action.payload;
    },
    toggleLike: (state, action: PayloadAction<{ blogId: string; userId: string }>) => {
      const blog = state.blogs.find(b => b.id === action.payload.blogId);
      if (blog) {
        const likeIndex = blog.likes.indexOf(action.payload.userId);
        if (likeIndex > -1) {
          blog.likes.splice(likeIndex, 1);
        } else {
          blog.likes.push(action.payload.userId);
        }
      }
    },
    addComment: (state, action: PayloadAction<{ blogId: string; comment: Comment }>) => {
      const blog = state.blogs.find(b => b.id === action.payload.blogId);
      if (blog) {
        blog.comments.push(action.payload.comment);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  setCurrentBlog,
  toggleLike,
  addComment,
  setSearchQuery,
  setSelectedCategory,
  setLoading,
} = blogSlice.actions;

export default blogSlice.reducer;