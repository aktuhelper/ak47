"use client";
import { useState, useEffect } from "react";

export default function StatisticsSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        {
            value: 50000,
            suffix: "+",
            label: "Active Students",
            description: "Learning together",
            color: "from-blue-500 to-cyan-500",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            value: 10000,
            suffix: "+",
            label: "Study Resources",
            description: "Papers, notes & more",
            color: "from-purple-500 to-pink-500",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
        {
            value: 95,
            suffix: "%",
            label: "Success Rate",
            description: "Students passing exams",
            color: "from-green-500 to-emerald-500",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
        },
        {
            value: 24,
            suffix: "/7",
            label: "Support Available",
            description: "Always here to help",
            color: "from-orange-500 to-red-500",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const AnimatedCounter = ({ end, suffix, duration = 2000 }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!isVisible) return;

            let startTime;
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);

                setCount(Math.floor(progress * end));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }, [isVisible, end, duration]);

        return (
            <span className="text-4xl sm:text-5xl font-bold">
                {count.toLocaleString()}{suffix}
            </span>
        );
    };

    return (
        <section className="relative py-20 bg-theme-gradient-light overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-40 animate-float"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-40 animate-float animation-delay-2000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="badge-theme inline-flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-sm font-semibold">Trusted by Thousands</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-theme-primary mb-4">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">Impact</span> in Numbers
                    </h2>
                    <p className="text-theme-secondary text-lg max-w-2xl mx-auto">
                        Join a thriving community of AKTU students achieving academic excellence
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative"
                            style={{
                                animation: isVisible ? `slideUp 0.6s ease-out ${index * 0.1}s both` : 'none'
                            }}
                        >
                            {/* Card */}
                            <div className="card-theme relative p-6 hover:shadow-2xl dark:hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2">
                                {/* Gradient Glow on Hover */}
                                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-5 transition-opacity duration-300 blur-xl`}></div>

                                {/* Content */}
                                <div className="relative">
                                    {/* Icon */}
                                    <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <div className="text-white">
                                            {stat.icon}
                                        </div>
                                    </div>

                                    {/* Number */}
                                    <div className={`mb-1 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </div>

                                    {/* Label */}
                                    <h3 className="text-lg font-bold text-theme-primary mb-1">
                                        {stat.label}
                                    </h3>
                                    <p className="text-theme-secondary text-xs">
                                        {stat.description}
                                    </p>
                                </div>

                                {/* Decorative Corner */}
                                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-5 dark:opacity-10 rounded-bl-full rounded-tr-xl`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -30px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    );
}