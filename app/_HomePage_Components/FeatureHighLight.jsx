"use client";
import { useState } from "react";

export default function FeaturesHighlight() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            title: "AI-Powered Study Assistant",
            description: "Get instant answers to your doubts with our advanced AI assistant. Available 24/7 to help you understand complex concepts, solve problems, and provide personalized study recommendations.",
            benefits: [
                "Instant doubt resolution anytime, anywhere",
                "Personalized learning recommendations",
                "Step-by-step problem explanations",
                "Context-aware responses based on your syllabus"
            ],
            color: "from-blue-500 to-cyan-500",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            mockup: (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-6 h-full flex items-center justify-center">
                    <div className="w-full max-w-md space-y-4">
                        <div className="bg-theme-card rounded-lg p-4 shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-theme-secondary">Can you explain Dijkstra's algorithm?</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 shadow-md text-white">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">Dijkstra's algorithm finds the shortest path between nodes in a graph. Let me break it down step by step...</p>
                                    <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                                            <div className="w-1 h-1 bg-white rounded-full animate-pulse animation-delay-200"></div>
                                            <div className="w-1 h-1 bg-white rounded-full animate-pulse animation-delay-400"></div>
                                        </div>
                                        <span>AI is typing...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Comprehensive Question Bank",
            description: "Access 10+ years of AKTU previous year papers with detailed solutions. Understand exam patterns, frequently asked questions, and practice with real exam questions.",
            benefits: [
                "Papers from 2015-2024 for all branches",
                "Detailed step-by-step solutions",
                "Pattern analysis and predictions",
                "Topic-wise question categorization"
            ],
            color: "from-purple-500 to-pink-500",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            mockup: (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 h-full flex items-center justify-center">
                    <div className="w-full max-w-md space-y-3">
                        {[
                            { year: "2024", questions: "50 Questions", status: "Solved" },
                            { year: "2023", questions: "48 Questions", status: "In Progress" },
                            { year: "2022", questions: "45 Questions", status: "Available" }
                        ].map((paper, idx) => (
                            <div key={idx} className="bg-theme-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                                            {paper.year.slice(2)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-theme-primary">AKTU {paper.year}</h4>
                                            <p className="text-xs text-theme-secondary">{paper.questions}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${paper.status === "Solved" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                                        paper.status === "In Progress" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                                            "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                        }`}>
                                        {paper.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: "Smart Study Analytics",
            description: "Track your progress with detailed analytics. See your strengths, identify weak areas, and get personalized study plans to maximize your exam performance.",
            benefits: [
                "Real-time progress tracking",
                "Subject-wise performance analysis",
                "Time spent on each topic",
                "Personalized improvement suggestions"
            ],
            color: "from-green-500 to-emerald-500",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            mockup: (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 h-full flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="bg-theme-card rounded-lg p-4 shadow-md">
                            <h4 className="font-semibold text-theme-primary mb-4">Your Progress</h4>
                            <div className="space-y-3">
                                {[
                                    { subject: "Data Structures", progress: 85, color: "bg-green-500" },
                                    { subject: "Algorithms", progress: 70, color: "bg-blue-500" },
                                    { subject: "DBMS", progress: 60, color: "bg-yellow-500" },
                                    { subject: "Operating Systems", progress: 45, color: "bg-orange-500" }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-theme-secondary">{item.subject}</span>
                                            <span className="font-semibold text-theme-primary">{item.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                                            <div
                                                className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section className="relative py-20 bg-theme-gradient overflow-hidden section-theme">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm font-semibold text-theme-primary">Powerful Features</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-theme-primary mb-3">
                        Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Succeed</span>
                    </h2>
                    <p className="text-theme-secondary max-w-2xl mx-auto">
                        Discover the powerful features that make AKTU Helper the ultimate study platform
                    </p>
                </div>

                {/* Feature Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {features.map((feature, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveFeature(index)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${activeFeature === index
                                ? `bg-gradient-to-r ${feature.color} text-white shadow-lg scale-105`
                                : "bg-theme-card text-theme-primary hover:shadow-md hover:scale-102 border border-theme"
                                }`}
                        >
                            <div className={activeFeature === index ? "text-white" : "text-theme-secondary"}>
                                {feature.icon}
                            </div>
                            <span className="hidden sm:inline">{feature.title}</span>
                        </button>
                    ))}
                </div>

                {/* Feature Display */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Content */}
                    <div className="order-2 lg:order-1">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${features[activeFeature].color} bg-opacity-10 dark:bg-opacity-20 rounded-full mb-4`}>
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-semibold text-theme-primary">Feature Highlight</span>
                        </div>

                        <h3 className="text-3xl font-bold text-theme-primary mb-4">
                            {features[activeFeature].title}
                        </h3>
                        <p className="text-theme-secondary mb-6 leading-relaxed">
                            {features[activeFeature].description}
                        </p>

                        <div className="space-y-3 mb-8">
                            {features[activeFeature].benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${features[activeFeature].color} flex items-center justify-center`}>
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-theme-secondary">{benefit}</p>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/features"
                            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${features[activeFeature].color} text-white font-semibold rounded-lg hover:shadow-xl transition-all hover:scale-105`}
                        >
                            Explore This Feature
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>

                    {/* Right Side - Mockup */}
                    <div className="order-1 lg:order-2">
                        <div className="relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${features[activeFeature].color} opacity-20 blur-3xl rounded-full`}></div>
                            <div className="relative bg-theme-card rounded-2xl shadow-2xl dark:shadow-zinc-900/50 p-2 border border-theme">
                                {features[activeFeature].mockup}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      `}</style>
        </section>
    );
}