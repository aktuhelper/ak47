import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ error, onRetry }) {
    if (!error) return null;

    return (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-100">Failed to load queries</p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
                <button
                    onClick={onRetry}
                    className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}