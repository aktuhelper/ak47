import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, onSearchChange, placeholder }) {
    return (
        <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl leading-5 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                placeholder={placeholder || "Search by name, handle, skills, or interest..."}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
}