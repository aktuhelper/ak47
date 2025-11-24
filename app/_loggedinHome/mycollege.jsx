import { useState, useEffect, useRef } from 'react';
import { X, Download, ChevronLeft, ChevronRight, Eye, MessageCircle, ThumbsUp, Award, Star, Search, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MyCollegePage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
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

    //todo: remove mock functionality - replace with real user data
    const currentUser = {
        branch: 'CSE',
        course: 'B.Tech',
        college: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
    };

    const categories = [
        { id: 'academic', label: 'Academic' },
        { id: 'career', label: 'Career' },
        { id: 'college-life', label: 'College Life' },
        { id: 'hostel', label: 'Hostel' },
        { id: 'placements', label: 'Placements' },
        { id: 'tech', label: 'Tech' },
        { id: 'general', label: 'General Query' },
    ];

    //todo: remove mock functionality - replace with API call
    const generateMockQueries = (startId) => [
        {
            id: startId,
            title: 'How to prepare for competitive programming?',
            description: "I'm a second-year CSE student looking to start with competitive programming. What resources and practice platforms would you recommend?",
            user: {
                name: 'Rahul Sharma',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user1',
                college: 'AKTU',
                branch: 'CSE',
                year: 2,
                mentorStatus: null,
            },
            category: 'Academic',
            views: 234,
            upvotes: 45,
            attachments: [
                {
                    id: '1',
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
                    name: 'coding-screenshot.png',
                    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200',
                },
            ],
            answers: [
                {
                    id: 1,
                    content: 'Start with Codeforces and LeetCode. Practice daily and focus on understanding algorithms first. Begin with easy problems and gradually increase difficulty.',
                    user: {
                        name: 'Prashant Kumar',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor1',
                        college: 'AKTU',
                        branch: 'CSE',
                        year: 4,
                        mentorStatus: 'mentor',
                    },
                    helpfulCount: 45,
                    timestamp: '2 hours ago',
                },
            ],
            timestamp: '3 hours ago',
        },
        {
            id: startId + 1,
            title: 'Best internship opportunities for CSE students?',
            description: 'Looking for good internship opportunities in software development and AI. Any suggestions for companies or startups in Noida/Delhi NCR?',
            user: {
                name: 'Amit Verma',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user3',
                college: 'AKTU',
                branch: 'CSE',
                year: 3,
                mentorStatus: 'mentor',
            },
            category: 'Career',
            views: 189,
            upvotes: 32,
            attachments: [],
            answers: [
                {
                    id: 1,
                    content: 'Check out startups in Noida Sector 62-63. Also apply to Wipro, TCS, Infosys summer internship programs. They have good stipends.',
                    user: {
                        name: 'Rajesh Kumar',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor2',
                        college: 'AKTU',
                        branch: 'IT',
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
            title: 'Hostel Wi-Fi issues - any solutions?',
            description: 'The Wi-Fi in Block-C hostel keeps disconnecting. Has anyone found a workaround or should we raise a complaint?',
            user: {
                name: 'Pooja Gupta',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user4',
                college: 'AKTU',
                branch: 'CSE',
                year: 1,
                mentorStatus: null,
            },
            category: 'Hostel',
            views: 312,
            upvotes: 56,
            attachments: [],
            answers: [],
            timestamp: '5 hours ago',
        },
        {
            id: startId + 3,
            title: 'Resume tips for campus placements?',
            description: 'What should I highlight in my resume when applying to companies during campus placements? Should I include all projects or just major ones?',
            user: {
                name: 'Sanjay Desai',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user6',
                college: 'AKTU',
                branch: 'IT',
                year: 3,
                mentorStatus: null,
            },
            category: 'Placements',
            views: 421,
            upvotes: 68,
            attachments: [
                {
                    id: '4',
                    type: 'pdf',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    name: 'resume-template.pdf',
                },
            ],
            answers: [
                {
                    id: 1,
                    content: 'Focus on 2-3 major projects with real impact. Quantify achievements. Keep it one page. Add relevant coursework and skills.',
                    user: {
                        name: 'Deepak Malhotra',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor4',
                        college: 'AKTU',
                        branch: 'CSE',
                        year: 4,
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
            title: 'Best cafeteria spots for group study?',
            description: 'Looking for quiet cafeteria spots where a group of 4-5 can study together. Any recommendations?',
            user: {
                name: 'Neha Singh',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user7',
                college: 'AKTU',
                branch: 'ECE',
                year: 2,
                mentorStatus: 'mentor',
            },
            category: 'College Life',
            views: 145,
            upvotes: 23,
            attachments: [],
            answers: [],
            timestamp: '4 hours ago',
        },
        {
            id: startId + 5,
            title: 'MERN stack vs Django - which to learn first?',
            description: 'Final year student here. For campus placements, which tech stack should I focus on?',
            user: {
                name: 'Karthik Reddy',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user8',
                college: 'AKTU',
                branch: 'CSE',
                year: 4,
                mentorStatus: null,
            },
            category: 'Tech',
            views: 567,
            upvotes: 89,
            attachments: [],
            answers: [
                {
                    id: 1,
                    content: 'MERN has more demand in startups. Django is great for backend roles. Learn based on your interest - full-stack vs backend-focused.',
                    user: {
                        name: 'Arjun Mehta',
                        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=mentor5',
                        college: 'AKTU',
                        branch: 'CSE',
                        year: 'Alumni',
                        mentorStatus: null,
                    },
                    helpfulCount: 89,
                    timestamp: '5 hours ago',
                },
            ],
            timestamp: '8 hours ago',
        },
    ];
    useEffect(() => {
        //todo: remove mock functionality - replace with API call
        setDisplayedQueries(generateMockQueries(1));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
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
        //todo: remove mock functionality - replace with API call
        setTimeout(() => {
            const newQueries = generateMockQueries(page * 6 + 1);
            setDisplayedQueries((prev) => [...prev, ...newQueries]);
            setPage((prev) => prev + 1);
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
            const attachment = query.attachments[index];

            if (attachment.type === 'pdf') {
                // Open PDF in new tab
                window.open(attachment.url, '_blank');
            } else if (attachment.type === 'image') {
                // Show image preview modal
                const imageAttachments = query.attachments.filter((a) => a.type === 'image');
                const imageIndex = imageAttachments.findIndex(img => img.id === attachment.id);
                setPreviewAttachments(imageAttachments);
                setPreviewIndex(imageIndex >= 0 ? imageIndex : 0);
                setShowImagePreview(true);
            }
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

    const filteredQueries = displayedQueries.filter((query) => {
        if (searchQuery && !query.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !query.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (activeFilter === 'branch' && query.user.branch !== currentUser.branch) return false;
        if (activeFilter === 'course' && query.user.year.toString().includes('Alumni')) return false;
        if (activeCategory && query.category !== activeCategory) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-background py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1" data-testid="text-page-title">
                        My College
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4" data-testid="text-page-subtitle">
                        Queries from your college community
                    </p>
                    <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm" data-testid="badge-college-name">
                        {currentUser.college}
                    </Badge>
                </div>

                {/* Search Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search queries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            data-testid="input-search"
                        />
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        {/* Left side filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => {
                                    setActiveFilter('all');
                                    setActiveCategory(null);
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activeFilter === 'all' && !activeCategory
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-primary/50'
                                    }`}
                                data-testid="button-filter-all"
                            >
                                All
                            </button>
                            <button
                                onClick={() => {
                                    setActiveFilter('branch');
                                    setActiveCategory(null);
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activeFilter === 'branch'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-primary/50'
                                    }`}
                                data-testid="button-filter-branch"
                            >
                                Branch: {currentUser.branch} Only
                            </button>
                            <button
                                onClick={() => {
                                    setActiveFilter('course');
                                    setActiveCategory(null);
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activeFilter === 'course'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-primary/50'
                                    }`}
                                data-testid="button-filter-course"
                            >
                                {currentUser.course} Only
                            </button>
                        </div>

                        {/* Right side sorting */}
                        <div className="flex items-center gap-2">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest</SelectItem>
                                    <SelectItem value="most-answered">Most Answered</SelectItem>
                                    <SelectItem value="most-viewed">Most Viewed</SelectItem>
                                    <SelectItem value="top-rated">Top Rated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Category filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(activeCategory === cat.label ? null : cat.label);
                                    setActiveFilter('all');
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activeCategory === cat.label
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-transparent text-muted-foreground hover:text-foreground border border-border hover:border-primary/50'
                                    }`}
                                data-testid={`button-category-${cat.id}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Query Cards Grid */}
                {filteredQueries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {filteredQueries.map((query) => (
                            <QueryCard
                                key={query.id}
                                query={query}
                                onViewAnswers={() => handleViewAnswers(query)}
                                onAddAnswer={() => handleAddAnswer(query)}
                                onAttachmentClick={(index) => handleAttachmentClick(query, index)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <MessageCircle className="h-16 w-16 text-muted mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-empty-state-title">
                                No queries found
                            </h3>
                            <p className="text-muted-foreground mb-6" data-testid="text-empty-state-description">
                                Ask a question to help your college community!
                            </p>
                            <Button data-testid="button-ask-query">Ask a Query</Button>
                        </div>
                    </div>
                )}

                {/* Infinite scroll loader */}
                <div ref={observerTarget} className="h-4 py-8 text-center">
                    {loading && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Loading more queries...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Answers Modal */}
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
        if (user.mentorStatus === 'mentor') {
            return { text: 'Mentor', icon: Award, color: 'bg-indigo-600' };
        }
        return null;
    };

    const userBadge = getUserBadge(query.user);
    const mentorBadge = getMentorBadge(query.user);

    return (
        <div className="group p-3 sm:p-4 bg-card border border-card-border rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50" data-testid={`card-query-${query.id}`}>
            <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img
                        src={query.user.avatar}
                        alt={query.user.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-xs sm:text-sm text-foreground truncate" data-testid={`text-user-name-${query.id}`}>
                                {query.user.name}
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
                        <p className="text-muted-foreground text-[10px] sm:text-[11px] truncate">
                            {query.user.branch} • {query.user.college}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 bg-secondary text-secondary-foreground rounded whitespace-nowrap" data-testid={`badge-category-${query.id}`}>
                        {query.category}
                    </span>
                    <span className="text-muted-foreground text-[9px] sm:text-[10px] whitespace-nowrap">{query.timestamp}</span>
                </div>
            </div>

            <div className={hasAttachments ? "mb-3" : ""}>
                <h2 className="font-bold text-sm sm:text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2" data-testid={`text-query-title-${query.id}`}>
                    {query.title}
                </h2>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2" data-testid={`text-query-description-${query.id}`}>
                    {query.description}
                </p>
            </div>

            {hasAttachments && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {displayAttachments.map((attachment, index) => (
                        <button
                            key={attachment.id}
                            onClick={() => onAttachmentClick(index)}
                            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border border-border hover:border-primary transition-colors flex-shrink-0"
                            data-testid={`attachment-${query.id}-${index}`}
                        >
                            {attachment.type === 'image' ? (
                                <img
                                    src={attachment.thumbnail || attachment.url}
                                    alt={attachment.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                                </div>
                            )}
                        </button>
                    ))}
                    {remainingCount > 0 && (
                        <button
                            onClick={() => onAttachmentClick(3)}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-md border border-border bg-secondary flex items-center justify-center hover:border-primary transition-colors flex-shrink-0"
                        >
                            <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                +{remainingCount}
                            </span>
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground text-xs flex-wrap">
                    <div className="flex items-center gap-1" data-testid={`stat-views-${query.id}`}>
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="text-[10px] sm:text-xs">{query.views}</span>
                    </div>
                    <div className="flex items-center gap-1" data-testid={`stat-answers-${query.id}`}>
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
                        className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 border border-border text-foreground rounded hover-elevate active-elevate-2 transition-colors"
                        data-testid={`button-view-${query.id}`}
                    >
                        View
                    </button>
                    <button
                        onClick={onAddAnswer}
                        className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-primary text-primary-foreground rounded hover-elevate active-elevate-2 transition-colors"
                        data-testid={`button-answer-${query.id}`}
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
        if (user.mentorStatus === 'mentor') {
            return { text: 'Mentor', icon: Award, color: 'bg-indigo-600' };
        }
        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 sm:p-6 border-b border-border">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-base sm:text-lg font-bold line-clamp-2 flex-1 text-foreground">{query.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                            data-testid="button-close-answers-modal"
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
                                    className="p-3 sm:p-4 rounded-lg border border-border bg-background"
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <img
                                            src={answer.user.avatar}
                                            alt={answer.user.name}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <p className="font-semibold text-sm text-foreground">{answer.user.name}</p>
                                                    {userBadge && (
                                                        <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${userBadge.color} text-white rounded`}>
                                                            {userBadge.text}
                                                        </span>
                                                    )}
                                                    {mentorBadge && (
                                                        <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 ${mentorBadge.color} text-white rounded flex items-center gap-0.5`}>
                                                            <mentorBadge.icon className="w-2.5 h-2.5" />
                                                            {mentorBadge.text}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-muted-foreground text-xs">{answer.timestamp}</span>
                                            </div>
                                            <p className="text-foreground text-sm mb-3">{answer.content}</p>
                                            <button
                                                onClick={() => onMarkHelpful(answer.id)}
                                                className={`text-xs px-3 py-1.5 rounded transition-all ${isMarkedHelpful
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'border border-border text-foreground hover-elevate active-elevate-2'
                                                    }`}
                                                data-testid={`button-helpful-${answer.id}`}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    <ThumbsUp className="w-3.5 h-3.5" />
                                                    Helpful ({answer.helpfulCount + (isMarkedHelpful ? 1 : 0)})
                                                </span>
                                            </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 sm:p-6 border-b border-border">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-foreground">Add Your Answer</h2>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            data-testid="button-close-add-answer-modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    <div>
                        <h3 className="font-semibold text-foreground mb-2 text-sm">{query.title}</h3>
                        <p className="text-sm text-muted-foreground">{query.description}</p>
                    </div>
                    <Textarea
                        placeholder="Write your answer here..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="min-h-[200px]"
                        data-testid="input-answer-text"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose} data-testid="button-cancel-answer">
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} disabled={!answerText.trim()} data-testid="button-submit-answer">
                            Submit Answer
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Image Preview Modal Component
function ImagePreviewModal({ attachments, currentIndex, setCurrentIndex, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative max-w-6xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                    onClick={onClose}
                    data-testid="button-close-image-preview"
                >
                    <X className="h-6 w-6" />
                </button>
                {attachments.length > 1 && (
                    <>
                        <button
                            className="absolute left-4 text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : attachments.length - 1)}
                            data-testid="button-prev-image"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </button>
                        <button
                            className="absolute right-4 text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            onClick={() => setCurrentIndex(currentIndex < attachments.length - 1 ? currentIndex + 1 : 0)}
                            data-testid="button-next-image"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </button>
                    </>
                )}
                <img src={attachments[currentIndex].url} alt={attachments[currentIndex].name} className="max-h-full max-w-full object-contain" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                    <span>
                        {currentIndex + 1} / {attachments.length}
                    </span>
                </div>
            </div>
        </div>
    );
}