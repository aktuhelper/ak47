"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MessageCircle, User, Calendar, TrendingUp } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Import all components from querycard
import QueryCardFull from '../_loggedinHome/querycard';

export default function UserQueriesPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedQueries, setDisplayedQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

    // Current logged-in user (same for all queries)
    const currentUser = {
        name: 'Rahul Kumar',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=rahulkumar',
        college: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
        branch: 'CSE',
        course: 'B.Tech',
        year: 2,
        isOnline: true,
        isMentor: false,
    };

    const filters = [
        { id: 'all', label: 'All Queries' },
        { id: 'answered', label: 'Answered' },
        { id: 'unanswered', label: 'Unanswered' },
        { id: 'popular', label: 'Most Viewed', icon: TrendingUp },
    ];

    const categories = [
        { id: 'academic', label: 'Academic' },
        { id: 'career', label: 'Career' },
        { id: 'college-life', label: 'College Life' },
        { id: 'hostel', label: 'Hostel' },
        { id: 'placements', label: 'Placements' },
        { id: 'tech', label: 'Tech' },
        { id: 'general', label: 'General Query' },
    ];

    const generateMockQueries = (startId) => {
        const titles = [
            'How to prepare for competitive programming?',
            'Best resources for learning Data Structures?',
            'Which companies are coming for placements this year?',
            'How to balance academics and coding practice?',
            'Any study group for DSA preparation?',
            'Tips for cracking tech interviews?',
            'Hostel Wi-Fi issues - any solutions?',
            'Best internship opportunities for CSE students?',
            'How to build a strong GitHub profile?',
            'Recommended courses for machine learning?',
        ];

        const descriptions = [
            "I'm looking for guidance on this topic. Any suggestions would be helpful.",
            "Need advice from experienced seniors. Please share your insights.",
            "Has anyone faced similar challenges? How did you overcome them?",
            "Looking for practical tips and resources to get started with this.",
            "Would appreciate any guidance or recommendations from the community.",
            "Can someone help me understand this better? Thanks in advance!",
            "I've been struggling with this. Any help would be appreciated.",
            "Looking for suggestions from people who have experience in this area.",
        ];

        const categories = ['Academic', 'Career', 'College Life', 'Hostel', 'Placements', 'Tech', 'General Query'];

        const mockQueries = [];

        for (let i = 0; i < 8; i++) {
            const hasAttachments = Math.random() > 0.6;
            const attachments = hasAttachments ? [
                {
                    type: 'image',
                    url: `https://images.unsplash.com/photo-${1516116216624 + i * 100}?w=800`,
                    name: `attachment-${i + 1}.png`,
                }
            ] : [];

            // Generate random answers
            const answerCount = Math.floor(Math.random() * 6); // 0-5 answers
            const answers = [];

            for (let j = 0; j < answerCount; j++) {
                answers.push({
                    id: j + 1,
                    user: `Senior ${j + 1}`,
                    text: "This is a helpful answer with practical advice and suggestions.",
                    details: `B.Tech • ${['CSE', 'IT', 'ECE'][j % 3]} • AKTU`,
                    badges: j % 2 === 0 ? ["senior", "mentor"] : ["senior"]
                });
            }

            mockQueries.push({
                id: startId + i,
                title: titles[i % titles.length],
                description: descriptions[i % descriptions.length],
                user: currentUser,
                category: categories[i % categories.length],
                views: Math.floor(Math.random() * 500) + 50,
                timestamp: `${Math.floor(Math.random() * 24) + 1} hours ago`,
                attachments: attachments,
                answers: answers
            });
        }

        return mockQueries;
    };

    // Initialize queries
    useEffect(() => {
        setDisplayedQueries(generateMockQueries(1));
    }, []);

    // Load more queries function with useCallback
    const loadMoreQueries = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        setTimeout(() => {
            const newQueries = generateMockQueries(page * 8 + 1);

            setDisplayedQueries((prev) => [...prev, ...newQueries]);
            setPage((prev) => prev + 1);

            // Stop loading after 5 pages (40 queries total)
            if (page >= 5) {
                setHasMore(false);
            }

            setLoading(false);
        }, 800);
    }, [loading, hasMore, page]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    loadMoreQueries();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
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
    }, [loading, hasMore, loadMoreQueries]);

    // Sorting function
    const sortQueries = (queries) => {
        const sorted = [...queries];

        switch (sortBy) {
            case 'most-answered':
                return sorted.sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0));
            case 'most-viewed':
                return sorted.sort((a, b) => b.views - a.views);
            case 'oldest':
                return sorted.reverse();
            case 'latest':
            default:
                return sorted;
        }
    };

    // Filter and sort queries
    const filteredAndSortedQueries = sortQueries(
        displayedQueries.filter((query) => {
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesTitle = query.title.toLowerCase().includes(searchLower);
                const matchesDescription = query.description.toLowerCase().includes(searchLower);
                if (!matchesTitle && !matchesDescription) return false;
            }

            if (activeFilter === 'answered' && (!query.answers || query.answers.length === 0)) {
                return false;
            }

            if (activeFilter === 'unanswered' && query.answers && query.answers.length > 0) {
                return false;
            }

            if (activeFilter === 'popular' && query.views < 200) {
                return false;
            }

            if (activeCategory && query.category !== activeCategory) {
                return false;
            }

            return true;
        })
    );

    // Calculate stats
    const totalQueries = displayedQueries.length;
    const answeredQueries = displayedQueries.filter(q => q.answers && q.answers.length > 0).length;
    const totalViews = displayedQueries.reduce((sum, q) => sum + q.views, 0);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <User className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                    My Queries
                                </h1>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-3">
                                View and manage all your posted queries
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                        <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Queries</p>
                            <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalQueries}</p>
                        </div>
                        <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-1">Answered</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-600">{answeredQueries}</p>
                        </div>
                        <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Views</p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalViews}</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        <input
                            type="search"
                            placeholder="Search your queries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {filters.map((filter) => {
                                const Icon = filter.icon;
                                return (
                                    <button
                                        key={filter.id}
                                        onClick={() => {
                                            setActiveFilter(filter.id);
                                            setActiveCategory(null);
                                        }}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all flex items-center gap-1.5",
                                            activeFilter === filter.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                                        )}
                                    >
                                        {Icon && <Icon className="w-3.5 h-3.5" />}
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="most-answered">Most Answered</option>
                                <option value="most-viewed">Most Viewed</option>
                            </select>
                        </div>
                    </div>

                    {/* Category filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(activeCategory === cat.label ? null : cat.label);
                                }}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all",
                                    activeCategory === cat.label
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Query Cards Grid */}
                {filteredAndSortedQueries.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {filteredAndSortedQueries.map((query) => (
                                <QueryCardFull key={query.id} query={query} />
                            ))}
                        </div>

                        {/* Infinite scroll trigger */}
                        {hasMore && (
                            <div
                                ref={observerTarget}
                                className="py-8 text-center"
                                style={{ minHeight: '100px' }}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400">
                                        <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm">Loading more queries...</span>
                                    </div>
                                ) : (
                                    <div className="text-sm text-zinc-400">Scroll to load more</div>
                                )}
                            </div>
                        )}

                        {!hasMore && (
                            <div className="text-center py-8">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">No more queries to load</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <MessageCircle className="h-16 w-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                                No queries found
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                {searchQuery || activeCategory || activeFilter !== 'all'
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'You haven\'t posted any queries yet. Start by asking your first question!'}
                            </p>
                           
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}