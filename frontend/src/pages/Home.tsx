import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, LayoutDashboard } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to AI Learn
          <Sparkles className="inline-block ml-4 text-yellow-400" />
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionize your learning experience with our AI-powered platform.
          Get personalized assistance, track your progress, and master new skills efficiently.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <Link to="/study" className="transform hover:scale-105 transition-transform duration-200">
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
            <BookOpen className="h-16 w-16 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">AI Study Assistant</h2>
            <p className="text-gray-600 text-center">
              Get instant help with your studies using our advanced AI assistant.
              Ask questions, get explanations, and deepen your understanding.
            </p>
          </div>
        </Link>

        <Link to="/dashboard" className="transform hover:scale-105 transition-transform duration-200">
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
            <LayoutDashboard className="h-16 w-16 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Learning Dashboard</h2>
            <p className="text-gray-600 text-center">
              Track your progress, review past quizzes, and analyze your learning journey
              with detailed insights and statistics.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-16 bg-indigo-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose AI Learn?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Personalized Learning</h3>
            <p className="text-gray-600">AI-powered assistance tailored to your unique learning style and pace.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
            <p className="text-gray-600">Comprehensive analytics to monitor your improvement and identify areas for growth.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
            <p className="text-gray-600">Learn anytime, anywhere with our always-available AI study companion.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;