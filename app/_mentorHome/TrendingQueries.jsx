"use client";
import React, { useState } from 'react';

export default function TrendingQueries() {
    // Custom scrollbar styles
    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(96, 165, 250, 0.3);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(96, 165, 250, 0.5);
        }
    `;
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showAnswersModal, setShowAnswersModal] = useState(false);
    const [showAddAnswerModal, setShowAddAnswerModal] = useState(false);
    const [newAnswer, setNewAnswer] = useState('');
    const [upvotedAnswers, setUpvotedAnswers] = useState({});

    const handleUpvote = (answerId) => {
        setUpvotedAnswers(prev => ({
            ...prev,
            [answerId]: !prev[answerId]
        }));
    };

    const queries = [
        {
            id: 1,
            title: "How to prepare for competitive programming?",
            description: "I'm a second-year CSE student looking to start with competitive programming. What resources and practice platforms would you recommend?",
            user: {
                name: "Rahul Sharma",
                avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=user1",
                college: "IIT Delhi",
                branch: "CSE",
                year: "2nd Year"
            },
            category: "Competitive Programming",
            views: 234,
            answers: [
                {
                    id: 1,
                    content: "Start with Codeforces and LeetCode. Practice daily and focus on understanding algorithms first. Begin with easy problems and gradually increase difficulty.",
                    user: {
                        name: "Prashant Kumar",
                        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor1",
                        college: "IIT Bombay",
                        branch: "CSE",
                        year: "4th Year"
                    },
                    upvotes: 45,
                    isUpvoted: false,
                    timestamp: "2 hours ago"
                },
                {
                    id: 2,
                    content: "I'd recommend starting with HackerRank for basics, then moving to Codeforces. Also, participate in contests regularly to build speed and accuracy.",
                    user: {
                        name: "Neha Singh",
                        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=user2",
                        college: "NIT Trichy",
                        branch: "IT",
                        year: "3rd Year"
                    },
                    upvotes: 32,
                    isUpvoted: false,
                    timestamp: "5 hours ago"
                }
            ],
            timestamp: "3 hours ago"
        },
        {
            id: 2,
            title: "Best internship opportunities for ECE students?",
            description: "Looking for good internship opportunities in VLSI and embedded systems. Any suggestions for companies or startups?",
            user: {
                name: "Amit Verma",
                avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=user3",
                college: "NIT Warangal",
                branch: "ECE",
                year: "3rd Year"
            },
            category: "Internships",
            views: 189,
            answers: [
                {
                    id: 1,
                    content: "Texas Instruments, Qualcomm, and Intel have great VLSI programs. Also check out startups like SiMa.ai and Axelera AI.",
                    user: {
                        name: "Rajesh Kumar",
                        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor2",
                        college: "IIT Madras",
                        branch: "ECE",
                        year: "Alumni"
                    },
                    upvotes: 28,
                    isUpvoted: false,
                    timestamp: "1 day ago"
                }
            ],
            timestamp: "6 hours ago"
        },
        {
            id: 3,
            title: "How to balance academics and coding practice?",
            description: "Finding it hard to manage time between college assignments and improving coding skills. How do seniors manage this?",
            user: {
                name: "Pooja Gupta",
                avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=user4",
                college: "BITS Pilani",
                branch: "CSE",
                year: "2nd Year"
            },
            category: "Time Management",
            views: 312,
            answers: [
                {
                    id: 1,
                    content: "Create a fixed schedule. Dedicate 1-2 hours daily for coding practice. Use weekends for longer problem-solving sessions.",
                    user: {
                        name: "Vikram Patel",
                        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor3",
                        college: "IIT Kharagpur",
                        branch: "CSE",
                        year: "4th Year"
                    },
                    upvotes: 56,
                    isUpvoted: false,
                    timestamp: "3 hours ago"
                },
                {
                    id: 2,
                    content: "Focus on quality over quantity. Even 30 minutes of focused practice daily is better than irregular long sessions.",
                    user: {
                        name: "Ananya Reddy",
                        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=user5",
                        college: "IIIT Hyderabad",
                        branch: "CSE",
                        year: "3rd Year"
                    },
                    upvotes: 41,
                    isUpvoted: false,
                    timestamp: "4 hours ago"
                }
            ],
            timestamp: "5 hours ago"
        }
    ];

    const handleViewAnswers = (query) => {
        setSelectedQuery(query);
        setShowAnswersModal(true);
    };

    const handleAddAnswer = (query) => {
        setSelectedQuery(query);
        setShowAddAnswerModal(true);
    };

    const submitAnswer = () => {
        if (newAnswer.trim()) {
            console.log("Submitting answer:", newAnswer);
            setNewAnswer('');
            setShowAddAnswerModal(false);
        }
    };

    return (
        <div className="section-theme py-12 px-6">
            <style>{scrollbarStyles}</style>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-theme-primary mb-1">Trending Queries</h1>
                    <p className="text-theme-secondary text-sm">Get answers from experienced mentors and peers</p>
                </div>

                {/* Queries Grid */}
                <div className="space-y-4">
                    {queries.map((query) => (
                        <div
                            key={query.id}
                            className="group bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-800"
                        >
                            {/* Top Row: User + Category */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={query.user.avatar}
                                        alt={query.user.name}
                                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-700"
                                    />
                                    <div>
                                        <p className="text-theme-primary font-semibold text-xs">{query.user.name}</p>
                                        <p className="text-theme-muted text-[10px]">{query.user.branch} • {query.user.college}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-medium">
                                        {query.category}
                                    </span>
                                    <span className="text-theme-muted text-[10px]">{query.timestamp}</span>
                                </div>
                            </div>

                            {/* Query Content */}
                            <div className="mb-3">
                                <h2 className="text-theme-primary font-bold text-base mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                    {query.title}
                                </h2>
                                <p className="text-theme-secondary text-xs leading-relaxed line-clamp-2">
                                    {query.description}
                                </p>
                            </div>

                            {/* Bottom Row: Stats + Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4 text-theme-muted text-xs">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>{query.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <span>{query.answers.length} answers</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewAnswers(query)}
                                        className="px-3 py-1.5 bg-transparent border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 text-xs font-semibold rounded-lg transition-all duration-200"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => handleAddAnswer(query)}
                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-blue-500/30"
                                    >
                                        Answer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Link */}
                <div className="flex justify-center mt-8">
                    <a
                        href="/login"
                        className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-all duration-200"
                    >
                        <span className="underline-offset-4 group-hover:underline">View More Queries</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>

                {/* View Answers Modal */}
                {showAnswersModal && selectedQuery && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
                            {/* Colorful Gradient Header */}
                            <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 dark:from-purple-600 dark:via-pink-600 dark:to-rose-600 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-white font-bold text-lg mb-1.5 leading-tight line-clamp-2">{selectedQuery.title}</h2>
                                        <div className="flex items-center gap-3 text-white/90 text-xs">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                                                </svg>
                                                {selectedQuery.answers.length} answers
                                            </span>
                                            <span>•</span>
                                            <span>{selectedQuery.views} views</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAnswersModal(false)}
                                        className="text-white/90 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all flex-shrink-0 hover:rotate-90 duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-4 overflow-y-auto max-h-[calc(85vh-100px)] custom-scrollbar">
                                {/* Original Query */}
                                <div className="mb-4 p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-900/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <img
                                            src={selectedQuery.user.avatar}
                                            alt={selectedQuery.user.name}
                                            className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-800 shadow-md"
                                        />
                                        <div>
                                            <p className="text-theme-primary font-bold text-xs">{selectedQuery.user.name}</p>
                                            <p className="text-theme-muted text-[10px]">{selectedQuery.user.year} • {selectedQuery.user.branch} • {selectedQuery.user.college}</p>
                                        </div>
                                    </div>
                                    <p className="text-theme-secondary text-xs leading-relaxed">{selectedQuery.description}</p>
                                </div>

                                {/* Answers List */}
                                <div className="space-y-3">
                                    {selectedQuery.answers.map((answer) => {
                                        const isUpvoted = upvotedAnswers[answer.id];
                                        const displayUpvotes = answer.upvotes + (isUpvoted ? 1 : 0);

                                        return (
                                            <div key={answer.id} className="p-3 bg-gradient-to-br from-white to-blue-50/50 dark:from-zinc-800/50 dark:to-blue-950/10 rounded-xl border border-gray-200 dark:border-zinc-700/50 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-md transition-all duration-300">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <img
                                                        src={answer.user.avatar}
                                                        alt={answer.user.name}
                                                        className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-zinc-700 shadow-sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                                            <p className="text-theme-primary font-bold text-xs truncate">{answer.user.name}</p>
                                                            <span className="text-theme-muted text-[10px] flex-shrink-0 bg-gray-100 dark:bg-zinc-900/50 px-2 py-0.5 rounded-full">{answer.timestamp}</span>
                                                        </div>
                                                        <p className="text-theme-muted text-[10px]">{answer.user.year} • {answer.user.branch} • {answer.user.college}</p>
                                                    </div>
                                                </div>
                                                <p className="text-theme-primary text-xs mb-2.5 leading-relaxed">{answer.content}</p>
                                                <button
                                                    onClick={() => handleUpvote(answer.id)}
                                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${isUpvoted
                                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30'
                                                            : 'bg-gray-100 dark:bg-zinc-900/50 text-theme-secondary hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white hover:shadow-md hover:shadow-orange-500/30'
                                                        }`}
                                                >
                                                    <svg className={`w-4 h-4 transition-transform ${isUpvoted ? 'scale-110' : ''}`} fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                    <span>{displayUpvotes}</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Answer Modal */}
                {showAddAnswerModal && selectedQuery && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
                            {/* Colorful Gradient Header */}
                            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-600 dark:via-blue-600 dark:to-indigo-600 p-4 rounded-t-2xl">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <h2 className="text-white font-bold text-base">Add Your Answer</h2>
                                        </div>
                                        <p className="text-white/90 text-xs truncate">{selectedQuery.title}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddAnswerModal(false)}
                                        className="text-white/90 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all flex-shrink-0 hover:rotate-90 duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-4">
                                {/* Original Query Preview */}
                                <div className="mb-3 p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg border border-cyan-200 dark:border-cyan-900/50">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <svg className="w-3.5 h-3.5 text-theme-secondary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-theme-secondary font-semibold text-[10px] uppercase tracking-wide">Answering to</span>
                                    </div>
                                    <p className="text-theme-primary text-xs leading-relaxed">{selectedQuery.description}</p>
                                </div>

                                {/* Answer Input */}
                                <div className="mb-3">
                                    <label className="flex items-center gap-1.5 text-theme-primary font-bold mb-2 text-xs">
                                        <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Your Answer
                                    </label>
                                    <textarea
                                        value={newAnswer}
                                        onChange={(e) => setNewAnswer(e.target.value)}
                                        placeholder="Share your knowledge and help others..."
                                        className="w-full h-32 px-3 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 text-theme-primary text-xs placeholder:text-theme-muted focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 rounded-lg transition-all resize-none"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowAddAnswerModal(false)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-theme-primary hover:bg-gray-200 dark:hover:bg-zinc-700 font-semibold text-xs rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitAnswer}
                                        disabled={!newAnswer.trim()}
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-600 dark:via-blue-600 dark:to-indigo-600 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                    >
                                        <span>Submit</span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}