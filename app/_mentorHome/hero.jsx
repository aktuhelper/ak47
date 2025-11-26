"use client";

import React, { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";

const HeroSection = ({ openMeetSeniorModal }) => {
    const { user, isLoading } = useKindeBrowserClient();
    const router = useRouter();

    const handleMeetSenior = () => {
        if (isLoading) return;

        // If user is logged in → open modal
        if (user) {
            openMeetSeniorModal();
        } else {
            // user NOT logged in → redirect to login
            sessionStorage.setItem("returnUrl", window.location.pathname);
            router.push("/api/auth/login");
        }
    };

    return (
        <section className="relative overflow-hidden bg-theme-gradient py-20 px-6 md:px-12">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div
                className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-100 dark:bg-yellow-900/20 rounded-full opacity-20 blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
            ></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 animate-fade-in">
                        <h1
                            className="text-5xl md:text-6xl font-black text-theme-primary leading-tight tracking-tight"
                            style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                        >
                            A Bridge Between{" "}
                            <span
                                className="text-[#2663EB] dark:text-blue-400"
                                style={{ fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}
                            >
                                Juniors
                            </span>{" "}
                            &{" "}
                            <span
                                className="text-[#FFC149] dark:text-yellow-400"
                                style={{ fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}
                            >
                                Seniors
                            </span>{" "}
                            of AKTU
                        </h1>

                        <p className="text-lg text-theme-secondary leading-relaxed">
                            Get guidance from seniors, ask doubts publicly, explore students across all AKTU colleges, and learn from real experiences.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handleMeetSenior}
                                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 dark:hover:shadow-red-500/30 hover:scale-105"
                                style={{ fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Meet Your Senior
                                    <svg
                                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-l from-orange-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        <div className="flex items-center gap-6 pt-6">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-black"></div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white dark:border-black"></div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white dark:border-black"></div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white dark:border-black"></div>
                            </div>
                            <div className="text-sm text-theme-secondary">
                                <span className="font-bold text-theme-primary">5,000+</span> students already connected
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="relative hidden md:block">
                        <div className="relative w-full h-[500px]">
                            {/* Main Card */}
                            <div className="absolute top-10 right-0 w-80 h-96 card-theme shadow-2xl dark:shadow-blue-500/10 p-6 transform rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2663EB] to-blue-400 animate-pulse"></div>
                                    <div>
                                        <div className="font-semibold text-theme-primary">Senior Mentor</div>
                                        <div className="text-sm text-theme-secondary">CSE, 4th Year</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 bg-theme-secondary/20 rounded-full w-full animate-pulse"></div>
                                    <div
                                        className="h-3 bg-theme-secondary/20 rounded-full w-5/6 animate-pulse"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                    <div
                                        className="h-3 bg-theme-secondary/20 rounded-full w-4/6 animate-pulse"
                                        style={{ animationDelay: "0.4s" }}
                                    ></div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <div className="text-sm text-theme-primary mb-2">💡 Quick Tip</div>
                                    <div className="text-xs text-theme-secondary">
                                        Start with previous year papers for better preparation!
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 1 */}
                            <div className="absolute top-0 left-0 w-64 card-theme shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 animate-float">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFC149] to-yellow-400"></div>
                                    <div className="text-sm font-semibold text-theme-primary">Junior Student</div>
                                </div>
                                <div className="text-xs text-theme-secondary">"How to prepare for placements in 3rd year?"</div>
                                <div className="mt-2 text-xs text-[#2663EB] font-medium">12 answers →</div>
                            </div>

                            {/* Floating Card 2 */}
                            <div
                                className="absolute bottom-0 left-10 w-56 bg-gradient-to-br from-[#FFC149] to-yellow-400 rounded-2xl shadow-xl p-4 text-white dark:text-gray-900 animate-float"
                                style={{ animationDelay: "1s" }}
                            >
                                <div className="text-xl font-bold mb-1">1,200+</div>
                                <div className="text-sm opacity-90">Doubts Solved</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes fadeIn {
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
        </section>
    );
};

export default HeroSection;
