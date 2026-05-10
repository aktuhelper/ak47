"use client";
import React from "react";
import { Home, MessageSquarePlus, TrendingUp, Building2, FileQuestion, User } from "lucide-react";

const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "ask-query", label: "Ask Query", icon: MessageSquarePlus },
    { id: "trending-queries", label: "Trending Queries", icon: TrendingUp },
    { id: "my-college-queries", label: "College", icon: Building2 },
    { id: "my-queries", label: "Queries", icon: FileQuestion },
    { id: "Profile", label: "Profile", icon: User },
];

export default function PageSkeleton() {
    return (
        <>
            {/* Desktop Sidebar Skeleton */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:pt-16 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-zinc-800/50 z-30 shadow-sm">

                {/* Brand */}
                <div className="px-4 py-4 border-b border-gray-100 dark:border-zinc-800/50">
                    <div className="h-7 w-40 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="h-3 w-24 bg-gray-100 dark:bg-zinc-800/60 rounded mt-2 animate-pulse" />
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-3 py-3 space-y-1">
                    {navItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.id}
                                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0 text-gray-300 dark:text-zinc-700" />
                                <div
                                    className="h-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"
                                    style={{ width: `${60 + (i % 3) * 20}px` }}
                                />
                            </div>
                        );
                    })}
                </nav>

                {/* User profile block */}
                <div className="px-3 py-4 border-t border-gray-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-zinc-800/30 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse flex-shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 w-24 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                            <div className="h-2.5 w-32 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content skeleton */}
            <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
                <div className="p-4 sm:p-6 space-y-5 max-w-3xl">

                    {/* Hero / greeting block */}
                    <div className="h-32 bg-gray-200 dark:bg-zinc-800/60 rounded-2xl animate-pulse" />

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[80, 64, 72].map((w, i) => (
                            <div key={i} className="h-20 bg-gray-100 dark:bg-zinc-800/40 rounded-xl animate-pulse" />
                        ))}
                    </div>

                    {/* Feed cards */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2 p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-2xl animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex-shrink-0" />
                                <div className="h-3.5 w-36 bg-gray-200 dark:bg-zinc-700 rounded" />
                            </div>
                            <div className="h-3 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
                            <div className="h-3 w-4/5 bg-gray-200 dark:bg-zinc-700 rounded" />
                            <div className="h-3 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile bottom nav skeleton */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 dark:bg-[#0f0f0f]/98 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800/50 px-2 py-2">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.id} className="flex flex-col items-center gap-1 px-4 py-2">
                                <Icon className="w-6 h-6 text-gray-300 dark:text-zinc-700" />
                                <div className="h-2 w-8 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                            </div>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}