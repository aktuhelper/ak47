import React from 'react';

const QuestionTitleInput = ({ title, setTitle }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
            <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Question Title
            </label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear, descriptive title..."
                className="w-full px-2.5 sm:px-3 py-2 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

export default QuestionTitleInput;