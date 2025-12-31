import React from 'react';
import { Target, MessageCircle, Star, Heart, TrendingUp, BookOpen } from 'lucide-react';

const NextBadgeModal = ({ isOpen, onClose, nextBadge }) => {
    if (!isOpen || !nextBadge) return null;

    // Helper function to get requirement label
    const getRequirementLabel = (key) => {
        const labels = {
            totalAnswersGiven: 'Answers Given',
            bestAnswers: 'Best Answers',
            helpfulVotes: 'Helpful Votes',
            totalViews: 'Total Views',
            totalQueries: 'Queries Posted'
        };
        return labels[key] || key;
    };

    // Helper function to get requirement icon
    const getRequirementIcon = (key) => {
        const icons = {
            totalAnswersGiven: MessageCircle,
            bestAnswers: Star,
            helpfulVotes: Heart,
            totalViews: TrendingUp,
            totalQueries: BookOpen
        };
        return icons[key] || Target;
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 dark:from-blue-600 dark:via-blue-700 dark:to-cyan-700 p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                                {nextBadge.badge.icon && <nextBadge.badge.icon className="w-6 h-6 text-white" strokeWidth={2.5} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-white leading-tight">{nextBadge.badge.name}</h3>
                                <p className="text-blue-100 text-xs mt-0.5 leading-tight">{nextBadge.badge.subtitle}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors flex-shrink-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Overall Progress Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-white">Overall Progress</span>
                            <span className="text-xs font-bold text-white">
                                {Math.round(
                                    Object.values(nextBadge.progress).reduce((acc, val) =>
                                        acc + Math.min(100, (val.current / val.needed) * 100), 0
                                    ) / Object.keys(nextBadge.progress).length
                                )}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-500"
                                style={{
                                    width: `${Math.round(
                                        Object.values(nextBadge.progress).reduce((acc, val) =>
                                            acc + Math.min(100, (val.current / val.needed) * 100), 0
                                        ) / Object.keys(nextBadge.progress).length
                                    )}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* Description */}
                    {nextBadge.badge.description && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                {nextBadge.badge.description}
                            </p>
                        </div>
                    )}

                    {/* Requirements Title */}
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Requirements to Unlock</h4>
                    </div>

                    {/* Progress Requirements */}
                    <div className="space-y-3">
                        {Object.entries(nextBadge.progress).map(([key, value]) => {
                            const percentage = Math.min(100, Math.round((value.current / value.needed) * 100));
                            const RequirementIcon = getRequirementIcon(key);
                            const isComplete = value.current >= value.needed;

                            return (
                                <div key={key} className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
                                    {/* Requirement Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${isComplete ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                                <RequirementIcon className={`w-3.5 h-3.5 ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
                                            </div>
                                            <span className={`text-xs font-semibold ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {getRequirementLabel(key)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <span className={`text-sm font-bold ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                                {value.current}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">/</span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{value.needed}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${isComplete
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : percentage >= 75
                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                    : percentage >= 50
                                                        ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                                                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                                        </div>
                                    </div>

                                    {/* Status Text */}
                                    <div className="mt-1.5 flex items-center justify-between">
                                        {isComplete ? (
                                            <span className="text-[10px] font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Requirement met!
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                {value.needed - value.current} more needed
                                            </span>
                                        )}
                                        <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Message */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300 text-center leading-relaxed">
                            Keep engaging with the community to unlock this badge! 🎯
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NextBadgeModal;