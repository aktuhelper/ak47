"use client";
import React, { useState, useEffect } from "react";
import {
    FiGithub,
    FiExternalLink,
    FiStar,
    FiGitBranch,
} from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://aktuhelperserver-production.up.railway.app/api";
const TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export default function ProjectsShowcase() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/projects?populate=*`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Transform Strapi data to match your component structure
            const transformedProjects = data.data.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                tags: item.tags || [],
                github: item.github,
                liveUrl: item.liveUrl,
                stars: item.stars || 0,
                forks: item.forks || 0,
                color: item.color || "from-blue-500 to-cyan-500",
            }));

            setProjects(transformedProjects);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Failed to load projects. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">✕</span>
                    </div>
                    <p className="text-red-600 text-lg font-semibold mb-2">Error</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                        Portfolio 2025
                    </span>
                    <h1 className="mt-6 text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 tracking-tight">
                        Featured Projects
                    </h1>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
                        A curated collection of projects showcasing modern web technologies
                        and innovative solutions
                    </p>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No projects found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className={`h-2 bg-gradient-to-r ${project.color}`} />

                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-5">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 pr-2">
                                            {project.title}
                                        </h3>
                                        <div className="flex gap-2 shrink-0">
                                            {project.github && (
                                                <a
                                                    href={project.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-900 hover:text-white border border-gray-200 hover:border-gray-900 transition-all duration-300 hover:scale-110 hover:rotate-12"
                                                >
                                                    <FiGithub className="w-5 h-5" />
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-600 hover:text-white border border-gray-200 hover:border-blue-600 transition-all duration-300 hover:scale-110"
                                                >
                                                    <FiExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-base mb-6 leading-relaxed line-clamp-3">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {(project.stars > 0 || project.forks > 0) && (
                                        <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                                            {project.stars > 0 && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FiStar className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{project.stars}</span>
                                                </div>
                                            )}
                                            {project.forks > 0 && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FiGitBranch className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{project.forks}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}