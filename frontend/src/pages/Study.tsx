import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/chat';

interface Message {
  text: string;
  isUser: boolean;
}

const Study = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AI study assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAIResponse = async (query: string) => {
    try {
      setIsLoading(true);
      console.log("Sending request to:", API_URL);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: query
        })
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      console.log("Text response:", data.response);
      return {
        text: data.response || "I couldn't process your request."
      };
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return {
        text: "Sorry, I encountered an error. Please try again later."
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { text: "...", isUser: false }]);
    const aiResponse = await fetchAIResponse(userQuery);
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = { 
        text: aiResponse.text, 
        isUser: false
      };
      return newMessages;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md h-[calc(100vh-12rem)]">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">AI Study Assistant</h1>
            <p className="text-gray-600">Ask any question about your studies</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`bg-indigo-600 text-white rounded-lg px-6 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Study;