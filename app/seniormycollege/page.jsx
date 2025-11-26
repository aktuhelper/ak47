"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import SeniorCard from '../_loggedinHome/userproflecard';

// Mock Data Generators
const generateSeniors = (count, startId, course, branch, year) => {
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
        college: "IIT Delhi",
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
        name: "Prashant Kumar Singh",
        role: "Mentor",
        college: "IIT Delhi",
        course: "BTech",
        branch: "Computer Science Engineering",
        isMentor: true,
        yearBadge: "4th-year",
        showYearBadge: true,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor1",
        skills: ["React", "Node.js", "System Design", "AI/ML"],
        isActive: true
    },
    {
        id: 102,
        name: "Aman Gupta",
        role: "Mentor",
        college: "NIT Trichy",
        course: "BTech",
        branch: "Electronics and Communication",
        isMentor: true,
        yearBadge: "3rd-year",
        showYearBadge: true,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor2",
        skills: ["VLSI", "Embedded Systems", "IoT"],
        isActive: false
    },
    {
        id: 103,
        name: "Rohit Verma",
        role: "Mentor",
        college: "IIT Bombay",
        course: "BTech",
        branch: "Mechanical Engineering",
        isMentor: true,
        yearBadge: "4th-year",
        showYearBadge: true,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor4",
        skills: ["CAD", "Robotics", "Design"],
        isActive: true
    }
];
const ACTIVE_SENIORS = [
    {
        id: 201,
        name: "Sarah Lee",
        role: "Senior Student",
        college: "IIT Delhi",
        course: "BTech",
        branch: "Computer Science Engineering",
        yearBadge: "4th-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=active1",
        skills: ["Figma", "UI/UX", "Design"],
        isActive: true
    },
    {
        id: 202,
        name: "David Chen",
        role: "Senior Student",
        college: "BITS Pilani",
        course: "BTech",
        branch: "Information Technology",
        yearBadge: "3rd-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=active2",
        skills: ["Python", "Django", "PostgreSQL"],
        isActive: true
    },
    {
        id: 203,
        name: "Priya Patel",
        role: "Senior Student",
        college: "NIT Warangal",
        course: "BTech",
        branch: "Electronics and Communication",
        yearBadge: "4th-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=active3",
        skills: ["React Native", "Mobile", "Flutter"],
        isActive: true
    }
];

export default function SeniorsPage() {
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
        // Reset logic according to prompt
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
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const newSeniors = generateSeniors(8, (page - 1) * 8 + 1000, selectedCourse, selectedBranch, selectedYear);

            setSeniors(prev => page === 1 ? newSeniors : [...prev, ...newSeniors]);
            setHasMore(page < 5); // Limit to 5 pages for demo
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
        <div className="min-h-screen bg-theme-primary transition-colors duration-300">
            {/* Header & Filters Container */}
            <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 shadow-sm ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* (1) Page Header */}
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Seniors</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Explore seniors, mentors, and recent active users from your college.</p>
                    </div>

                    {/* (2) Search Bar */}
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl leading-5 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                            placeholder="Search by name, handle, skills, or interest..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* (3) Branch Tabs (Conditional) */}
                    {(selectedCourse === "B.Tech" || selectedCourse === "M.Tech") && (
                        <div className="flex overflow-x-auto pb-2 mb-2 gap-2 no-scrollbar">
                            {BRANCHES.map((branch) => (
                                <button
                                    key={branch}
                                    onClick={() => handleBranchChange(branch)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${selectedBranch === branch
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                        : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    {branch}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* (4) Course Tabs */}
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

                    {/* (5) Seniority Tabs */}
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

                {/* (6) Top Mentors Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-amber-500">🏆</span> Top Mentors of Your College
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Super mentors and experts from your branch & course</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TOP_MENTORS.map(mentor => (
                            <SeniorCard key={mentor.id} senior={mentor} />
                        ))}
                    </div>
                </section>

                {/* (7) Currently Active Seniors Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Currently Active Seniors
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Seniors who were active in the last 24 hours</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ACTIVE_SENIORS.map(senior => (
                            <SeniorCard key={senior.id} senior={senior} />
                        ))}
                    </div>
                </section>

                {/* (8) Main Seniors Grid (Infinite Scroll) */}
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

                    {/* Loading State / Infinite Scroll Spinner */}
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