"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Download, ChevronLeft, ChevronRight, Eye, MessageCircle, FileText, Image as ImageIcon, Flame, TrendingUp, ArrowUp, ThumbsUp, Award, Star } from 'lucide-react';

export default function TrendingQueries() {
    const [activeFilter, setActiveFilter] = useState('trending');
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showAnswersModal, setShowAnswersModal] = useState(false);
    const [showAddAnswerModal, setShowAddAnswerModal] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewAttachments, setPreviewAttachments] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [markedHelpful, setMarkedHelpful] = useState(new Set());
    const [answerText, setAnswerText] = useState('');
    const [displayedQueries, setDisplayedQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef(null);

    const filters = [
        { id: 'trending', label: 'Trending', icon: Flame },
        { id: 'academics', label: 'Academics' },
        { id: 'career', label: 'Career' },
        { id: 'college-life', label: 'College Life' },
    ];

    const generateMockQueries = (startId) => [
        {
            id: startId,
            title: 'How to prepare for competitive programming?',
            description: "I'm a second-year CSE student looking to start with competitive programming. What resources and practice platforms would you recommend?",
            user: {
                name: 'Rahul Sharma',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user1',
                college: 'IIT Delhi',
                branch: 'CSE',
                year: 2,
                mentorStatus: null,
            },
            category: 'Competitive Programming',
            views: 234,
            attachments: [
                {
                    id: '1',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
                    name: 'coding-screenshot.png',
                    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200',
                },
                {
                    id: '2',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
                    name: 'code-example.jpg',
                    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=200',
                },
            ],
            answers: [
                {
                    id: 1,
                    content: 'Start with Codeforces and LeetCode. Practice daily and focus on understanding algorithms first. Begin with easy problems and gradually increase difficulty.',
                    user: {
                        name: 'Prashant Kumar',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor1',
                        college: 'IIT Bombay',
                        branch: 'CSE',
                        year: 4,
                        mentorStatus: 'super-mentor',
                    },
                    helpfulCount: 45,
                    timestamp: '2 hours ago',
                },
            ],
            timestamp: '3 hours ago',
        },
        {
            id: startId + 1,
            title: 'Best internship opportunities for ECE students?',
            description: 'Looking for good internship opportunities in VLSI and embedded systems. Any suggestions for companies or startups?',
            user: {
                name: 'Amit Verma',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user3',
                college: 'NIT Warangal',
                branch: 'ECE',
                year: 3,
                mentorStatus: null,
            },
            category: 'Internships',
            views: 189,
            attachments: [],
            answers: [
                {
                    id: 1,
                    content: 'Texas Instruments, Qualcomm, and Intel have great VLSI programs. Also check out startups like SiMa.ai and Axelera AI.',
                    user: {
                        name: 'Rajesh Kumar',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor2',
                        college: 'IIT Madras',
                        branch: 'ECE',
                        year: 'Alumni',
                        mentorStatus: 'mentor',
                    },
                    helpfulCount: 28,
                    timestamp: '1 day ago',
                },
            ],
            timestamp: '6 hours ago',
        },
        {
            id: startId + 2,
            title: 'How to balance academics and coding practice?',
            description: 'Finding it hard to manage time between college assignments and improving coding skills. How do seniors manage this?',
            user: {
                name: 'Pooja Gupta',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user4',
                college: 'BITS Pilani',
                branch: 'CSE',
                year: 1,
                mentorStatus: null,
            },
            category: 'Time Management',
            views: 312,
            attachments: [
                {
                    id: '3',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
                    name: 'study-schedule.png',
                    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200',
                },
            ],
            answers: [
                {
                    id: 1,
                    content: 'Create a fixed schedule. Dedicate 1-2 hours daily for coding practice. Use weekends for longer problem-solving sessions.',
                    user: {
                        name: 'Vikram Patel',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor3',
                        college: 'IIT Kharagpur',
                        branch: 'CSE',
                        year: 4,
                        mentorStatus: 'super-mentor',
                    },
                    helpfulCount: 56,
                    timestamp: '3 hours ago',
                },
            ],
            timestamp: '5 hours ago',
        },
        {
            id: startId + 3,
            title: 'Resume tips for freshers applying to product companies?',
            description: 'What should I highlight in my resume when applying to companies like Google, Microsoft, Amazon as a fresher?',
            user: {
                name: 'Sanjay Desai',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user6',
                college: 'VIT Vellore',
                branch: 'IT',
                year: 3,
                mentorStatus: 'mentor',
            },
            category: 'Career',
            views: 421,
            attachments: [
                {
                    id: '4',
                    type: 'pdf',
                    url: '#',
                    name: 'resume-template.pdf',
                },
                {
                    id: '5',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
                    name: 'resume-example.jpg',
                    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200',
                },
            ],
            answers: [
                {
                    id: 1,
                    content: 'Focus on projects with real impact. Quantify your achievements (e.g., improved performance by 40%). Keep it to one page.',
                    user: {
                        name: 'Deepak Malhotra',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor4',
                        college: 'IIT Delhi',
                        branch: 'CSE',
                        year: 'Alumni',
                        mentorStatus: 'mentor',
                    },
                    helpfulCount: 68,
                    timestamp: '1 hour ago',
                },
            ],
            timestamp: '2 hours ago',
        },
        {
            id: startId + 4,
            title: 'What are the best resources for learning DSA?',
            description: 'Just started my first year and want to get ahead with Data Structures. Where should I begin?',
            user: {
                name: 'Neha Singh',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user7',
                college: 'IIIT Hyderabad',
                branch: 'CSE',
                year: 1,
                mentorStatus: null,
            },
            category: 'Academics',
            views: 145,
            attachments: [],
            answers: [],
            timestamp: '4 hours ago',
        },
        {
            id: startId + 5,
            title: 'Tips for campus placements preparation?',
            description: 'Final year student here. What should be my strategy for the next 6 months?',
            user: {
                name: 'Karthik Reddy',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user8',
                college: 'NIT Trichy',
                branch: 'CSE',
                year: 4,
                mentorStatus: null,
            },
            category: 'Career',
            views: 567,
            attachments: [],
            answers: [
                {
                    id: 1,
                    content: 'Start with mock interviews and work on your resume. Practice coding daily and prepare your projects for interviews.',
                    user: {
                        name: 'Arjun Mehta',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor5',
                        college: 'IIT Kanpur',
                        branch: 'CSE',
                        year: 'Alumni',
                        mentorStatus: 'super-mentor',
                    },
                    helpfulCount: 89,
                    timestamp: '5 hours ago',
                },
            ],
            timestamp: '8 hours ago',
        },
    ];

    useEffect(() => {
        setDisplayedQueries(generateMockQueries(1));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading) {
                    loadMoreQueries();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loading, page]);

    const loadMoreQueries = () => {
        setLoading(true);
        setTimeout(() => {
            const newQueries = generateMockQueries(page * 6 + 1);
            setDisplayedQueries(prev => [...prev, ...newQueries]);
            setPage(prev => prev + 1);
            setLoading(false);
        }, 500);
    };

    const handleViewAnswers = (query) => {
        setSelectedQuery(query);
        setShowAnswersModal(true);
    };

    const handleAddAnswer = (query) => {
        setSelectedQuery(query);
        setShowAddAnswerModal(true);
    };

    const handleSubmitAnswer = () => {
        if (answerText.trim()) {
            console.log('New answer submitted:', answerText);
            setAnswerText('');
            setShowAddAnswerModal(false);
        }
    };

    const handleAttachmentClick = (query, index) => {
        if (query.attachments && query.attachments.length > 0) {
            setPreviewAttachments(query.attachments);
            setPreviewIndex(index);
            setShowImagePreview(true);
        }
    };

    const handleMarkHelpful = (answerId) => {
        setMarkedHelpful((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(answerId)) {
                newSet.delete(answerId);
            } else {
                newSet.add(answerId);
            }
            return newSet;
        });
    };
    return (
        <div className="min-h-screen bg-black text-white py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">Trending Queries</h1>
                    <p className="text-gray-400 text-xs sm:text-sm">
                        Get answers from experienced mentors and peers
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="mb-4 sm:mb-6 overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activeFilter === filter.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        {Icon && <Icon className="w-3 h-3" />}
                                        {filter.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Query Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {displayedQueries.map((query) => (
                        <QueryCard
                            key={query.id}
                            query={query}
                            onViewAnswers={() => handleViewAnswers(query)}
                            onAddAnswer={() => handleAddAnswer(query)}
                            onAttachmentClick={(index) => handleAttachmentClick(query, index)}
                        />
                    ))}
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Infinite Scroll Trigger */}
                <div ref={observerTarget} className="h-4"></div>
            </div>

            {/* View Answers Modal */}
            {showAnswersModal && selectedQuery && (
                <ViewAnswersModal
                    query={selectedQuery}
                    onClose={() => setShowAnswersModal(false)}
                    markedHelpful={markedHelpful}
                    onMarkHelpful={handleMarkHelpful}
                />
            )}

            {/* Add Answer Modal */}
            {showAddAnswerModal && selectedQuery && (
                <AddAnswerModal
                    query={selectedQuery}
                    answerText={answerText}
                    setAnswerText={setAnswerText}
                    onSubmit={handleSubmitAnswer}
                    onClose={() => {
                        setShowAddAnswerModal(false);
                        setAnswerText('');
                    }}
                />
            )}

            {/* Image Preview Modal */}
            {showImagePreview && (
                <ImagePreviewModal
                    attachments={previewAttachments}
                    currentIndex={previewIndex}
                    setCurrentIndex={setPreviewIndex}
                    onClose={() => setShowImagePreview(false)}
                />
            )}
        </div>
    );
}

// Query Card Component
function QueryCard({ query, onViewAnswers, onAddAnswer, onAttachmentClick }) {
    const hasAttachments = query.attachments && query.attachments.length > 0;
    const displayAttachments = query.attachments ? query.attachments.slice(0, 3) : [];
    const remainingCount = query.attachments ? query.attachments.length - 3 : 0;

    const getUserBadge = (user) => {
        if (user.year === 1) {
            return { text: 'Fresher', color: 'bg-green-600' };
        } else if (user.year === 2) {
            return { text: 'Senior 2nd Year', color: 'bg-blue-600' };
        } else if (user.year === 3) {
            return { text: 'Senior 3rd Year', color: 'bg-purple-600' };
        } else if (user.year === 4) {
            return { text: 'Senior 4th Year', color: 'bg-orange-600' };
        }
        return null;
    };

    const getMentorBadge = (user) => {
        if (user.mentorStatus === 'super-mentor') {
            return { text: 'Super Mentor', icon: Star, color: 'bg-gradient-to-r from-yellow-600 to-orange-600' };
        } else if (user.mentorStatus === 'mentor') {
            return { text: 'Mentor', icon: Award, color: 'bg-indigo-600' };
        }
        return null;
    };

    const userBadge = getUserBadge(query.user);
    const mentorBadge = getMentorBadge(query.user);

    return (
        <div className="group p-3 sm:p-4 bg-zinc-900 border border-gray-800 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-800/50">
            <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img
                        src={query.user.avatar}
                        alt={query.user.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-700 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-xs sm:text-sm text-white truncate">{query.user.name}</p>
                            {userBadge && (
                                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${userBadge.color} text-white rounded flex-shrink-0`}>
                                    {userBadge.text}
                                </span>
                            )}
                            {mentorBadge && (
                                <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${mentorBadge.color} text-white rounded flex items-center gap-0.5 flex-shrink-0`}>
                                    <mentorBadge.icon className="w-2.5 h-2.5" />
                                    {mentorBadge.text}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-[10px] sm:text-[11px] truncate">
                            {query.user.branch} • {query.user.college}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 bg-gray-800 text-gray-300 rounded whitespace-nowrap">
                        {query.category}
                    </span>
                    <span className="text-gray-500 text-[9px] sm:text-[10px] whitespace-nowrap">{query.timestamp}</span>
                </div>
            </div>

            <div className="mb-3">
                <h2 className="font-bold text-sm sm:text-base mb-1.5 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {query.title}
                </h2>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {query.description}
                </p>
            </div>

            {hasAttachments && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {displayAttachments.map((attachment, index) => (
                        <button
                            key={attachment.id}
                            onClick={() => onAttachmentClick(index)}
                            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border border-gray-700 hover:border-blue-600 transition-colors flex-shrink-0"
                        >
                            {attachment.type === 'image' ? (
                                <img
                                    src={attachment.thumbnail || attachment.url}
                                    alt={attachment.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                </div>
                            )}
                        </button>
                    ))}
                    {remainingCount > 0 && (
                        <button
                            onClick={() => onAttachmentClick(3)}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-md border border-gray-700 bg-gray-800 flex items-center justify-center hover:border-blue-600 transition-colors flex-shrink-0"
                        >
                            <span className="text-xs sm:text-sm font-semibold text-gray-400">
                                +{remainingCount}
                            </span>
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-800 gap-2">
                <div className="flex items-center gap-3 sm:gap-4 text-gray-400 text-xs flex-wrap">
                    <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="text-[10px] sm:text-xs">{query.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="text-[10px] sm:text-xs">{query.answers.length} answers</span>
                    </div>
                    {hasAttachments && (
                        <div className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="text-[10px] sm:text-xs">{query.attachments.length}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                        onClick={onViewAnswers}
                        className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-700 text-gray-300 rounded hover:bg-gray-800 transition-colors"
                    >
                        View
                    </button>
                    <button
                        onClick={onAddAnswer}
                        className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Answer
                    </button>
                </div>
            </div>
        </div>
    );
}

// View Answers Modal Component
function ViewAnswersModal({ query, onClose, markedHelpful, onMarkHelpful }) {
    const getUserBadge = (user) => {
        if (user.year === 1) {
            return { text: 'Fresher', color: 'bg-green-600' };
        } else if (user.year === 2) {
            return { text: 'Senior 2nd Year', color: 'bg-blue-600' };
        } else if (user.year === 3) {
            return { text: 'Senior 3rd Year', color: 'bg-purple-600' };
        } else if (user.year === 4) {
            return { text: 'Senior 4th Year', color: 'bg-orange-600' };
        }
        return null;
    };

    const getMentorBadge = (user) => {
        if (user.mentorStatus === 'super-mentor') {
            return { text: 'Super Mentor', icon: Star, color: 'bg-gradient-to-r from-yellow-600 to-orange-600' };
        } else if (user.mentorStatus === 'mentor') {
            return { text: 'Mentor', icon: Award, color: 'bg-indigo-600' };
        }
        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-zinc-900 border border-gray-800 rounded-lg max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-base sm:text-lg font-bold line-clamp-2 flex-1">{query.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-120px)] sm:max-h-[60vh]">
                    <div className="space-y-4">
                        {query.answers.map((answer) => {
                            const isMarkedHelpful = markedHelpful.has(answer.id);
                            const userBadge = getUserBadge(answer.user);
                            const mentorBadge = getMentorBadge(answer.user);

                            return (
                                <div
                                    key={answer.id}
                                    className="p-3 sm:p-4 rounded-lg border border-gray-800 bg-black/50"
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <img
                                            src={answer.user.avatar}
                                            alt={answer.user.name}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-700 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                                                <div>
                                                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                        <p className="font-semibold text-xs sm:text-sm text-white">
                                                            {answer.user.name}
                                                        </p>
                                                        {userBadge && (
                                                            <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${userBadge.color} text-white rounded flex-shrink-0`}>
                                                                {userBadge.text}
                                                            </span>
                                                        )}
                                                        {mentorBadge && (
                                                            <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${mentorBadge.color} text-white rounded flex items-center gap-0.5 flex-shrink-0`}>
                                                                <mentorBadge.icon className="w-2.5 h-2.5" />
                                                                {mentorBadge.text}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-[10px] sm:text-xs">
                                                        {answer.user.branch} • {answer.user.college} • {answer.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                                                {answer.content}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onMarkHelpful(answer.id)}
                                                    className={`px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors ${isMarkedHelpful
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-transparent text-gray-400 border border-gray-700 hover:border-gray-600'
                                                        }`}
                                                >
                                                    <ThumbsUp className="w-3 h-3" />
                                                    <span>
                                                        {answer.helpfulCount + (isMarkedHelpful ? 1 : 0)} Helpful
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add Answer Modal Component
function AddAnswerModal({ query, answerText, setAnswerText, onSubmit, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-zinc-900 border border-gray-800 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                <div className="p-4 sm:p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-2 gap-3">
                        <h2 className="text-base sm:text-lg font-bold">Add Your Answer</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{query.title}</p>
                </div>
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                    <textarea
                        placeholder="Share your knowledge and help your peers..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full h-full min-h-[150px] sm:min-h-[200px] p-3 bg-black border border-gray-800 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 resize-none"
                    />
                </div>
                <div className="p-4 sm:p-6 border-t border-gray-800 flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-700 text-gray-300 rounded hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={!answerText.trim()}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Answer
                    </button>
                </div>
            </div>
        </div>
    );
}

// Image Preview Modal Component
function ImagePreviewModal({ attachments, currentIndex, setCurrentIndex, onClose }) {
    const currentAttachment = attachments[currentIndex];
    const hasMultiple = attachments.length > 1;

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : attachments.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < attachments.length - 1 ? prev + 1 : 0));
    };

    const handleDownload = () => {
        window.open(currentAttachment.url, '_blank');
    };

    if (!currentAttachment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
            <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                {/* Controls */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
                    <button
                        onClick={handleDownload}
                        className="p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded transition-colors"
                    >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded transition-colors"
                    >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>

                {/* Navigation */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-2 sm:left-4 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded transition-colors z-10"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 sm:right-4 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded transition-colors z-10"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </>
                )}

                {/* Content */}
                <div className="flex items-center justify-center max-w-full max-h-full">
                    {currentAttachment.type === 'image' ? (
                        <img
                            src={currentAttachment.url}
                            alt={currentAttachment.name}
                            className="max-w-full max-h-[85vh] sm:max-h-[80vh] object-contain"
                        />
                    ) : (
                        <div className="text-center text-white p-6 sm:p-8">
                            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📄</div>
                            <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{currentAttachment.name}</p>
                            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                                {currentAttachment.type.toUpperCase()} file
                            </p>
                            <button
                                onClick={handleDownload}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-white text-white rounded hover:bg-white hover:text-black transition-colors"
                            >
                                Download File
                            </button>
                        </div>
                    )}
                </div>

                {/* Counter */}
                {hasMultiple && (
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-black/70 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                            {currentIndex + 1} / {attachments.length}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}