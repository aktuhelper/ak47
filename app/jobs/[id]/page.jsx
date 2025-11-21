"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Clock,
    MapPin,
    Calendar,
    ExternalLink,
    CheckCircle,
    RefreshCw,
    Briefcase,
    Sparkles,
    Award,
    Target,
    Gift,
} from "lucide-react";
import Link from "next/link";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function JobDetailPage() {
    const params = useParams();
    const jobId = params.id;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [countdown, setCountdown] = useState(15);

    const STRAPI_API_URL = `https://aktuhelperserver-production.up.railway.app/api/jobs/${jobId}?populate=*`;

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        let timer;
        if (isApplying && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (isApplying && countdown === 0) {
            window.open(job.applyLink, '_blank', 'noopener,noreferrer');
            setIsApplying(false);
            setCountdown(15);
        }
        return () => clearTimeout(timer);
    }, [isApplying, countdown, job]);

    const fetchJobDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(STRAPI_API_URL);
            if (!response.ok) throw new Error("Failed to fetch job");

            const data = await response.json();
            const item = data.data;
            const attrs = item.attributes || item;

            const jobData = {
                id: item.id,
                documentId: item.documentId,
                title: attrs.title,
                company: attrs.company,
                location: attrs.location,
                type: attrs.jobType || attrs.type,
                salary: attrs.salary || "Not specified",
                postedDate: formatDate(attrs.createdAt || attrs.publishedAt),
                applyLink: attrs.applyLink || attrs.link,
                deadline: attrs.deadline,
                description: attrs.description || "No description available for this position.",
                skills: Array.isArray(attrs.skills) ? attrs.skills : [],
                experience: attrs.experience || "Not specified",
                responsibilities: Array.isArray(attrs.responsibilities) ? attrs.responsibilities : [],
                requirements: Array.isArray(attrs.requirements) ? attrs.requirements : [],
                benefits: Array.isArray(attrs.benefits) ? attrs.benefits : [],
            };
            setJob(jobData);
        } catch (err) {
            console.error("Error fetching job details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return `${Math.floor(diffDays / 30)}mo ago`;
    };

    const formatDeadline = (deadline) => {
        if (!deadline) return "Not specified";
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleApplyClick = (e) => {
        e.preventDefault();
        setIsApplying(true);
        setCountdown(15);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-theme-gradient flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-theme-secondary text-sm font-medium">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-theme-gradient flex items-center justify-center p-4">
                <div className="text-center card-theme p-6 rounded-xl max-w-md">
                    <div className="w-14 h-14 bg-theme-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="w-7 h-7 text-theme-muted" />
                    </div>
                    <h3 className="text-lg font-semibold text-theme-primary mb-2">Job not found</h3>
                    <p className="text-theme-secondary text-sm mb-4">The job you're looking for doesn't exist.</p>
                    <Link href="/jobs" className="btn-primary inline-flex items-center text-sm">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-theme-gradient">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Back Button */}
                <Link
                    href="/jobs"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 text-sm font-medium transition-colors card-theme px-3 py-1.5 rounded-lg"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back
                </Link>

                {/* Job Header Card */}
                <div className="card-theme rounded-xl p-5 mb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(job.type)}`}>
                            {job.type}
                        </span>
                        <div className="flex items-center text-theme-secondary text-xs bg-theme-secondary px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3 mr-1" />
                            {job.postedDate}
                        </div>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                            <Sparkles size={12} />
                            NEW
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary mb-2 leading-tight">
                        {job.title}
                    </h1>
                    <p className="text-lg text-theme-secondary font-semibold mb-4">
                        {job.company}
                    </p>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        <div className="flex items-center gap-1.5 bg-theme-secondary px-3 py-2 rounded-lg">
                            <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                            <span className="text-xs text-theme-primary font-medium truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-theme-secondary px-3 py-2 rounded-lg">
                            <FaIndianRupeeSign className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                            <span className="text-xs text-theme-primary font-medium truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-theme-secondary px-3 py-2 rounded-lg">
                            <Briefcase className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                            <span className="text-xs text-theme-primary font-medium">{job.experience} Yrs</span>
                        </div>
                        {job.deadline && (
                            <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-3 py-2 rounded-lg">
                                <Calendar className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <span className="text-xs text-red-700 dark:text-red-400 font-semibold truncate">{formatDeadline(job.deadline)}</span>
                            </div>
                        )}
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={handleApplyClick}
                        disabled={isApplying}
                        className={`w-full sm:w-auto px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${isApplying
                            ? 'bg-gray-400 dark:bg-zinc-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md'
                            }`}
                    >
                        {isApplying ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Redirecting in {countdown}s
                            </>
                        ) : (
                            <>
                                Apply Now
                                <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>

                {/* Description */}
                <div className="card-theme rounded-xl p-5 mb-4">
                    <h2 className="text-lg font-bold text-theme-primary mb-3 flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        About the Role
                    </h2>
                    <p className="text-theme-secondary text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                    <div className="card-theme rounded-xl p-5 mb-4">
                        <h2 className="text-lg font-bold text-theme-primary mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Required Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="badge-theme text-xs px-3 py-1.5"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="card-theme rounded-xl p-5 mb-4">
                        <h2 className="text-lg font-bold text-theme-primary mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                            Key Responsibilities
                        </h2>
                        <ul className="space-y-2">
                            {job.responsibilities.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-theme-secondary text-sm leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <div className="card-theme rounded-xl p-5 mb-4">
                        <h2 className="text-lg font-bold text-theme-primary mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Requirements
                        </h2>
                        <ul className="space-y-2">
                            {job.requirements.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-theme-secondary text-sm leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                    <div className="card-theme rounded-xl p-5 mb-4">
                        <h2 className="text-lg font-bold text-theme-primary mb-3 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Benefits & Perks
                        </h2>
                        <ul className="space-y-2">
                            {job.benefits.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-theme-secondary text-sm leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* CTA Card */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
                    <h3 className="text-xl font-bold text-theme-primary mb-2">Ready to Apply?</h3>
                    <p className="text-theme-secondary text-sm mb-4">Take the next step in your career</p>
                    <button
                        onClick={handleApplyClick}
                        disabled={isApplying}
                        className={`px-8 py-3 text-white text-sm font-semibold rounded-lg transition-all inline-flex items-center gap-2 ${isApplying
                            ? 'bg-gray-400 dark:bg-zinc-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                            }`}
                    >
                        {isApplying ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Redirecting in {countdown}s
                            </>
                        ) : (
                            <>
                                Apply Now
                                <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}