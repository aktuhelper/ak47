import React from 'react';
import { Globe, Building2, FlaskConical, GraduationCap } from 'lucide-react';

const visibilityOptions = [
    { id: 'public', label: 'Public', icon: Globe, desc: 'All colleges' },
    { id: 'college', label: 'My College', icon: Building2, desc: 'Your institution' },
    { id: 'branch', label: 'My Branch', icon: FlaskConical, desc: 'Same branch' },
    { id: 'seniors', label: 'Seniors', icon: GraduationCap, desc: 'Mentors only' }
];

const VisibilitySelector = ({ visibility, setVisibility }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
            <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Visibility
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {visibilityOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = visibility === option.id;
                    return (
                        <button
                            key={option.id}
                            onClick={() => setVisibility(option.id)}
                            className={`p-2 rounded border cursor-pointer text-left transition-colors ${isSelected
                                    ? 'border-gray-400 bg-gray-100 dark:bg-zinc-800 dark:border-zinc-600'
                                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                                }`}
                        >
                            <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                }`} />
                            <div className={`text-xs font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
                                }`}>
                                {option.label}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VisibilitySelector;