import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function CollegeHeader({ collegeName, totalQueries, onRefresh }) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        // Keep spinning for at least 600ms for better UX
        setTimeout(() => setIsRefreshing(false), 600);
    };

    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                        My College
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-4">
                        Queries from your college community • {totalQueries} total queries
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Refresh queries"
                >
                    <RefreshCw
                        className={`h-4 w-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''
                            }`}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400">
                {collegeName}
            </span>
        </div>
    );
}

// Demo usage
export default function Demo() {
    return (
        <div className="p-8 bg-white dark:bg-zinc-900 min-h-screen">
            <CollegeHeader
                collegeName="Stanford University"
                totalQueries={1247}
                onRefresh={async () => {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('Refreshed!');
                }}
            />
        </div>
    );
}