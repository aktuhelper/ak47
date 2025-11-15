"use client";
import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function ServicesSection() {
    const { user, isAuthenticated } = useKindeBrowserClient();
    const [activeService, setActiveService] = useState(null);
    const username = isAuthenticated ? user?.given_name || user?.email : null;

    const services = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "Previous Year Papers",
            description: "Complete collection of AKTU question papers from 2015-2024 with solutions",
            features: ["All branches covered", "Detailed solutions", "Pattern analysis"],
            color: "from-blue-500 to-cyan-500",
            link: "/papers",
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: "Study Notes",
            description: "Comprehensive notes prepared by top scorers and verified by experts",
            features: ["Unit-wise notes", "Quick revision", "Exam-focused"],
            color: "from-purple-500 to-pink-500",
            link: "/notes",
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: "AI Study Assistant",
            description: "Get instant answers to your doubts with our AI-powered study companion",
            features: ["24/7 availability", "Instant solutions", "Personalized help"],
            color: "from-orange-500 to-red-500",
            link: "/ai-assistant",
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
            title: "Placement Support",
            description: "Get access to placement resources, interview prep and company insights",
            features: ["Coding Questions", "Aptitude Prepartion", "Interview Questions", "Project Ideas with Github Links"],
            color: "from-green-500 to-emerald-500",
            link: "/lectures",
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            title: "Community Forum",
            description: "Connect with fellow students, share knowledge and get help",
            features: ["Active discussions", "Expert answers", "Study groups"],
            color: "from-indigo-500 to-blue-500",
            link: "/community",
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            title: "Job Updates",
            description: "Stay informed with the latest job openings and placement drives",
            features: ["Regular updates", "Company insights", "Application tips"],
            color: "from-yellow-500 to-orange-500",
            link: "/tests",
        },
    ];

    return (
        <section className="relative bg-theme-gradient-light py-16 overflow-hidden">
            {/* Floating Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-100 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-100 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-pulse animation-delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="badge-theme inline-flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-semibold">Everything You Need in One Place</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-theme-primary mb-3">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">Services</span>
                    </h2>
                    <p className="text-theme-secondary max-w-2xl mx-auto">
                        Comprehensive tools and resources designed to help you succeed in your AKTU journey
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service, index) => {
                        const isActive = activeService === index;

                        return (
                            <div
                                key={index}
                                onMouseEnter={() => setActiveService(index)}
                                onMouseLeave={() => setActiveService(null)}
                                className="group relative"
                            >
                                <div
                                    className={`card-theme relative h-full p-5 transition-all duration-300 cursor-pointer ${isActive
                                        ? "border-transparent shadow-2xl dark:shadow-blue-500/20 -translate-y-2"
                                        : "shadow-md hover:shadow-xl hover:-translate-y-1"
                                        }`}
                                >
                                    {isActive && (
                                        <div
                                            className={`absolute inset-0 rounded-xl bg-gradient-to-r ${service.color} opacity-20 dark:opacity-10 blur-sm`}
                                        ></div>
                                    )}

                                    <div className="relative">
                                        <div
                                            className={`inline-flex p-2.5 rounded-lg mb-3 bg-gradient-to-r ${service.color} transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"
                                                }`}
                                        >
                                            <div className="text-white">{service.icon}</div>
                                        </div>

                                        <h3 className="text-lg font-bold text-theme-primary mb-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-theme-secondary text-xs mb-3 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <ul className="space-y-1.5 mb-4">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-xs text-theme-secondary">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`}></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <a
                                            href={service.link}
                                            className={`inline-flex items-center gap-2 text-xs font-semibold transition-all duration-300 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-theme-secondary group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                                }`}
                                        >
                                            {/* Optional: Add arrow icon or text */}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-5 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-600 rounded-xl shadow-xl">
                        <div className="text-white text-left">
                            <h3 className="text-lg font-bold mb-1">Ready to excel in your exams?</h3>
                            <p className="text-blue-100 dark:text-blue-200 text-sm">Join thousands of successful students today</p>
                        </div>
                        <a
                            href="/"
                            className="px-6 py-2.5 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all hover:scale-105 whitespace-nowrap text-sm"
                        >
                            Get Started {username || null}
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse { animation: pulse 3s ease-in-out infinite; }
                .animation-delay-1000 { animation-delay: 1s; }
            `}</style>
        </section>
    );
}