'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, BookOpen, FileText, GraduationCap } from 'lucide-react';

export default function AktuheperChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "👋 Hello! Welcome to **Aktuheper**\n\nI'm your AI learning assistant. I can help you with:\n\n✨ Finding study materials\n📚 Course information\n📄 Previous year papers\n🎯 Exam preparation tips\n🧭 Website navigation\n\nWhat would you like to know?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputValue,
                    conversationHistory: messages.slice(-6),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const botMessage = {
                    text: data.response,
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                const errorMessage = {
                    text: '❌ ' + (data.error || 'Sorry, I encountered an error. Please try again.'),
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                text: '❌ Network error. Please check your connection and try again.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickActions = [
        { icon: BookOpen, text: "What courses available?", query: "What courses are available on Aktuheper?" },
        { icon: FileText, text: "Previous papers", query: "Where can I find previous year papers?" },
        { icon: GraduationCap, text: "Study materials", query: "How do I download study materials?" },
    ];

    const handleQuickAction = (query) => {
        if (!isLoading) {
            setInputValue(query);
            setTimeout(() => sendMessage(), 100);
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-5 right-5 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-[9999] group ${isOpen ? 'rotate-90 scale-95' : ''
                    }`}
                aria-label="Toggle chat"
            >
                <div className="relative">
                    {isOpen ? (
                        <X size={24} className="sm:w-7 sm:h-7" />
                    ) : (
                        <>
                            <MessageCircle size={24} className="sm:w-7 sm:h-7" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                        </>
                    )}
                </div>
            </button>

            {/* Chat Window - Fixed positioning with proper constraints */}
            <div
                className={`fixed z-[9998] transition-all duration-300 ease-out ${isOpen
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                    }
        bottom-20 right-5
        w-[calc(100vw-2.5rem)] max-w-md
        h-[calc(100vh-7rem)] max-h-[600px]
        sm:bottom-24 sm:right-6
        lg:max-w-lg
        `}
            >
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

                    {/* Header - Enhanced Design */}
                    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-4 sm:p-5 rounded-t-3xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                backgroundSize: '24px 24px'
                            }}></div>
                        </div>

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg">Aktuheper AI</h3>
                                    <p className="text-xs text-white/90 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        Online • Ready to help
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                                aria-label="Close chat"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area - Improved scrolling */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-b from-gray-50 to-white space-y-4 scroll-smooth">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-2 sm:gap-3 animate-fadeIn ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-base ${message.sender === 'user'
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md'
                                        : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 shadow-sm'
                                    }`}>
                                    {message.sender === 'user' ? '👤' : '🤖'}
                                </div>

                                {/* Message Bubble */}
                                <div className={`max-w-[75%] sm:max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'
                                    } flex flex-col gap-1`}>
                                    <div
                                        className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-md ${message.sender === 'user'
                                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-md'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                                            }`}
                                    >
                                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                            {message.text}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] sm:text-xs px-2 ${message.sender === 'user' ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex gap-3 animate-fadeIn">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 flex items-center justify-center shadow-sm">
                                    🤖
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-5 py-4 shadow-md">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions - Show only when no loading */}
                    {!isLoading && messages.length === 1 && (
                        <div className="px-3 sm:px-4 pb-2 bg-white border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2 font-medium">Quick Actions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickActions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickAction(action.query)}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 rounded-xl text-xs font-medium transition-all hover:shadow-md border border-indigo-100"
                                    >
                                        <action.icon size={14} />
                                        <span>{action.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area - Enhanced */}
                    <div className="p-3 sm:p-4 bg-white border-t border-gray-200 rounded-b-3xl">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    rows="1"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 text-sm resize-none transition-all bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ maxHeight: '100px', minHeight: '44px' }}
                                />
                            </div>

                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                aria-label="Send message"
                            >
                                <Send size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                            Powered by Gemini AI • Press Enter to send
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }

        /* Smooth scroll behavior */
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
        </>
    );
}