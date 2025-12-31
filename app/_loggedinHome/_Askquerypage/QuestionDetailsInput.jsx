import React from 'react';

const QuestionDetailsInput = ({ query, setQuery, maxWords = 100 }) => {
    const wordCount = query.trim() ? query.trim().split(/\s+/).length : 0;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Question Details
                </label>
                <span className={`text-xs ${wordCount > maxWords ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {wordCount}/{maxWords}
                </span>
            </div>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Provide more details about your question..."
                className="w-full h-20 sm:h-24 px-2.5 sm:px-3 py-2 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
        </div>
    );
};

export default QuestionDetailsInput;