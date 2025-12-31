import React from 'react';

export default function ErrorMessage({ error, onRetry }) {
    if (!error) return null;

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}