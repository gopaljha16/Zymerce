import { useState, useRef, useEffect } from 'react';
import { 
    ChatBubbleLeftRightIcon, 
    XMarkIcon, 
    PaperAirplaneIcon,
    SparklesIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function AIChatbot() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! 👋 I\'m your AI shopping assistant. How can I help you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        
        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${BASEURL}/api/ai/chatbot/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            
            if (data.error) {
                toast.error('Chatbot error. Please check API configuration.');
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: data.response || 'Sorry, I encountered an error. Please try again.' 
                }]);
            } else {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: data.response 
                }]);
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, I\'m having trouble connecting. Please try again later.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickQuestions = [
        'What products do you sell?',
        'What is your return policy?',
        'Do you offer free shipping?',
        'What payment methods do you accept?',
    ];

    const handleQuickQuestion = (question) => {
        setInput(question);
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-110 z-50 flex items-center gap-2"
                >
                    <SparklesIcon className="w-6 h-6" />
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-scale-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <SparklesIcon className="w-8 h-8" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">AI Assistant</h3>
                                <p className="text-xs text-white/80">Powered by Gemini</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                        message.role === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white text-gray-900 shadow-md rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-900 shadow-md p-3 rounded-2xl rounded-bl-none">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length === 1 && (
                        <div className="p-4 border-t bg-white">
                            <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(question)}
                                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PaperAirplaneIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default AIChatbot;
