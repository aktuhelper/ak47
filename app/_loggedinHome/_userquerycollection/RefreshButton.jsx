// components/RefreshButton.jsx
export default function RefreshButton({ onRefresh, refreshing }) {
    return (
        <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 bg-transparent rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {refreshing ? (
                <>
                    <div className="h-4 w-4 border-2 border-gray-600 dark:border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Refreshing...</span>
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium">Refresh</span>
                </>
            )}
        </button>
    );
}