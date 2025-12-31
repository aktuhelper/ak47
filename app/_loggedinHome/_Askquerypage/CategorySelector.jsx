import React from 'react';

const categoryOptions = [
    { id: 'academics', label: 'Academics', icon: '📚' },
    { id: 'career', label: 'Career', icon: '💼' },
    { id: 'college-life', label: 'College Life', icon: '🎓' },
    { id: 'general', label: 'General', icon: '💬' }
];

const CategorySelector = ({ category, setCategory }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
            <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categoryOptions.map((option) => {
                    const isSelected = category === option.id;
                    return (
                        <button
                            key={option.id}
                            onClick={() => setCategory(option.id)}
                            className={`p-2.5 rounded border cursor-pointer transition-colors ${isSelected
                                    ? 'border-gray-400 bg-gray-100 dark:bg-zinc-800 dark:border-zinc-600'
                                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-lg mb-1">{option.icon}</div>
                                <div className={`text-xs font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {option.label}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelector;