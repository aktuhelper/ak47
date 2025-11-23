"use client";
import React from 'react';

export default function MentorProfiles() {
    const [showAll, setShowAll] = React.useState(false);

    const profiles = [
        {
            id: 1,
            name: "Prashant Kumar Singh",
            role: "Mentor • CSE",
            college: "IIT Delhi",
            badge: "Super Mentor",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor1",
            skills: ["React", "Node.js", "Python", "AI/ML", "System Design"],
        },
        {
            id: 2,
            name: "Aman Gupta",
            role: "Senior • ECE",
            college: "NIT Trichy",
            badge: "Mentor",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor2",
            skills: ["VLSI", "Embedded Systems", "IoT"],
        },
        {
            id: 3,
            name: "Neha Sharma",
            role: "Junior • IT",
            college: "BITS Pilani",
            badge: null,
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor3",
            skills: ["JavaScript", "React", "UI/UX"],
        },
        {
            id: 4,
            name: "Rohit Verma",
            role: "Mentor • Mechanical",
            college: "IIT Bombay",
            badge: "Super Mentor",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor4",
            skills: ["CAD", "Robotics", "3D Printing"],
        }
    ];

    const displayedProfiles = showAll ? profiles : profiles.slice(0, 3);

    return (
        <div className="section-theme py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Meet Our Mentors</h1>
                    <p className="text-gray-600 dark:text-gray-400">Connect with experienced mentors from various departments</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedProfiles.map((p) => (
                        <div
                            key={p.id}
                            className="group bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20 hover:-translate-y-2 hover:border-red-500/30 flex flex-col"
                        >
                            <div className="flex gap-4 p-5 flex-1">
                                <div className="flex-shrink-0">
                                    <img
                                        src={p.avatar}
                                        alt={p.name}
                                        className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-zinc-800 shadow-lg shadow-red-500/20 ring-2 ring-red-500/10 group-hover:ring-red-500/30 transition-all duration-300"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-gray-900 dark:text-white font-bold text-base truncate">
                                                {p.name}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{p.role}</p>
                                            <p className="text-blue-600 dark:text-blue-400 text-xs mt-1 flex items-center gap-1 font-bold">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {p.college}
                                            </p>
                                        </div>
                                        {p.badge && (
                                            <span className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${p.badge === "Super Mentor"
                                                ? "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 shadow-sm shadow-red-500/20"
                                                : "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800 shadow-sm shadow-orange-500/20"
                                                }`}>
                                                ⭐ {p.badge}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {p.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-zinc-950/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-800 transition-colors duration-200"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-5 pb-5 flex gap-3">
                                <button className="group/view relative flex-1 py-2.5 bg-transparent border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40">
                                    {/* Animated background */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-500 dark:to-rose-400 transform scale-x-0 group-hover/view:scale-x-100 transition-transform duration-300 origin-left"></span>

                                    {/* Content */}
                                    <span className="relative flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        View Profile
                                    </span>
                                </button>

                                <button className="group/connect relative flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105">
                                    {/* Shine effect */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/connect:translate-x-[100%] transition-transform duration-700"></span>

                                    {/* Content */}
                                    <span className="relative flex items-center gap-2">
                                        <svg className="w-4 h-4 group-hover/connect:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Connect
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Link */}
                {profiles.length > 3 && !showAll && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setShowAll(true)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg underline-offset-4 hover:underline transition-colors duration-200"
                        >
                            View More Mentors
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}