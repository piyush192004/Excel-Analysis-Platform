import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RootState } from '../store';
import { User, Calendar, PenTool, Eye, Heart, MessageCircle, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { blogs } = useSelector((state: RootState) => state.blog);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  const userBlogs = blogs.filter(blog => blog.author.id === user.id);
  const publishedBlogs = userBlogs.filter(blog => blog.published);
  const draftBlogs = userBlogs.filter(blog => !blog.published);

  const totalLikes = userBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
  const totalComments = userBlogs.reduce((sum, blog) => sum + blog.comments.length, 0);

  const displayBlogs = activeTab === 'published' ? publishedBlogs : draftBlogs;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex items-center space-x-6 -mt-16">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="h-32 w-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="h-32 w-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center">
                <User className="h-16 w-16 text-indigo-600" />
              </div>
            )}
            <div className="pt-16">
              <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center mt-2 text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          {user.bio && (
            <div className="mt-6">
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{userBlogs.length}</div>
          <div className="text-gray-600">Total Blogs</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{publishedBlogs.length}</div>
          <div className="text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-rose-600 mb-2">{totalLikes}</div>
          <div className="text-gray-600">Total Likes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{totalComments}</div>
          <div className="text-gray-600">Total Comments</div>
        </div>
      </div>

      {/* Blog Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Blogs</h2>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PenTool className="h-4 w-4 mr-2" />
              Write New Blog
            </Link>
          </div>
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setActiveTab('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'published'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Published ({publishedBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'drafts'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts ({draftBlogs.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {displayBlogs.length === 0 ? (
            <div className="text-center py-12">
              <PenTool className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab === 'published' ? 'published blogs' : 'drafts'} yet
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'published' 
                  ? 'Start writing and publish your first blog post!' 
                  : 'Create a draft to save your work in progress.'}
              </p>
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Create Blog
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {displayBlogs.map(blog => (
                <div key={blog.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {blog.category}
                        </span>
                        {!blog.published && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link 
                          to={`/blog/${blog.id}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {blog.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>Views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{blog.likes.length}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{blog.comments.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/edit/${blog.id}`}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;