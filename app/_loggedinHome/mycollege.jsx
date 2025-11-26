"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MessageCircle, Plus } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Import all components from querycard
import QueryCardFull from '../_loggedinHome/querycard';

export default function MyCollegePage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedQueries, setDisplayedQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

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
                course: 'B.Tech',
                year: 2,
                isOnline: true,
                isMentor: false,
            },
            category: 'Academic',
            views: 234,
            timestamp: '3 hours ago',
            attachments: [
                {
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
                    name: 'coding-screenshot.png',
                },
            ],
            answers: [
                {
                    id: 1,
                    user: "Prashant Kumar",
                    text: "Start with Codeforces and LeetCode. Practice daily and focus on understanding algorithms first. Begin with easy problems and gradually increase difficulty.",
                    details: "B.Tech • CSE • AKTU",
                    badges: ["senior", "mentor"]
                }
            ]
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
                course: 'B.Tech',
                year: 3,
                isOnline: false,
                isMentor: true,
            },
            category: 'Career',
            views: 189,
            timestamp: '6 hours ago',
            attachments: [],
            answers: [
                {
                    id: 1,
                    user: "Rajesh Kumar",
                    text: "Check out startups in Noida Sector 62-63. Also apply to Wipro, TCS, Infosys summer internship programs. They have good stipends.",
                    details: "B.Tech • IT • AKTU",
                    badges: ["senior"]
                }
            ]
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
                course: 'B.Tech',
                year: 1,
                isOnline: true,
                isMentor: false,
            },
            category: 'Hostel',
            views: 312,
            timestamp: '5 hours ago',
            attachments: [],
            answers: []
        },
        {
            id: startId + 3,
            title: 'Study group for Data Structures?',
            description: 'Anyone interested in forming a study group for DSA preparation? We can meet on weekends and solve problems together.',
            user: {
                name: 'Vikram Singh',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user5',
                college: 'AKTU',
                branch: 'CSE',
                course: 'B.Tech',
                year: 2,
                isOnline: true,
                isMentor: false,
            },
            category: 'Academic',
            views: 156,
            timestamp: '8 hours ago',
            attachments: [],
            answers: [
                {
                    id: 1,
                    user: "Ankit Sharma",
                    text: "I'm interested! Let's create a WhatsApp group.",
                    details: "B.Tech • CSE • AKTU",
                    badges: ["senior"]
                },
                {
                    id: 2,
                    user: "Neha Gupta",
                    text: "Count me in! Sunday mornings work best for me.",
                    details: "B.Tech • CSE • AKTU",
                    badges: ["fresher"]
                }
            ]
        },
    ];

    // Initialize queries
    useEffect(() => {
        setDisplayedQueries(generateMockQueries(1));
    }, []);

    // Load more queries function with useCallback
    const loadMoreQueries = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        setTimeout(() => {
            const newQueries = generateMockQueries(page * 4 + 1);

            setDisplayedQueries((prev) => [...prev, ...newQueries]);
            setPage((prev) => prev + 1);

            // Stop loading after 8 pages (32 queries total)
            if (page >= 8) {
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
            case 'top-rated':
                return sorted.sort((a, b) => b.views - a.views);
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

            if (activeFilter === 'branch' && query.user.branch !== currentUser.branch) {
                return false;
            }

            if (activeFilter === 'course' && query.user.year.toString().includes('Alumni')) {
                return false;
            }

            if (activeCategory && query.category !== activeCategory) {
                return false;
            }

            return true;
        })
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                My College
                            </h1>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-4">
                                Queries from your college community • {displayedQueries.length} queries loaded
                            </p>
                        </div>
                      
                    </div>
                    <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400">
                        {currentUser.college}
                    </span>
                </div>

                {/* Search Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        <input
                            type="search"
                            placeholder="Search queries..."
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
                            <button
                                onClick={() => {
                                    setActiveFilter('all');
                                    setActiveCategory(null);
                                }}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all",
                                    activeFilter === 'all' && !activeCategory
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                                )}
                            >
                                All
                            </button>
                            <button
                                onClick={() => {
                                    setActiveFilter('branch');
                                    setActiveCategory(null);
                                }}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all",
                                    activeFilter === 'branch'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                                )}
                            >
                                Branch: {currentUser.branch} Only
                            </button>
                            <button
                                onClick={() => {
                                    setActiveFilter('course');
                                    setActiveCategory(null);
                                }}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all",
                                    activeFilter === 'course'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500'
                                )}
                            >
                                {currentUser.course} Only
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="latest">Latest</option>
                                <option value="most-answered">Most Answered</option>
                                <option value="most-viewed">Most Viewed</option>
                                <option value="top-rated">Top Rated</option>
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
                                    setActiveFilter('all');
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
                                    : 'Ask a question to help your college community!'}
                            </p>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                Ask a Query
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}