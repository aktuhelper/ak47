import React, { useState } from 'react';
import { X, Send, Eye, MessageSquare, User, Paperclip, AlertCircle } from 'lucide-react';
import { BADGE_DEFINITIONS, Badge } from '../badges/page';

const categoryLabels = {
    academics: 'Academics',
    career: 'Career',
    'college-life': 'College Life',
    general: 'General'
};

const visibilityLabels = {
    public: 'Public - All colleges',
    college: 'My College - Your institution',
    branch: 'My Branch - Same branch',
    seniors: 'Seniors - Mentors only'
};

// Helper to extract year number from year string
const extractYearNumber = (year) => {
    if (!year) return null;
    if (typeof year === 'number') return year;

    // Check if it's "Passout" (case-insensitive) - return 5 for alumni badge
    if (String(year).toLowerCase() === 'passout') return 5;

    const match = String(year).match(/\d+/);
    return match ? parseInt(match[0]) : null;
};

// FIXED: Simplified assignBadges function that uses badge flags
const assignBadgesForUser = (userData) => {
    const earnedBadges = [];

    if (!userData) return earnedBadges;

    // Check year badge
    if (userData.year) {
        const yearNum = extractYearNumber(userData.year);
        const yearBadge = Object.values(BADGE_DEFINITIONS.yearBadges).find(
            badge => badge.criteria.year === yearNum
        );
        if (yearBadge) earnedBadges.push(yearBadge);
    }

    // FIXED: Use badge flags directly from userData
    // Handle mentor badges with priority - only add the highest one
    if (userData.eliteMentor === true) {
        earnedBadges.push(BADGE_DEFINITIONS.achievementBadges.eliteMentor);
    } else if (userData.superMentor === true) {
        earnedBadges.push(BADGE_DEFINITIONS.achievementBadges.superMentor);
    } else if (userData.isMentor === true) {
        earnedBadges.push(BADGE_DEFINITIONS.achievementBadges.mentor);
    }

    // Check activity badges
    if (userData.activeParticipant === true) {
        earnedBadges.push(BADGE_DEFINITIONS.activityBadges.activeParticipant);
    }

    // Verification badge (if you want to show it as a badge)
    // Currently it shows as a tick, but you can uncomment this if needed
    // if (userData.isVerified === true) {
    //     earnedBadges.push(BADGE_DEFINITIONS.verificationBadges.verifiedUser);
    // }

    return earnedBadges;
};

const ReviewModal = ({
    show,
    onClose,
    onConfirm,
    title,
    query,
    category,
    visibility,
    files,
    isAnonymous,
    isSubmitting,
    userData
}) => {
    if (!show) return null;

    // Get user badges
    const userBadges = assignBadgesForUser(userData);

    // Format the user details string
    const getUserDetails = () => {
        if (isAnonymous) {
            return 'Anonymous User';
        }

        const parts = [];
        if (userData?.branch) parts.push(userData.branch);
        if (userData?.course) parts.push(userData.course);
        if (userData?.college) parts.push(userData.college);

        return parts.join(' • ') || 'Student';
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-zinc-800">
                {/* Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-zinc-800">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Review Your Query
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Preview Card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 relative">
                        {/* Category Badge - Top Right */}
                        <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 text-[10px] font-semibold bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200/50 dark:border-zinc-700/50">
                                {categoryLabels[category]}
                            </span>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 pr-20 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                {!isAnonymous && userData?.profileImageUrl ? (
                                    <img
                                        src={userData?.profileImageUrl}
                                        alt={userData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {isAnonymous ? 'Anonymous User' : userData?.name || 'Your Name'}
                                    </p>
                                    {!isAnonymous && userData?.isVerified && (
                                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-500 dark:bg-gray-400 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20" strokeWidth="2">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {!isAnonymous && userBadges.length > 0 && (
                                    <div className="flex items-center gap-0.5 flex-wrap mt-1.5">
                                        {userBadges.map((badge) => (
                                            <Badge key={badge.id} badge={badge} size="xs" showTooltip={false} />
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate mt-1.5">
                                    {getUserDetails()}
                                </p>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap">
                            {query}
                        </p>

                        {/* Attachments */}
                        {files.length > 0 && (
                            <div className="flex gap-2 mb-3 overflow-x-auto">
                                {files.map((file, index) => {
                                    const isImage = file.type.startsWith('image/');
                                    const fileURL = isImage ? URL.createObjectURL(file) : null;

                                    return (
                                        <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 flex-shrink-0">
                                            {isImage ? (
                                                <img src={fileURL} alt={file.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-zinc-800">
                                                    <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-zinc-700">
                            <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> 0
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> 0
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-[10px] sm:text-xs">
                                    {visibilityLabels[visibility]}
                                </span>
                                {isAnonymous && (
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-[10px] sm:text-xs">
                                        Anonymous
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 mt-3">
                        <div className="flex gap-2">
                            <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    Before you post
                                </p>
                                <ul className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                    <li>• Ensure your question is clear and specific</li>
                                    <li>• Visible to {visibilityLabels[visibility].split(' - ')[1]}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-3 sm:p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-3 sm:px-4 cursor-pointer bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded font-medium text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={`flex-1 py-2 px-3 sm:px-4 cursor-pointer rounded font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send className="w-3.5 h-3.5 cursor-pointer sm:w-4 sm:h-4" />
                                Post
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;