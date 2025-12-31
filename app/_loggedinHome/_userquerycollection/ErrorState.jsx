// components/ErrorState.jsx
export default function ErrorState({ error, onRetry }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
                    Error loading queries: {error}
                </p>
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}