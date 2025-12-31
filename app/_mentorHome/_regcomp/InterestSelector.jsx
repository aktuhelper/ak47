import React from "react";

const interestOptions = [
    "Web Development", "App Development", "AI/ML", "Data Science",
    "Cyber Security", "Cloud Computing", "Blockchain", "IoT",
    "Game Development", "UI/UX Design", "DevOps", "Competitive Programming",
    "Robotics", "Photography", "Video Editing", "Content Writing",
    "Public Speaking", "Music", "Sports", "Art & Design"
];

export default function InterestSelector({
    selectedInterests,
    onToggleInterest
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Select Your Interests & Skills
            </label>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-3">
                Choose at least 3 tags
            </p>

            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto custom-scrollbar p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                {interestOptions.map((interest) => (
                    <button
                        key={interest}
                        onClick={() => onToggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedInterests.includes(interest)
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500'
                            }`}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            {selectedInterests.length > 0 && (
                <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-gray-900 dark:text-white mb-1.5">
                        Selected ({selectedInterests.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {selectedInterests.map((interest) => (
                            <span
                                key={interest}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}