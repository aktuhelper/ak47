"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, MessageCircle, FileText, ImageIcon, Loader2, ThumbsUp, Award, Star } from 'lucide-react';

export default function UserQueries() {
    const [queries, setQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewAttachments, setPreviewAttachments] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showAnswersModal, setShowAnswersModal] = useState(false);
    const [markedHelpful, setMarkedHelpful] = useState(new Set());
    const observerTarget = useRef(null);

    // Mock data generator
    const generateMockQueries = (pageNum) => {
        const categories = ['Competitive Programming', 'Internships', 'Time Management', 'Career', 'Projects', 'Placements'];
        const colleges = ['IIT Delhi', 'IIT Bombay', 'NIT Warangal', 'BITS Pilani', 'VIT Vellore', 'IIT Madras'];
        const branches = ['CSE', 'ECE', 'IT', 'Mechanical', 'Civil'];
        const years = [1, 2, 3, 4];

        const titles = [
            'How to prepare for competitive programming?',
            'Best internship opportunities for ECE students?',
            'How to balance academics and coding practice?',
            'Resume tips for freshers?',
            'Which programming language to learn first?',
            'How to get into open source contributions?',
            'Best resources for data structures?',
            'Tips for campus placement preparation?',
            'How to build a strong GitHub profile?',
            'Machine learning project ideas for beginners?'
        ];

        const descriptions = [
            "I'm looking for guidance on this topic. Any suggestions would be helpful.",
            "Need advice from experienced seniors or alumni. Please share your insights.",
            "Has anyone faced similar challenges? How did you overcome them?",
            "Looking for practical tips and resources to get started with this.",
            "Would appreciate any guidance or recommendations from the community.",
        ];

        const newQueries = [];
        const startId = (pageNum - 1) * 10;

        for (let i = 0; i < 10; i++) {
            const hasAttachments = Math.random() > 0.6;
            const attachmentCount = hasAttachments ? Math.floor(Math.random() * 4) + 1 : 0;
            const attachments = [];

            if (hasAttachments) {
                for (let j = 0; j < attachmentCount; j++) {
                    const isImage = Math.random() > 0.3;
                    if (isImage) {
                        const imageNum = Math.floor(Math.random() * 1000);
                        attachments.push({
                            id: `${startId + i}-${j}`,
                            type: 'image',
                            url: `https://images.unsplash.com/photo-${1516116216624 + imageNum}?w=800`,
                            name: `image-${j + 1}.png`,
                            thumbnail: `https://images.unsplash.com/photo-${1516116216624 + imageNum}?w=200`,
                        });
                    } else {
                        attachments.push({
                            id: `${startId + i}-${j}`,
                            type: 'pdf',
                            url: '#',
                            name: `document-${j + 1}.pdf`,
                        });
                    }
                }
            }

            // Generate answers
            const answerCount = Math.floor(Math.random() * 5) + 1;
            const answers = [];
            for (let k = 0; k < answerCount; k++) {
                const answerYear = years[Math.floor(Math.random() * years.length)];
                const isMentor = Math.random() > 0.7 && answerYear >= 2; // Only 2nd year+ can be mentors

                answers.push({
                    id: `${startId + i}-answer-${k}`,
                    content: 'Start with Codeforces and LeetCode. Practice daily and focus on understanding algorithms first. Begin with easy problems and gradually increase difficulty. Consistency is key!',
                    user: {
                        name: `Mentor ${k + 1}`,
                        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=mentor${startId + i + k}`,
                        college: colleges[Math.floor(Math.random() * colleges.length)],
                        branch: branches[Math.floor(Math.random() * branches.length)],
                        year: answerYear,
                        mentorStatus: isMentor ? 'mentor' : null,
                    },
                    helpfulCount: Math.floor(Math.random() * 100) + 10,
                    timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
                });
            }

            const userYear = years[Math.floor(Math.random() * years.length)];
            const isUserMentor = Math.random() > 0.8 && userYear >= 2; // Current user can be mentor

            newQueries.push({
                id: startId + i + 1,
                title: titles[Math.floor(Math.random() * titles.length)],
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                user: {
                    name: `User ${startId + i + 1}`,
                    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=user${startId + i}`,
                    college: colleges[Math.floor(Math.random() * colleges.length)],
                    branch: branches[Math.floor(Math.random() * branches.length)],
                    year: userYear,
                    mentorStatus: isUserMentor ? 'mentor' : null,
                },
                category: categories[Math.floor(Math.random() * categories.length)],
                views: Math.floor(Math.random() * 500) + 50,
                attachments: attachments,
                answers: answers,
                timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
            });
        }

        return newQueries;
    };

    // Load more queries
    const loadMoreQueries = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newQueries = generateMockQueries(page);

            if (page >= 5) { // Stop after 50 queries
                setHasMore(false);
            }

            setQueries(prev => [...prev, ...newQueries]);
            setPage(prev => prev + 1);
            setLoading(false);
        }, 1000);
    }, [page, loading, hasMore]);

    // Initial load
    useEffect(() => {
        loadMoreQueries();
    }, []);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMoreQueries();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMoreQueries, hasMore, loading]);

    const handleAttachmentClick = (query, index) => {
        if (query.attachments && query.attachments.length > 0) {
            setPreviewAttachments(query.attachments);
            setPreviewIndex(index);
            setShowImagePreview(true);
        }
    };

    const handleViewAnswers = (query) => {
        setSelectedQuery(query);
        setShowAnswersModal(true);
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
        <div className="min-h-screen bg-theme-primary py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-theme-primary">My Queries</h1>
                    <p className="text-theme-secondary text-xs sm:text-sm">
                        View all your posted queries and their responses
                    </p>
                </div>

                {/* Query Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {queries.map((query) => (
                        <QueryCard
                            key={query.id}
                            query={query}
                            onAttachmentClick={(index) => handleAttachmentClick(query, index)}
                            onViewAnswers={() => handleViewAnswers(query)}
                        />
                    ))}
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                )}

                {/* Observer Target */}
                <div ref={observerTarget} className="h-10" />

                {/* End Message */}
                {!hasMore && queries.length > 0 && (
                    <div className="text-center py-8 text-theme-secondary">
                        No more queries to load
                    </div>
                )}

                {/* Empty State */}
                {!loading && queries.length === 0 && (
                    <div className="text-center py-16">
                        <MessageCircle className="w-16 h-16 text-theme-muted mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-theme-secondary mb-2">No queries yet</h3>
                        <p className="text-theme-muted">Start by posting your first query</p>
                    </div>
                )}
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

// Get User Badges - Returns both year badge and mentor badge if applicable
function getUserBadges(user) {
    const badges = [];

    // Always show year-based badge
    if (user.year === 1) {
        badges.push({ text: 'Fresher', color: 'bg-green-600' });
    } else if (user.year === 2) {
        badges.push({ text: 'Senior 2nd Year', color: 'bg-blue-600' });
    } else if (user.year === 3) {
        badges.push({ text: 'Senior 3rd Year', color: 'bg-purple-600' });
    } else if (user.year === 4) {
        badges.push({ text: 'Senior 4th Year', color: 'bg-orange-600' });
    }

    // Add mentor badge if applicable (only for 2nd year+)
    if (user.mentorStatus === 'mentor' && user.year >= 2) {
        badges.push({
            text: 'Mentor',
            icon: Award,
            color: 'bg-indigo-600'
        });
    }

    return badges;
}
// Query Card Component
function QueryCard({ query, onAttachmentClick, onViewAnswers }) {
    const hasAttachments = query.attachments && query.attachments.length > 0;
    const displayAttachments = query.attachments ? query.attachments.slice(0, 3) : [];
    const remainingCount = query.attachments ? query.attachments.length - 3 : 0;
    const userBadges = getUserBadges(query.user);

    return (
        <div className="group p-3 sm:p-4 card-theme border-theme rounded-lg transition-all duration-300 card-theme-hover hover:border-blue-500/30">
            <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img
                        src={query.user.avatar}
                        alt={query.user.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-theme flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-xs sm:text-sm text-theme-primary truncate">
                                {query.user.name}
                            </p>
                            {userBadges.map((badge, index) => (
                                <span
                                    key={index}
                                    className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${badge.color} text-white rounded flex items-center gap-0.5 flex-shrink-0`}
                                >
                                    {badge.icon && <badge.icon className="w-2.5 h-2.5" />}
                                    {badge.text}
                                </span>
                            ))}
                        </div>
                        <p className="text-theme-secondary text-[10px] sm:text-[11px] font-medium truncate">
                            <span className="text-blue-500">{query.user.branch}</span> • <span className="text-theme-primary">{query.user.college}</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 bg-theme-secondary text-theme-secondary rounded whitespace-nowrap">
                        {query.category}
                    </span>
                    <span className="text-theme-muted text-[9px] sm:text-[10px] whitespace-nowrap">{query.timestamp}</span>
                </div>
            </div>

            <div className="mb-3">
                <h2 className="font-bold text-sm sm:text-base mb-1.5 text-theme-primary group-hover:text-blue-500 transition-colors line-clamp-2">
                    {query.title}
                </h2>
                <p className="text-theme-secondary text-xs leading-relaxed line-clamp-2">
                    {query.description}
                </p>
            </div>

            {hasAttachments && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {displayAttachments.map((attachment, index) => (
                        <button
                            key={attachment.id}
                            onClick={() => onAttachmentClick(index)}
                            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border border-theme hover:border-blue-500 transition-colors flex-shrink-0"
                        >
                            {attachment.type === 'image' ? (
                                <img
                                    src={attachment.thumbnail || attachment.url}
                                    alt={attachment.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-theme-secondary flex items-center justify-center">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-theme-muted" />
                                </div>
                            )}
                        </button>
                    ))}
                    {remainingCount > 0 && (
                        <button
                            onClick={() => onAttachmentClick(3)}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-md border border-theme bg-theme-secondary flex items-center justify-center hover:border-blue-500 transition-colors flex-shrink-0"
                        >
                            <span className="text-xs sm:text-sm font-semibold text-theme-secondary">
                                +{remainingCount}
                            </span>
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-theme gap-2">
                <div className="flex items-center gap-3 sm:gap-4 text-theme-secondary text-xs flex-wrap">
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

                <button
                    onClick={onViewAnswers}
                    className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 border border-theme text-theme-secondary rounded hover:bg-theme-hover transition-colors flex-shrink-0"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

// View Answers Modal Component
function ViewAnswersModal({ query, onClose, markedHelpful, onMarkHelpful }) {
    const queryUserBadges = getUserBadges(query.user);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="card-theme border-theme rounded-lg max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-2xl">
                <div className="p-4 sm:p-6 border-b border-theme">
                    <div className="flex items-center justify-between mb-3 gap-3">
                        <h2 className="text-base sm:text-lg font-bold text-theme-primary line-clamp-2 flex-1">
                            {query.title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-theme-secondary hover:text-theme-primary transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs sm:text-sm text-theme-secondary mb-3 line-clamp-2">
                        {query.description}
                    </p>
                    <div className="flex items-center gap-2">
                        <img
                            src={query.user.avatar}
                            alt={query.user.name}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-theme flex-shrink-0"
                        />
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-semibold text-xs sm:text-sm text-theme-primary">
                                    {query.user.name}
                                </p>
                                {queryUserBadges.map((badge, index) => (
                                    <span
                                        key={index}
                                        className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${badge.color} text-white rounded flex items-center gap-0.5 flex-shrink-0`}
                                    >
                                        {badge.icon && <badge.icon className="w-2.5 h-2.5" />}
                                        {badge.text}
                                    </span>
                                ))}
                            </div>
                            <p className="text-theme-secondary text-[10px] sm:text-xs font-medium truncate">
                                <span className="text-blue-500">{query.user.branch}</span> • <span className="text-theme-primary">{query.user.college}</span> • {query.timestamp}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-180px)] sm:max-h-[60vh]">
                    <h3 className="text-xs sm:text-sm font-semibold text-theme-primary mb-4">
                        {query.answers.length} {query.answers.length === 1 ? 'Answer' : 'Answers'}
                    </h3>
                    <div className="space-y-4">
                        {query.answers.map((answer) => {
                            const isMarkedHelpful = markedHelpful.has(answer.id);
                            const answerUserBadges = getUserBadges(answer.user);

                            return (
                                <div
                                    key={answer.id}
                                    className="p-3 sm:p-4 rounded-lg border border-theme bg-theme-secondary"
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <img
                                            src={answer.user.avatar}
                                            alt={answer.user.name}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-theme flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                        <p className="font-semibold text-xs sm:text-sm text-theme-primary">
                                                            {answer.user.name}
                                                        </p>
                                                        {answerUserBadges.map((badge, index) => (
                                                            <span
                                                                key={index}
                                                                className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${badge.color} text-white rounded flex items-center gap-0.5 flex-shrink-0`}
                                                            >
                                                                {badge.icon && <badge.icon className="w-2.5 h-2.5" />}
                                                                {badge.text}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-theme-secondary text-[10px] sm:text-xs font-medium truncate">
                                                        <span className="text-blue-500">{answer.user.branch}</span> • <span className="text-theme-primary">{answer.user.college}</span> • {answer.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed mb-3">
                                                {answer.content}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onMarkHelpful(answer.id)}
                                                    className={`px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors ${isMarkedHelpful
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-transparent text-theme-secondary border border-theme hover:border-theme-hover'
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

    if (!currentAttachment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                {/* Controls */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
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
                            <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                                {currentAttachment.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                                {currentAttachment.type.toUpperCase()} file
                            </p>
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