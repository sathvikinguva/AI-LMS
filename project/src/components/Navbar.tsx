import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">AI Learn</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/study" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
              <BookOpen className="h-5 w-5" />
              <span>Study</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;