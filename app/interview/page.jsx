'use client';

import { useState, useEffect } from 'react';
import { Users, Code, ChevronDown, ChevronUp, Search, Briefcase, Lightbulb, BookOpen, Star, Loader2 } from 'lucide-react';

// API Configuration - Update these values with your actual Strapi API URL and token
const API_URL = "https://aktuhelperserver-production.up.railway.app/api";
const TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// API Functions
const fetchInterviewQuestions = async () => {
    try {
        const response = await fetch(`${API_URL}/interview-questions`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Failed to fetch questions');

        const data = await response.json();
        return data.data.map(item => {
            const attrs = item.attributes || item;

            // Parse answer if it's a rich text object
            let answerText = attrs.answer;
            if (typeof answerText === 'object' && answerText !== null) {
                // Handle Strapi rich text format
                if (Array.isArray(answerText)) {
                    answerText = answerText.map(block => {
                        if (block.children) {
                            return block.children.map(child => child.text || '').join('');
                        }
                        return '';
                    }).join('\n');
                } else if (answerText.text) {
                    answerText = answerText.text;
                } else {
                    answerText = JSON.stringify(answerText);
                }
            }

            // Parse tips if it's an object/array
            let tipsArray = attrs.tips || [];
            if (typeof tipsArray === 'string') {
                try {
                    tipsArray = JSON.parse(tipsArray);
                } catch (e) {
                    tipsArray = [tipsArray];
                }
            }
            if (!Array.isArray(tipsArray)) {
                tipsArray = [];
            }

            return {
                id: item.id,
                question: attrs.question || '',
                answer: answerText || '',
                type: attrs.type || 'general',
                difficulty: attrs.difficulty || 'medium',
                category: attrs.category || 'General',
                tips: tipsArray,
                popularity: attrs.popularity || 85,
            };
        });
    } catch (error) {
        console.error("Error fetching interview questions:", error);
        return [];
    }
};

export default function InterviewQuestionsPage() {
    const [selectedType, setSelectedType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const questionTypes = [
        { id: 'all', name: 'All Questions', icon: BookOpen, color: 'bg-indigo-600' },
        { id: 'hr', name: 'HR Round', icon: Users, color: 'bg-purple-600' },
        { id: 'technical', name: 'Technical Round', icon: Code, color: 'bg-blue-600' }
    ];

    // Fetch questions on component mount
    useEffect(() => {
        const loadQuestions = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchInterviewQuestions();
                setQuestions(data);
            } catch (err) {
                setError('Failed to load questions. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, []);

    const filteredQuestions = questions.filter(q => {
        const matchesType = selectedType === 'all' || q.type === selectedType;
        const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const toggleQuestion = (questionId) => {
        setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'text-green-600 bg-green-50 border-green-200';
            case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'hard': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getCategoryStats = () => {
        const hrCount = questions.filter(q => q.type === 'hr').length;
        const techCount = questions.filter(q => q.type === 'technical').length;
        return { hrCount, techCount, total: questions.length };
    };

    const stats = getCategoryStats();

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading interview questions...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Questions</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Interview Questions & Answers</h1>
                    </div>
                    <p className="text-gray-600">Comprehensive guide to ace your interviews</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                                <div className="text-sm text-gray-600">Total Questions</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.hrCount}</div>
                                <div className="text-sm text-gray-600">HR Questions</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Code className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.techCount}</div>
                                <div className="text-sm text-gray-600">Technical Questions</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search questions or categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div className="flex gap-2">
                            {questionTypes.map(type => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${selectedType === type.id
                                            ? `${type.color} text-white shadow-md`
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {type.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {filteredQuestions.map((q) => (
                        <div
                            key={q.id}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            {/* Question Header */}
                            <button
                                onClick={() => toggleQuestion(q.id)}
                                className="w-full p-5 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${getDifficultyColor(q.difficulty)}`}>
                                                {q.difficulty}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                {q.category}
                                            </span>
                                            {q.popularity && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    <span>{q.popularity}%</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {q.question}
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0 mt-1">
                                        {expandedQuestion === q.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Answer Section */}
                            {expandedQuestion === q.id && (
                                <div className="border-t border-gray-100 p-5 bg-gradient-to-br from-gray-50 to-white">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lightbulb className="w-5 h-5 text-amber-500" />
                                            <h4 className="font-semibold text-gray-900">Answer:</h4>
                                        </div>
                                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                            {q.answer}
                                        </div>
                                    </div>

                                    {/* Tips */}
                                    {q.tips && q.tips.length > 0 && (
                                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-4 h-4 text-indigo-600" />
                                                <h5 className="font-semibold text-gray-900 text-sm">Pro Tips:</h5>
                                            </div>
                                            <ul className="space-y-1">
                                                {q.tips.map((tip, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                                        <span className="text-indigo-600 mt-1">•</span>
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredQuestions.length === 0 && !loading && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}