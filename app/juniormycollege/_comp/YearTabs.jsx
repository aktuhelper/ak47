import React from 'react';

export default function YearTabs({ years, selectedYear, onYearChange }) {
    return (
        <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar">
            {years.map((year) => (
                <button
                    key={year}
                    onClick={() => onYearChange(year)}
                    className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 border ${selectedYear === year
                            ? "bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white"
                            : "bg-transparent text-gray-500 dark:text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800"
                        }`}
                >
                    {year}
                </button>
            ))}
        </div>
    );
}