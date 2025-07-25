import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '../store';
import { toggleLike, addComment, deleteBlog } from '../store/blogSlice';
import { Heart, MessageCircle, User, Calendar, Tag, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Blog, Comment } from '../types';
import CommentSection from '../components/Blog/CommentSection';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const foundBlog = blogs.find(b => b.id === id);
    setBlog(foundBlog || null);
  }, [id, blogs]);

  const handleLike = () => {
    if (user && blog) {
      dispatch(toggleLike({ blogId: blog.id, userId: user.id }));
    }
  };

  const handleAddComment = (content: string) => {
    if (user && blog) {
      const newComment: Comment = {
        id: Date.now().toString(),
        content,
        author: user,
        blogId: blog.id,
        createdAt: new Date(),
        likes: [],
      };
      dispatch(addComment({ blogId: blog.id, comment: newComment }));
    }
  };

  const handleDelete = () => {
    if (blog && window.confirm('Are you sure you want to delete this blog?')) {
      dispatch(deleteBlog(blog.id));
      navigate('/');
    }
  };

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = user ? blog.likes.includes(user.id) : false;
  const isAuthor = user && user.id === blog.author.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                <Tag className="h-3 w-3 mr-1" />
                {blog.category}
              </span>
              
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/edit/${blog.id}`}
                    className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            {/* Author and Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {blog.author.avatar ? (
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.fullName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{blog.author.fullName}</p>
                    <p className="text-sm text-gray-500">@{blog.author.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 transition-colors ${
                    isLiked ? 'text-rose-600' : 'text-gray-500 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{blog.likes.length}</span>
                </button>
                
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>{blog.comments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-indigo"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      {/* Comments */}
      <CommentSection
        comments={blog.comments}
        onAddComment={handleAddComment}
        currentUser={user}
      />
    </div>
  );
};

export default BlogDetail;