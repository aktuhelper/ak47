"use client";
import React, { useEffect, useState } from "react";
import { Search, Briefcase, MapPin, Calendar, ExternalLink, Filter, Sparkles } from "lucide-react";
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
                   console.log("Fetched jobs data:", data);
                // Map the API response to match your component structure
                const fetchedJobs = data.data.map((job) => ({
                    id: job.documentId,
                    documentId: job.documentId,
                    title: job.title || job.attributes?.title,
                    company: job.company || job.attributes?.company,
                    location: job.location || job.attributes?.location,
                    type: job.jobType || job.attributes?.jobType,
                    deadline: job.deadline || job.attributes?.deadline,
                    link: job.applyLink || job.attributes?.applyLink,
                }));

                setJobs(fetchedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                // Fallback to demo data if API fails
                setJobs([
                    {
                        id: 1,
                        title: "Frontend Developer Intern",
                        company: "Tech Innovators",
                        location: "Remote",
                        type: "Internship",
                        deadline: "2025-12-30",
                        link: "https://forms.gle/demoFrontend",
                    },
                    {
                        id: 2,
                        title: "Software Engineer Trainee",
                        company: "CodeNest",
                        location: "Lucknow, India",
                        type: "Full-Time",
                        deadline: "2025-11-30",
                        link: "https://forms.gle/demoSoftware",
                    },
                ]);
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
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "full-time":
                return "bg-green-100 text-green-700 border-green-200";
            case "part-time":
                return "bg-blue-100 text-blue-700 border-blue-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const formatDeadline = (deadline) => {
        if (!deadline) return "N/A";
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header with animation */}
                <div className="text-center mb-12 opacity-0" style={{ animation: "fadeIn 0.6s ease-out forwards" }}>
                    <div className="inline-flex items-center gap-3 mb-4 bg-white px-6 py-3 rounded-full shadow-lg">
                        <Sparkles className="text-indigo-600" size={24} />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Job Opportunities only for Freshers
                        </h1>
                        <Briefcase className="text-purple-600" size={24} />
                    </div>
                    <p className="text-gray-600 text-lg">Presented By Aktuhelper</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by title or company..."
                                className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            <select
                                className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl appearance-none bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-w-[180px] outline-none"
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
                    <div className="mb-6 text-gray-600">
                        <span className="font-semibold text-indigo-600">{filteredJobs.length}</span> opportunities found
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Job Cards Grid */}
                {!isLoading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job, idx) => (
                            <div
                                key={job.id}
                                className="group bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 opacity-0"
                                style={{ animation: `slideUp 0.5s ease-out ${idx * 0.1}s forwards` }}
                            >
                                {/* Job Type Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(job.type)}`}>
                                        {job.type || "N/A"}
                                    </span>
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Briefcase className="text-indigo-600" size={20} />
                                    </div>
                                </div>

                                {/* Job Info */}
                                <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {job.title}
                                </h2>
                                <p className="text-gray-600 font-medium mb-4">{job.company}</p>

                                {/* Details */}
                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-indigo-500" />
                                        <span>{job.location || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} className="text-purple-500" />
                                        <span>Deadline: {formatDeadline(job.deadline)}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleViewDetails(job.id)}
                                    className="w-full bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group-hover:gap-3 shadow-md hover:shadow-lg"
                                >
                                    View Details
                                    <ExternalLink size={18} className="transition-all" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredJobs.length === 0 && (
                    <div className="text-center py-20 opacity-0" style={{ animation: "fadeIn 0.5s ease-out forwards" }}>
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
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