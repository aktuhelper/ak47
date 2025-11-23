"use client";
import React from 'react';

export default function CTAComponent() {
    return (
        <div className="section-theme py-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Main CTA Container */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 p-8 md:p-10 shadow-2xl">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-6 left-6 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-4">
                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            <span className="text-white text-xs font-semibold">Connect & Grow Together</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                            Find & Meet Your<br />
                            Seniors & Juniors
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-white/90 mb-4 font-medium">
                            with <span className="font-bold text-yellow-300">CampusLink</span> by{' '}
                            <span className="font-bold text-yellow-300">AKTUHelper</span>
                        </p>

                        {/* Description */}
                        <p className="text-white/80 text-sm md:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
                            Bridge the gap between years. Connect with seniors for guidance, collaborate with peers, and mentor juniors.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                            <a
                                href="/signup"
                                className="group relative px-6 py-3 bg-white text-blue-600 font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                            >
                                {/* Shine Effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>

                                <span className="relative flex items-center gap-2">
                                    Get Started Free
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </a>

                            <a
                                href="/about"
                                className="group px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-base rounded-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            >
                                Learn More
                                <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </a>
                        </div>

                        {/* Stats Section */}
                        <div className="pt-6 border-t border-white/20 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">10K+</div>
                                <div className="text-white/70 text-xs font-medium">Active Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
                                <div className="text-white/70 text-xs font-medium">Colleges</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">50K+</div>
                                <div className="text-white/70 text-xs font-medium">Connections</div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl"></div>
                </div>

                {/* Feature Cards Below CTA */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="group bg-theme-card border border-theme rounded-xl p-5 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-theme-primary font-bold text-base mb-2">Connect Instantly</h3>
                        <p className="text-theme-secondary text-xs leading-relaxed">
                            Find and connect with students from your college based on branch, year, and interests.
                        </p>
                    </div>

                    <div className="group bg-theme-card border border-theme rounded-xl p-5 hover:shadow-lg hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-theme-primary font-bold text-base mb-2">Get Mentorship</h3>
                        <p className="text-theme-secondary text-xs leading-relaxed">
                            Seek guidance from experienced seniors on academics, placements, and career paths.
                        </p>
                    </div>

                    <div className="group bg-theme-card border border-theme rounded-xl p-5 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-theme-primary font-bold text-base mb-2">Build Community</h3>
                        <p className="text-theme-secondary text-xs leading-relaxed">
                            Create study groups, collaborate on projects, and build lasting friendships.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}