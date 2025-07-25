import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PenTool, BookOpen, Users, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Share Your Stories with the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {' '}World
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join our community of passionate writers and readers. Create, discover, and engage with 
            amazing content from creators around the globe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <Link
                to="/create"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-900 bg-white hover:bg-gray-50 transition-colors"
              >
                <PenTool className="h-5 w-5 mr-2" />
                Start Writing
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-900 bg-white hover:bg-gray-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-indigo-900 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-lg mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">1000+</h3>
              <p className="text-indigo-200">Articles Published</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-lg mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">500+</h3>
              <p className="text-indigo-200">Active Writers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-lg mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">50K+</h3>
              <p className="text-indigo-200">Monthly Readers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;