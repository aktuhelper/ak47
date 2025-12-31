import React from 'react';

export default function UserTypeFilter({ userTypeFilter, onFilterChange, isSeniorPage = false }) {
    const userType = isSeniorPage ? "Seniors" : "Juniors";

    return (
        <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800/50">
            <button
                onClick={() => onFilterChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${userTypeFilter === "all"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
                    }`}
            >
                All {userType}
            </button>
            <button
                onClick={() => onFilterChange("mentors")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${userTypeFilter === "mentors"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                    : "bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
                    }`}
            >
                <span className="text-amber-500">🏆</span> Top Mentors
            </button>
            <button
                onClick={() => onFilterChange("active")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${userTypeFilter === "active"
                    ? "bg-green-600 text-white shadow-md shadow-green-500/20"
                    : "bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
                    }`}
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active
            </button>
        </div>
    );
}