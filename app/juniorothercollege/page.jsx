"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import SeniorCard from '../_loggedinHome/userproflecard';

// Mock Data Generators
const generateJuniors = (count, startId, college, course, branch, year) => {
    const yearBadgeMap = {
        "1st Year": "1st-year",
        "2nd Year": "2nd-year",
        "3rd Year": "3rd-year"
    };

    const colleges = [
        "IIT Bombay", "IIT Madras", "IIT Kanpur", "NIT Trichy",
        "NIT Warangal", "BITS Pilani", "IIIT Hyderabad", "DTU Delhi",
        "VIT Vellore", "Manipal Institute", "SRM University", "Amity University"
    ];

    return Array.from({ length: count }).map((_, i) => ({
        id: startId + i,
        name: `Junior User ${startId + i}`,
        role: `Junior Student`,
        college: colleges[Math.floor(Math.random() * colleges.length)],
        course: course,
        branch: (course === "B.Tech" || course === "M.Tech") ? branch : null,
        yearBadge: yearBadgeMap[year] || "2nd-year",
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${startId + i}`,
        skills: ["React", "Python", "C++", "Java", "DSA", "Web Dev", "Machine Learning", "Data Science"].sort(() => 0.5 - Math.random()).slice(0, 3),
        isActive: Math.random() > 0.7
    }));
};

const JUNIOR_MENTORS = [
    {
        id: 301,
        name: "Arjun Sharma",
        role: "Mentor",
        college: "IIT Bombay",
        course: "BTech",
        branch: "Computer Science Engineering",
        isMentor: true,
        yearBadge: "3rd-year",
        showYearBadge: true,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=jmentor1",
        skills: ["React", "JavaScript", "Web Dev", "DSA"],
        isActive: true
    },
    {
        id: 302,
        name: "Neha Singh",
        role: "Mentor",
        college: "NIT Trichy",
        course: "BTech",
        branch: "Electronics and Communication",
        isMentor: true,
        yearBadge: "2nd-year",
        showYearBadge: true,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=jmentor2",
        skills: ["Arduino", "IoT", "C++"],
        isActive: true
    },
    {
        id: 303,
        name: "Karan Mehta",
        role: "Mentor",
        college: "BITS Pilani",
        course: "BTech",
        branch: "Information Technology",
        isMentor: true,
        yearBadge: "3rd-year",
        showYearBadge: true,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=jmentor3",
        skills: ["Python", "Data Science", "ML"],
        isActive: true
    }
];

const ACTIVE_JUNIORS = [
    {
        id: 401,
        name: "Riya Kapoor",
        role: "Junior Student",
        college: "IIT Madras",
        course: "BTech",
        branch: "Computer Science Engineering",
        yearBadge: "2nd-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=active4",
        skills: ["HTML", "CSS", "JavaScript"],
        isActive: true
    },
    {
        id: 402,
        name: "Vikram Joshi",
        role: "Junior Student",
        college: "NIT Warangal",
        course: "BTech",
        branch: "Mechanical Engineering",
        yearBadge: "1st-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=active5",
        skills: ["CAD", "SolidWorks", "Design"],
        isActive: true
    },
    {
        id: 403,
        name: "Ananya Das",
        role: "Junior Student",
        college: "IIIT Hyderabad",
        course: "BTech",
        branch: "Computer Science Engineering",
        yearBadge: "2nd-year",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=active6",
        skills: ["AutoCAD", "React Native", "Flutter"],
        isActive: true
    }
];

const TRENDING_COLLEGES = [
    "IIT Bombay", "IIT Madras", "IIT Kanpur", "NIT Trichy",
    "NIT Warangal", "BITS Pilani", "IIIT Hyderabad", "DTU Delhi"
];

export default function JuniorsOtherCollegePage() {
    // Filters State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("B.Tech");
    const [selectedBranch, setSelectedBranch] = useState("CSE");
    const [selectedYear, setSelectedYear] = useState("2nd Year");

    // Data State
    const [juniors, setJuniors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Constants
    const COURSES = ["B.Tech", "M.Tech", "BCA", "MCA", "MBA"];
    const BRANCHES = ["CSE", "ECE", "Mechanical", "IT", "Civil"];
    const YEARS = ["1st Year", "2nd Year", "3rd Year"];

    // Handlers
    const handleCourseChange = (course) => {
        setSelectedCourse(course);
        setSelectedBranch(course === "MBA" || course === "BCA" || course === "MCA" ? "" : "CSE");
        setSelectedYear("2nd Year");
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
        setJuniors([]);
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
        const fetchJuniors = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            const newJuniors = generateJuniors(
                8,
                (page - 1) * 8 + 3000,
                "",
                selectedCourse,
                selectedBranch,
                selectedYear
            );

            setJuniors(prev => page === 1 ? newJuniors : [...prev, ...newJuniors]);
            setHasMore(page < 5);
            setIsLoading(false);
        };

        fetchJuniors();
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Juniors from Other Colleges</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connect with talented juniors across India and expand your network.</p>
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
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
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

                    {/* Year Tabs */}
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

                {/* Junior Mentors Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-amber-500">🏆</span> Top Junior Mentors from Other Colleges
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Experienced 2nd and 3rd year students from top institutions</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {JUNIOR_MENTORS.map(mentor => (
                            <SeniorCard key={mentor.id} senior={mentor} currentUserId={1} />
                        ))}
                    </div>
                </section>

                {/* Currently Active Juniors Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Currently Active Juniors
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Juniors from other colleges who are online now</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ACTIVE_JUNIORS.map(junior => (
                            <SeniorCard key={junior.id} senior={junior} currentUserId={1} />
                        ))}
                    </div>
                </section>

                {/* Main Juniors Grid (Infinite Scroll) */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Juniors from Other Colleges</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {selectedCourse}
                            {selectedBranch && ` • ${selectedBranch}`}
                            {` • ${selectedYear}`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {juniors.map((junior) => (
                            <SeniorCard key={junior.id} senior={junior} currentUserId={1} />
                        ))}
                    </div>

                    {/* Loading State / Infinite Scroll Spinner */}
                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {!hasMore && !isLoading && juniors.length > 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            You've reached the end of the list.
                        </div>
                    )}

                    {!isLoading && juniors.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No juniors found</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}