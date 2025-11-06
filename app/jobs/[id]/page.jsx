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

    const STRAPI_API_URL = `http://localhost:1337/api/jobs/${jobId}?populate=*`;

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
            console.log("Fetched job data:", data);
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
            setJob(getDemoJob(parseInt(jobId)));
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
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleApplyClick = (e) => {
        e.preventDefault();
        setIsApplying(true);
        setCountdown(15);
    };
    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case "internship":
                return "bg-purple-50 text-purple-700 border border-purple-200";
            case "full-time":
                return "bg-green-50 text-green-700 border border-green-200";
            case "part-time":
                return "bg-blue-50 text-blue-700 border border-blue-200";
            default:
                return "bg-gray-50 text-gray-700 border border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Job not found</h3>
                    <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/jobs"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <Link
                    href="/jobs"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Jobs
                </Link>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getTypeColor(job.type)}`}>
                                    {job.type}
                                </span>
                                <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4 mr-1.5" />
                                    Posted {job.postedDate}
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                                {job.title}
                            </h1>
                            <p className="text-2xl text-gray-700 font-semibold mb-6">
                                {job.company}
                            </p>

                            <div className="flex flex-wrap gap-4 text-gray-700 mb-6">
                                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                                    <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                                    <span className="font-medium">{job.location}</span>
                                </div>
                                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                                    <FaIndianRupeeSign className="w-5 h-5 mr-2 text-green-500" />
                                    <span className="font-medium">{job.salary}</span>
                                </div>
                                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                                    <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                                    <span className="font-medium">{job.experience} Years</span>
                                </div>
                            </div>

                            {job.deadline && (
                                <div className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 rounded-xl text-sm font-semibold border-2 border-red-200 shadow-sm">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Application Deadline: {formatDeadline(job.deadline)}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleApplyClick}
                        disabled={isApplying}
                        className={`inline-flex cursor-pointer items-center justify-center px-8 py-4 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isApplying
                                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                            }`}
                    >
                        {isApplying ? (
                            <>
                                <RefreshCw className="w-5 h-5 cursor-pointer mr-2 animate-spin" />
                                Redirecting in {countdown}s...
                            </>
                        ) : (
                            <>
                                Apply Now
                                    <ExternalLink className="w-5 cursor-pointer h-5 ml-2" />
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                        </div>
                        About the Role
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{job.description}</p>
                </div>

                {job.skills && job.skills.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-5">Required Skills</h2>
                        <div className="flex flex-wrap gap-3">
                            {job.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl text-base font-semibold border-2 border-indigo-200 hover:border-indigo-300 transition-colors shadow-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-5">Key Responsibilities</h2>
                        <ul className="space-y-4">
                            {job.responsibilities.map((item, index) => (
                                <li key={index} className="flex items-start group">
                                    <div className="mt-1">
                                        <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {job.requirements && job.requirements.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-5">Requirements</h2>
                        <ul className="space-y-4">
                            {job.requirements.map((item, index) => (
                                <li key={index} className="flex items-start group">
                                    <div className="mt-1">
                                        <CheckCircle className="w-6 h-6 text-indigo-500 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {job.benefits && job.benefits.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-5">Benefits & Perks</h2>
                        <ul className="space-y-4">
                            {job.benefits.map((item, index) => (
                                <li key={index} className="flex items-start group">
                                    <div className="mt-1">
                                        <CheckCircle className="w-6 h-6 text-purple-500 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-10 text-center shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Apply?</h3>
                    <p className="text-gray-600 mb-6 text-lg">Take the next step in your career journey</p>
                    <button
                        onClick={handleApplyClick}
                        disabled={isApplying}
                        className={`inline-flex items-center justify-center px-10 py-4 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isApplying
                                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                            }`}
                    >
                        {isApplying ? (
                            <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                Redirecting in {countdown}s...
                            </>
                        ) : (
                            <>
                                Apply Now
                                <ExternalLink className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}