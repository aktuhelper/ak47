import React from 'react';
const PageHeader = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Ask a Question
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Get help from your campus community
                </p>
            </div>
        </div>
    );
};
export default PageHeader;