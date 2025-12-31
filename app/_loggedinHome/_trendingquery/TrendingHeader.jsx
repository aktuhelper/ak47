import { Flame, RefreshCw } from 'lucide-react';

export default function TrendingHeader({ totalCount, onRefresh, isRefreshing }) {
    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            Trending Queries
                        </h1>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
                        Popular questions from students across all colleges • {totalCount} total queries
                    </p>
                </div>

                {/* Refresh Button */}
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>
        </div>
    );
}