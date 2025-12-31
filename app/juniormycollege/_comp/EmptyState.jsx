import React from 'react';

export default function EmptyState({ type = "no-results", message, submessage, isSeniorPage = false }) {
    if (type === "end-of-list") {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {message || "You've reached the end of the list."}
            </div>
        );
    }

    if (type === "no-results") {
        const defaultMessage = isSeniorPage ? "No seniors found" : "No juniors found";

        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {message || defaultMessage}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    {submessage || "Try adjusting your filters or search query"}
                </p>
            </div>
        );
    }

    if (type === "first-year") {
        return (
            <div className="min-h-screen bg-theme-primary transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="text-6xl mb-4">👋</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {message || "Welcome, First Year Student!"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {submessage || (
                                <>
                                    As a 1st year student, you don't have any juniors yet.
                                    <br />
                                    Check out the "Seniors" section to connect with your seniors!
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "pass-out") {
        return (
            <div className="min-h-screen bg-theme-primary transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🎓</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {message || "You've Graduated!"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {submessage || (
                                <>
                                    As a pass-out, you don't have any seniors.
                                    <br />
                                    Check out the "Juniors" section to connect with current students!
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}