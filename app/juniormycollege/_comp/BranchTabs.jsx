import React from 'react';

export default function BranchTabs({ branches, selectedBranch, onBranchChange }) {
    return (
        <div className="flex overflow-x-auto pb-2 mb-2 gap-2 no-scrollbar">
            {branches.map((branch) => (
                <button
                    key={branch}
                    onClick={() => onBranchChange(branch)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${selectedBranch === branch
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                            : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        }`}
                >
                    {branch}
                </button>
            ))}
        </div>
    );
}