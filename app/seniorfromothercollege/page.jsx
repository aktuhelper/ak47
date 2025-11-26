"use client";
import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, TrendingUp } from 'lucide-react';

// Import your original SeniorCard component
import SeniorCard from '../_loggedinHome/userproflecard';
// For demo purposes, using a placeholder - replace with your actual import


// Mock Data Generators
const generateSeniors = (count, startId, college, course, branch, year) => {
    const yearBadgeMap = {
        "2nd Year": "2nd-year",
        "3rd Year": "3rd-year",
        "4th Year": "4th-year",
        "Pass-out": "4th-year"
    };

    return Array.from({ length: count }).map((_, i) => ({
        id: startId + i,
        name: `Senior User ${startId + i}`,
        role: `Senior Student`,
        college: college,
        course: course,
        branch: (course === "B.Tech" || course === "M.Tech") ? branch : null,
        yearBadge: yearBadgeMap[year] || "3rd-year",
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${startId + i}`,
        skills: ["React", "Node.js", "Python", "Design", "DSA", "AI/ML"].sort(() => 0.5 - Math.random()).slice(0, 3),
        isActive: Math.random() > 0.8
    }));
};

const TOP_MENTORS = [
    {
        id: 101,
        name: "Rahul Sharma",
        role: "Mentor",
        college: "IIT Bombay",
        course: "BTech",
        branch: "Computer Science Engineering",
        yearBadge: "4th-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor101",
        skills: ["React", "AWS", "System Design"],
        isActive: true
    },
    {
        id: 102,
        name: "Sneha Reddy",
        role: "Mentor",
        college: "BITS Pilani",
        course: "BTech",
        branch: "Electronics and Communication",
        yearBadge: "4th-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor102",
        skills: ["VLSI", "Embedded", "IoT"],
        isActive: true
    },
    {
        id: 103,
        name: "Arjun Mehta",
        role: "Mentor",
        college: "NIT Trichy",
        course: "BTech",
        branch: "Mechanical Engineering",
        yearBadge: "Pass-out",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor103",
        skills: ["CAD", "Manufacturing", "Robotics"],
        isActive: false
    }
];

const TRENDING_SENIORS = [
    {
        id: 201,
        name: "Vikram Singh",
        role: "Senior Student",
        college: "IIT Kanpur",
        course: "BTech",
        branch: "Computer Science Engineering",
        yearBadge: "3rd-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=trending201",
        skills: ["Flutter", "Firebase", "Mobile"],
        isActive: true
    },
    {
        id: 202,
        name: "Ananya Iyer",
        role: "Senior Student",
        college: "IIT Madras",
        course: "BTech",
        branch: "Information Technology",
        yearBadge: "4th-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=trending202",
        skills: ["Python", "ML", "Django"],
        isActive: true
    },
    {
        id: 203,
        name: "Karthik Kumar",
        role: "Senior Student",
        college: "IIIT Hyderabad",
        course: "BTech",
        branch: "Electronics and Communication",
        yearBadge: "3rd-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=trending203",
        skills: ["React Native", "Node.js", "MongoDB"],
        isActive: true
    }
];

export default function SeniorsOtherCollegesPage() {
    // Filters State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("B.Tech");
    const [selectedBranch, setSelectedBranch] = useState("CSE");
    const [selectedYear, setSelectedYear] = useState("3rd Year");

    // Data State
    const [seniors, setSeniors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Constants
    const COURSES = ["B.Tech", "M.Tech", "BCA", "MCA", "MBA"];
    const BRANCHES = ["CSE", "ECE", "Mechanical", "IT", "Civil"];
    const YEARS = ["2nd Year", "3rd Year", "4th Year", "Pass-out"];

    // Handlers
    const handleCourseChange = (course) => {
        setSelectedCourse(course);
        setSelectedBranch(course === "MBA" || course === "BCA" || course === "MCA" ? "" : "CSE");
        setSelectedYear("3rd Year");
        resetPagination();
    };

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        resetPagination();
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        resetPagination();
    };

    const resetPagination = () => {
        setPage(1);
        setSeniors([]);
        setHasMore(true);
    };

    // Search Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            resetPagination();
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Data Fetching (Simulated)
    useEffect(() => {
        const fetchSeniors = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            const newSeniors = generateSeniors(
                8,
                (page - 1) * 8 + 3000,
                "Various Colleges",
                selectedCourse,
                selectedBranch,
                selectedYear
            );

            setSeniors(prev => page === 1 ? newSeniors : [...prev, ...newSeniors]);
            setHasMore(page < 5);
            setIsLoading(false);
        };

        fetchSeniors();
    }, [page, selectedCourse, selectedBranch, selectedYear, searchQuery]);

    // Infinite Scroll Observer
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading || !hasMore) return;
            setPage(prev => prev + 1);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
            {/* Header & Filters Container */}
            <div className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Page Header */}
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <GraduationCap className="w-7 h-7 text-blue-600" />
                            Seniors from Other Colleges
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connect with seniors and mentors from top colleges across India</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl leading-5 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                            placeholder="Search by name, college, skills, or interest..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Branch Tabs (Conditional) */}
                    {(selectedCourse === "B.Tech" || selectedCourse === "M.Tech") && (
                        <div className="flex overflow-x-auto pb-2 mb-2 gap-2 no-scrollbar">
                            {BRANCHES.map((branch) => (
                                <button
                                    key={branch}
                                    onClick={() => handleBranchChange(branch)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${selectedBranch === branch
                                            ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20"
                                            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    {branch}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Course Tabs */}
                    <div className="flex overflow-x-auto pb-2 mb-2 gap-2 no-scrollbar border-b border-gray-100 dark:border-zinc-800/50">
                        {COURSES.map((course) => (
                            <button
                                key={course}
                                onClick={() => handleCourseChange(course)}
                                className={`whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${selectedCourse === course
                                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                        : "text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                                    }`}
                            >
                                {course}
                            </button>
                        ))}
                    </div>

                    {/* Seniority Tabs */}
                    <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar">
                        {YEARS.map((year) => (
                            <button
                                key={year}
                                onClick={() => handleYearChange(year)}
                                className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 border ${selectedYear === year
                                        ? "bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white"
                                        : "bg-transparent text-gray-500 dark:text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* Top Mentors from Other Colleges */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-amber-500">🏆</span> Top Mentors from Other Colleges
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Highly rated mentors across premier institutions</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TOP_MENTORS.map(mentor => (
                            <SeniorCard key={mentor.id} senior={mentor} />
                        ))}
                    </div>
                </section>

                {/* Trending Seniors */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                            Trending Seniors
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most popular and active seniors from other colleges</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TRENDING_SENIORS.map(senior => (
                            <SeniorCard key={senior.id} senior={senior} />
                        ))}
                    </div>
                </section>

                {/* Main Seniors Grid (Infinite Scroll) */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Seniors</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Browsing {selectedCourse}
                            {selectedBranch && ` • ${selectedBranch}`}
                            {` • ${selectedYear}`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seniors.map((senior) => (
                            <SeniorCard key={senior.id} senior={senior} />
                        ))}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {!hasMore && !isLoading && seniors.length > 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            You've reached the end of the list.
                        </div>
                    )}

                    {!isLoading && seniors.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No seniors found</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}