"use client";
import React, { useEffect, useState } from "react";
import { Search, Briefcase, MapPin, Calendar, ExternalLink, Filter, Sparkles, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const StudentJobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const Router = useRouter();

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("https://aktuhelperserver-production.up.railway.app/api/jobs?populate=*");
                const data = await res.json();

                if (data.error) {
                    console.error("API Error:", data.error);
                    throw new Error(data.error.message || "API returned an error");
                }

                if (!data.data) {
                    throw new Error("No data returned from API");
                }

                const fetchedJobs = data.data.map((job) => ({
                    id: job.documentId,
                    documentId: job.documentId,
                    title: job.title || job.attributes?.title,
                    company: job.company || job.attributes?.company,
                    location: job.location || job.attributes?.location,
                    type: job.jobType || job.attributes?.jobType,
                    deadline: job.deadline || job.attributes?.deadline,
                    link: job.applyLink || job.attributes?.applyLink,
                    createdAt: job.createdAt || job.attributes?.createdAt,
                }));

                // Sort by createdAt (latest first)
                fetchedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setJobs(fetchedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setJobs([]);
            }
            setTimeout(() => setIsLoading(false), 800);
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === "All" || job.type?.toLowerCase() === filter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const handleViewDetails = (id) => {
        Router.push(`/jobs/${id}`);
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case "internship":
                return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
            case "full-time":
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            case "part-time":
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
        }
    };

    const formatDeadline = (deadline) => {
        if (!deadline) return "N/A";
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const isNewJob = (createdAt, index) => {
        if (!createdAt) return index < 4; // Fallback: first 4 jobs
        const jobDate = new Date(createdAt);
        const now = new Date();
        const diffDays = (now - jobDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 3; // Jobs posted within last 3 days
    };

    return (
        <div className="min-h-screen bg-theme-gradient py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Compact Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 card-theme px-4 py-2 rounded-full shadow-md mb-3">
                        <Sparkles className="text-blue-600 dark:text-blue-400" size={20} />
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Freshers Job Board
                        </h1>
                    </div>
                    <p className="text-theme-secondary text-sm">By AKTU Helper</p>
                </div>

                {/* Compact Search Bar */}
                <div className="card-theme rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="input-theme pl-10 pr-4 py-2.5 w-full text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative sm:w-40">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none" size={18} />
                            <select
                                className="input-theme pl-10 pr-8 py-2.5 w-full appearance-none cursor-pointer text-sm"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option>All</option>
                                <option>Internship</option>
                                <option>Full-Time</option>
                                <option>Part-Time</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                {!isLoading && (
                    <div className="mb-4 text-theme-secondary text-sm">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredJobs.length}</span> opportunities
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card-theme p-4 rounded-xl">
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Compact Job Cards */}
                {!isLoading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredJobs.map((job, idx) => (
                            <div
                                key={job.id}
                                className="group card-theme card-theme-hover p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 opacity-0"
                                style={{ animation: `slideUp 0.4s ease-out ${idx * 0.05}s forwards` }}
                            >
                                {/* Header Row */}
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(job.type)}`}>
                                        {job.type || "N/A"}
                                    </span>
                                    {isNewJob(job.createdAt, idx) && (
                                        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                            <Sparkles size={10} />
                                            NEW
                                        </div>
                                    )}
                                </div>

                                {/* Job Title & Company */}
                                <h3 className="text-base font-bold text-theme-primary mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {job.title}
                                </h3>
                                <p className="text-sm text-theme-secondary font-medium mb-3">{job.company}</p>

                                {/* Details */}
                                <div className="space-y-1.5 mb-4">
                                    <div className="flex items-center gap-1.5 text-xs text-theme-secondary">
                                        <MapPin size={14} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                        <span className="truncate">{job.location || "Remote"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-theme-secondary">
                                        <Calendar size={14} className="text-purple-500 dark:text-purple-400 flex-shrink-0" />
                                        <span>Apply by {formatDeadline(job.deadline)}</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleViewDetails(job.id)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 group-hover:gap-2 shadow-md"
                                >
                                    View Details
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredJobs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-theme-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-theme-muted" size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-theme-primary mb-2">No jobs found</h3>
                        <p className="text-theme-secondary text-sm">Try different search terms</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentJobBoard;