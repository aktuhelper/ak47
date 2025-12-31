"use client";
import React from 'react';
import { Home, MessageSquarePlus, TrendingUp, Building2, FileQuestion, User } from 'lucide-react';

export default function Sidebar({ activeTab = 'home', setActiveTab = () => { }, userData = {}, newQueriesCount = 0 }) {
    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'ask-query', label: 'Ask Query', icon: MessageSquarePlus },
        { id: 'trending-queries', label: 'Trending Queries', icon: TrendingUp },
        { id: 'my-college-queries', label: 'College', icon: Building2 },
        {
            id: 'my-queries',
            label: 'Queries',
            icon: FileQuestion,
            badge: newQueriesCount > 0 ? newQueriesCount : null
        },
        { id: 'Profile', label: 'Profile', icon: User },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:pt-16 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-zinc-800/50 z-30 shadow-sm dark:shadow-none">
                {/* Updated Logo/Brand Section - Clean Version */}
                <div className="px-4 py-4 border-b border-gray-100 dark:border-zinc-800/50">
                    <h1 className="text-2xl font-black tracking-wider" style={{ fontFamily: "'Fredoka One', 'Righteous', 'Rubik Mono One', cursive", letterSpacing: "0.05em" }}>
                        <span className="text-[#2663EB] dark:text-blue-400">
                            Campus
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 dark:from-red-400 dark:via-pink-400 dark:to-rose-500">
                            Connect
                        </span>
                    </h1>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-2 font-medium ml-1">by AktuHelper</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`group w-full flex cursor-pointer items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${isActive
                                    ? 'bg-gray-100 dark:bg-zinc-800/80 text-gray-900 dark:text-white font-semibold shadow-sm dark:shadow-zinc-900/50'
                                    : 'text-gray-700 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/40 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                                    }`} />
                                <span className="text-sm font-medium">{item.label}</span>

                                {/* Badge for new queries */}
                                {item.badge && (
                                    <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="px-3 py-4 border-t border-gray-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 hover:shadow-md dark:hover:shadow-blue-900/20 transition-all duration-200 cursor-pointer group">
                        <div className="relative w-9 h-9 flex-shrink-0">
                            <img
                                src={userData?.profileImageUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=currentUser"}
                                alt="User"
                                className="w-full h-full rounded-full border-2 border-blue-400/50 dark:border-blue-500/50 shadow-sm group-hover:scale-105 transition-transform duration-200 object-cover"
                                onError={(e) => {
                                    e.target.src = "https://api.dicebear.com/7.x/notionists/svg?seed=currentUser";
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {userData?.name || "Guest"}
                            </p>
                            <p className="text-[11px] text-gray-600 dark:text-zinc-400 truncate">
                                {userData?.branch} • {userData?.college}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 dark:bg-[#0f0f0f]/98 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800/50 px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200"
                            >
                                {/* Badge for mobile */}
                                {item.badge && (
                                    <span className="absolute -top-1 right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg border-2 border-white dark:border-[#0f0f0f] animate-pulse z-10">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}

                                <Icon className={`w-6 h-6 transition-all duration-200 ${isActive
                                    ? 'text-blue-600 dark:text-blue-400 scale-110'
                                    : 'text-gray-600 dark:text-zinc-400'
                                    }`} />
                                <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-zinc-400'
                                    }`}>
                                    {item.label.split(' ')[0]}
                                </span>
                                {isActive && (
                                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}