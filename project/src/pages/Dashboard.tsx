import React from 'react';
import { BarChart, Clock, Award } from 'lucide-react';

const Dashboard = () => {
  // Mock quiz history data
  const quizHistory = [
    { id: 1, subject: 'Mathematics', score: 85, date: '2024-03-15', duration: '45 mins' },
    { id: 2, subject: 'Physics', score: 92, date: '2024-03-14', duration: '30 mins' },
    { id: 3, subject: 'Chemistry', score: 78, date: '2024-03-13', duration: '40 mins' },
    { id: 4, subject: 'Biology', score: 88, date: '2024-03-12', duration: '35 mins' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Average Score</h2>
            <BarChart className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">85.75%</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Total Time</h2>
            <Clock className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">2.5 hrs</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Quizzes Completed</h2>
            <Award className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">4</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Quiz History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Subject</th>
                <th className="text-left py-3 px-4">Score</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Duration</th>
              </tr>
            </thead>
            <tbody>
              {quizHistory.map((quiz) => (
                <tr key={quiz.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{quiz.subject}</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {quiz.score}%
                    </span>
                  </td>
                  <td className="py-3 px-4">{quiz.date}</td>
                  <td className="py-3 px-4">{quiz.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;