import React, { useState, useEffect } from 'react';
import { BarChart, Clock, Award } from 'lucide-react';

const Dashboard = () => {
  const [quizHistory, setQuizHistory] = useState(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [newQuizSubject, setNewQuizSubject] = useState('');
  interface Quiz {
    subject: string;
    questions: { question: string; options: string[]; answer: string }[];
  }
  
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    if (currentQuiz) {
      const id = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [currentQuiz]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuizSubject(e.target.value);
  };

  const handleGenerateQuiz = () => {
    const questions = generateQuestions(newQuizSubject);
    setCurrentQuiz({ subject: newQuizSubject, questions });
    setCurrentQuestionIndex(0);
    setSelectedOptions([]);
    setTimer(0);
  };

  const generateQuestions = (subject: string) => {
    const reactQuestions = [
      { question: 'What is React?', options: ['Library', 'Framework', 'Language', 'Tool'], answer: 'Library' },
      { question: 'What is JSX?', options: ['JavaScript XML', 'JavaScript', 'Java', 'XML'], answer: 'JavaScript XML' },
      { question: 'What is a component?', options: ['Function', 'Class', 'Module', 'All of the above'], answer: 'All of the above' },
      { question: 'What is state?', options: ['Data', 'Function', 'Class', 'None of the above'], answer: 'Data' },
      { question: 'What is a prop?', options: ['Property', 'Function', 'Class', 'None of the above'], answer: 'Property' },
      { question: 'What is useState?', options: ['Hook', 'Function', 'Class', 'None of the above'], answer: 'Hook' },
      { question: 'What is useEffect?', options: ['Hook', 'Function', 'Class', 'None of the above'], answer: 'Hook' },
      { question: 'What is a hook?', options: ['Function', 'Class', 'Module', 'None of the above'], answer: 'Function' },
      { question: 'What is a context?', options: ['Function', 'Class', 'Module', 'None of the above'], answer: 'Function' },
      { question: 'What is a ref?', options: ['Reference', 'Function', 'Class', 'None of the above'], answer: 'Reference' },
    ];

    const cppQuestions = [
      { question: 'What is C++?', options: ['Language', 'Library', 'Framework', 'Tool'], answer: 'Language' },
      { question: 'What is a class?', options: ['Blueprint', 'Function', 'Module', 'None of the above'], answer: 'Blueprint' },
      { question: 'What is an object?', options: ['Instance', 'Function', 'Class', 'None of the above'], answer: 'Instance' },
      { question: 'What is inheritance?', options: ['Feature', 'Function', 'Class', 'None of the above'], answer: 'Feature' },
      { question: 'What is polymorphism?', options: ['Feature', 'Function', 'Class', 'None of the above'], answer: 'Feature' },
      { question: 'What is encapsulation?', options: ['Feature', 'Function', 'Class', 'None of the above'], answer: 'Feature' },
      { question: 'What is abstraction?', options: ['Feature', 'Function', 'Class', 'None of the above'], answer: 'Feature' },
      { question: 'What is a constructor?', options: ['Function', 'Class', 'Module', 'None of the above'], answer: 'Function' },
      { question: 'What is a destructor?', options: ['Function', 'Class', 'Module', 'None of the above'], answer: 'Function' },
      { question: 'What is a pointer?', options: ['Variable', 'Function', 'Class', 'None of the above'], answer: 'Variable' },
    ];

    if (subject.toLowerCase() === 'react') {
      return reactQuestions;
    } else if (subject.toLowerCase() === 'c++') {
      return cppQuestions;
    } else {
      return Array.from({ length: 10 }, (_, index) => ({
        question: `Question ${index + 1} for ${subject}`,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        answer: 'Option 1', // Default correct answer for other subjects
      }));
    }
  };

  const handleOptionSelect = (option: string) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestionIndex] = option;
    setSelectedOptions(updatedOptions);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleSubmitQuiz = () => {
    clearInterval(intervalId as number);
    const score = calculateScore();
    const date = new Date().toISOString().split('T')[0];
    const duration = `${Math.floor(timer / 60)} mins ${timer % 60} secs`;
    const newHistory = [
      ...quizHistory,
      { subject: newQuizSubject, score, date, duration },
    ];
    setQuizHistory(newHistory);
    localStorage.setItem('quizHistory', JSON.stringify(newHistory));
    setCurrentQuiz(null);
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    return currentQuiz.questions.reduce((score, question, index) => {
      if (selectedOptions[index] === question.answer) {
        return score + 10;
      }
      return score;
    }, 0);
  };

  const averageScore = quizHistory.length
    ? quizHistory.reduce((acc: number, quiz: { score: number }) => acc + quiz.score, 0) / quizHistory.length
    : 0;
  const totalTime = quizHistory.reduce((acc: number, quiz: { duration: string }) => acc + parseInt(quiz.duration), 0);
  const quizzesCompleted = quizHistory.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Average Score</h2>
            <BarChart className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{averageScore.toFixed(2)}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Total Time</h2>
            <Clock className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{totalTime} mins</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Quizzes Completed</h2>
            <Award className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">{quizzesCompleted}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Generate New Quiz</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="subject"
            value={newQuizSubject}
            onChange={handleInputChange}
            placeholder="Enter subject (e.g., React, C++)"
            className="p-2 border rounded"
          />
          <button
            onClick={handleGenerateQuiz}
            className="bg-indigo-600 text-white py-2 px-4 rounded"
          >
            Generate Quiz
          </button>
        </div>
      </div>

      {currentQuiz && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Quiz: {currentQuiz.subject}</h2>
          <p className="mb-4">Time: {Math.floor(timer / 60)} mins {timer % 60} secs</p>
          <div className="mb-4">
            <p className="text-xl mb-2">{currentQuiz.questions[currentQuestionIndex].question}</p>
            {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`block w-full text-left p-2 border rounded mb-2 ${
                  selectedOptions[currentQuestionIndex] === option ? 'bg-indigo-600 text-white' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              className="bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          )}
        </div>
      )}

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
              {quizHistory.map((quiz: { subject: string; score: number; date: string; duration: string }, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
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