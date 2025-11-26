"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MessageCircle, Flame, TrendingUp } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Import all components from querycard
import QueryCardFull from '../_loggedinHome/querycard';

export default function TrendingQueriesPage() {
    const [activeFilter, setActiveFilter] = useState('trending');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('trending');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedQueries, setDisplayedQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

    const filters = [
        { id: 'trending', label: 'Trending', icon: Flame },
        { id: 'hot', label: 'Hot Today', icon: TrendingUp },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
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
                course: 'B.Tech',
                year: 2,
                isOnline: true,
                isMentor: false,
            },
            category: 'Academic',
            views: 1234,
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
                    details: "B.Tech • CSE • IIT Bombay",
                    badges: ["senior", "mentor"]
                },
                {
                    id: 2,
                    user: "Ankit Verma",
                    text: "I recommend following Striver's A2Z DSA sheet. It's well structured and covers everything you need.",
                    details: "B.Tech • CSE • NIT Trichy",
                    badges: ["senior"]
                }
            ]
        },
        {
            id: startId + 1,
            title: 'Best internship opportunities for CSE students?',
            description: 'Looking for good internship opportunities in software development and AI. Any suggestions for companies or startups?',
            user: {
                name: 'Amit Verma',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user3',
                college: 'NIT Warangal',
                branch: 'CSE',
                course: 'B.Tech',
                year: 3,
                isOnline: false,
                isMentor: true,
            },
            category: 'Career',
            views: 2189,
            timestamp: '6 hours ago',
            attachments: [],
            answers: [
                {
                    id: 1,
                    user: "Rajesh Kumar",
                    text: "Check out startups in Bangalore and Hyderabad. Also apply to Google STEP, Microsoft Explore programs.",
                    details: "B.Tech • IT • IIIT Hyderabad",
                    badges: ["senior", "mentor"]
                }
            ]
        },
        {
            id: startId + 2,
            title: 'Study group for Data Structures and Algorithms?',
            description: 'Anyone interested in forming a study group for DSA preparation? We can meet on weekends and solve problems together.',
            user: {
                name: 'Vikram Singh',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user5',
                college: 'BITS Pilani',
                branch: 'CSE',
                course: 'B.Tech',
                year: 2,
                isOnline: true,
                isMentor: false,
            },
            category: 'Academic',
            views: 856,
            timestamp: '8 hours ago',
            attachments: [],
            answers: [
                {
                    id: 1,
                    user: "Ankit Sharma",
                    text: "I'm interested! Let's create a WhatsApp group.",
                    details: "B.Tech • CSE • BITS Pilani",
                    badges: ["senior"]
                },
                {
                    id: 2,
                    user: "Neha Gupta",
                    text: "Count me in! Sunday mornings work best for me.",
                    details: "B.Tech • CSE • BITS Pilani",
                    badges: ["fresher"]
                },
                {
                    id: 3,
                    user: "Priya Sharma",
                    text: "Great idea! I can help with graph problems.",
                    details: "B.Tech • CSE • IIT Delhi",
                    badges: ["senior"]
                }
            ]
        },
        {
            id: startId + 3,
            title: 'How to balance academics and coding practice?',
            description: 'Finding it hard to manage time between college assignments and improving coding skills. How do seniors manage this?',
            user: {
                name: 'Pooja Gupta',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user4',
                college: 'VIT Vellore',
                branch: 'CSE',
                course: 'B.Tech',
                year: 1,
                isOnline: true,
                isMentor: false,
            },
            category: 'College Life',
            views: 1512,
            timestamp: '5 hours ago',
            attachments: [
                {
                    type: 'image',
                    url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
                    name: 'study-schedule.png',
                }
            ],
            answers: [
                {
                    id: 1,
                    user: "Vikram Patel",
                    text: "Create a fixed schedule. Dedicate 1-2 hours daily for coding practice. Use weekends for longer sessions.",
                    details: "B.Tech • CSE • IIT Kharagpur",
                    badges: ["senior", "mentor"]
                }
            ]
        },
        {
            id: startId + 4,
            title: 'Tips for campus placements preparation?',
            description: 'Final year student here. What should be my strategy for the next 6 months? Need guidance on DSA, projects, and interview prep.',
            user: {
                name: 'Karthik Reddy',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user8',
                college: 'NIT Trichy',
                branch: 'CSE',
                course: 'B.Tech',
                year: 4,
                isOnline: false,
                isMentor: false,
            },
            category: 'Placements',
            views: 3567,
            timestamp: '2 hours ago',
            attachments: [],
            answers: [
                {
                    id: 1,
                    user: "Arjun Mehta",
                    text: "Start with mock interviews and work on your resume. Practice coding daily and prepare your projects for interviews.",
                    details: "B.Tech • CSE • IIT Kanpur",
                    badges: ["senior", "mentor"]
                },
                {
                    id: 2,
                    user: "Sanjay Desai",
                    text: "Focus on top 150 LeetCode problems. Also brush up on system design basics.",
                    details: "B.Tech • CSE • IIIT Bangalore",
                    badges: ["senior"]
                }
            ]
        },
        {
            id: startId + 5,
            title: 'Best resources for learning Machine Learning?',
            description: 'Want to start with ML and AI. What are the best courses and projects for beginners?',
            user: {
                name: 'Neha Singh',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user7',
                college: 'IIIT Hyderabad',
                branch: 'CSE',
                course: 'B.Tech',
                year: 2,
                isOnline: true,
                isMentor: false,
            },
            category: 'Tech',
            views: 1845,
            timestamp: '4 hours ago',
            attachments: [],
            answers: [
                {
                    id: 1,
                    user: "Deepak Kumar",
                    text: "Andrew Ng's course on Coursera is perfect for beginners. Then move to Kaggle competitions.",
                    details: "B.Tech • CSE • IIT Madras",
                    badges: ["senior", "mentor"]
                }
            ]
        },
        {
            id: startId + 6,
            title: 'Hostel life tips for freshers?',
            description: 'Just joined college and staying in hostel for the first time. Any tips on adjusting and making friends?',
            user: {
                name: 'Rohan Patel',
                avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=user9',
                college: 'DTU Delhi',
                branch: 'ECE',
                course: 'B.Tech',
                year: 1,
                isOnline: true,
                isMentor: false,
            },
            category: 'Hostel',
            views: 967,
            timestamp: '7 hours ago',
            attachments: [],
            answers: []
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
            const newQueries = generateMockQueries(page * 7 + 1);

            setDisplayedQueries((prev) => [...prev, ...newQueries]);
            setPage((prev) => prev + 1);

            // Stop loading after 8 pages
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
            case 'trending':
                return sorted.sort((a, b) => b.views - a.views);
            case 'most-answered':
                return sorted.sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0));
            case 'most-viewed':
                return sorted.sort((a, b) => b.views - a.views);
            case 'latest':
                return sorted;
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
                const matchesCollege = query.user.college.toLowerCase().includes(searchLower);
                if (!matchesTitle && !matchesDescription && !matchesCollege) return false;
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
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                    Trending Queries
                                </h1>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                                Popular questions from students across all colleges • {displayedQueries.length} queries loaded
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        <input
                            type="search"
                            placeholder="Search trending queries..."
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
                                            if (filter.id === 'trending') setSortBy('trending');
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
                                <option value="trending">Trending</option>
                                <option value="latest">Latest</option>
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
                                {searchQuery || activeCategory
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'Check back later for trending queries!'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}