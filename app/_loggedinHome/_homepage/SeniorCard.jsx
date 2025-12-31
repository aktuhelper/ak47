import React, { useState } from 'react';
import AskQueryModal from '../AskQueryModal';
import { BADGE_DEFINITIONS, assignBadges } from "../badges/page";

const SeniorCard = ({ senior, currentUserId, isLive }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewProfile = () => {
        window.location.href = `/profile/${senior.documentId || senior.id}`;
    };

    const handleAskQuery = () => {
        setIsModalOpen(true);
    };

    // ✅ Determine if user is online (isLive prop takes priority, fallback to isActive)
    const isUserOnline = isLive || senior.isActive;

    // Get year number from yearBadge - Updated to support alumni/passout
    const getYearFromBadge = (yearBadge) => {
        const yearMap = {
            '1st-year': 1,
            '2nd-year': 2,
            '3rd-year': 3,
            '4th-year': 4,
            'alumni': 5,
            'passout': 5
        };
        return yearMap[yearBadge] || 1;
    };

    // Prepare user activity data for badge assignment
    const userActivity = {
        year: getYearFromBadge(senior.yearBadge),
        answeredQueries: senior.answeredQueries || 0,
        helpfulAnswers: senior.helpfulAnswers || 0,
        views: senior.views || 0,
        queriesPosted: senior.queriesPosted || 0,
        engagement: senior.engagement || 0,
        verified: senior.isVerified || false
    };

    // Get badges from badge system
    let badges = assignBadges(userActivity);

    // Handle mentor badges - show only highest achieved
    // Remove any existing mentor badges to avoid duplicates from assignBadges
    badges = badges.filter(b =>
        b && b.id !== 'mentor' && b.id !== 'super_mentor' && b.id !== 'elite_mentor'
    );

    // Add only the highest mentor badge based on explicit flags
    // Priority: Elite Mentor > Super Mentor > Mentor
    if (senior.eliteMentor === true) {
        badges.push(BADGE_DEFINITIONS.achievementBadges.eliteMentor);
    } else if (senior.superMentor === true) {
        badges.push(BADGE_DEFINITIONS.achievementBadges.superMentor);
    } else if (senior.isMentor === true) {
        badges.push(BADGE_DEFINITIONS.achievementBadges.mentor);
    }

    // Get year badge from badges array
    const yearBadge = badges.find(b => b && b.isYearBadge);

    // Get mentor badge from badges array
    const mentorBadge = badges.find(b =>
        b && (b.id === 'mentor' || b.id === 'super_mentor' || b.id === 'elite_mentor')
    );

    // Check if user is passout/alumni
    const isPassoutStudent = yearBadge && yearBadge.id === 'alumni_passout';

    // Prepare receiver data object for the modal
    const receiverData = {
        id: senior.id,
        documentId: senior.documentId || senior.id,
        name: senior.name,
        username: senior.username || senior.name,
        avatar: senior.avatar,
        role: senior.role,
        college: senior.college,
        course: senior.course,
        branch: senior.branch,
        yearBadge: senior.yearBadge,
        isMentor: senior.isMentor,
        superMentor: senior.superMentor,
        eliteMentor: senior.eliteMentor,
        isVerified: senior.isVerified,
        answeredQueries: senior.answeredQueries,
        helpfulAnswers: senior.helpfulAnswers,
        views: senior.views,
        queriesPosted: senior.queriesPosted,
        engagement: senior.engagement
    };

    return (
        <>
            <div className="group bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20 hover:-translate-y-2 hover:border-red-500/30 flex flex-col h-full min-w-[320px]">
                <div className="flex gap-4 p-5 flex-1">
                    <div className="flex-shrink-0 relative">
                        {/* Avatar with online indicator */}
                        <div className="relative">
                            <img
                                src={senior.avatar}
                                alt={senior.name}
                                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-zinc-800 shadow-lg shadow-red-500/20 ring-2 ring-red-500/10 group-hover:ring-red-500/30 transition-all duration-300"
                            />

                            {/* ✅ Online Status Indicator - Green Dot (Bottom Right) */}
                            {isUserOnline && (
                                <span
                                    className="absolute bottom-0 right-0 flex h-4 w-4"
                                    title="Online Now"
                                >
                                    {/* Pulsing animation ring */}
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    {/* Solid green dot with border */}
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-zinc-900"></span>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h2 className="text-gray-900 dark:text-white font-bold text-base">
                                        {senior.name}
                                    </h2>
                                    {senior.isVerified && (
                                        <svg
                                            className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            title="Verified User"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}

                                    {/* ✅ Online Badge - Shows next to name */}
                                    {isUserOnline && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold rounded-full">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            Online
                                        </span>
                                    )}
                                </div>

                                {/* ✅ Badge Display Logic - Priority: Mentor > Alumni > Role */}
                                {mentorBadge ? (
                                    <div className="mt-1.5">
                                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap items-center gap-1 shadow-sm ${mentorBadge.color} text-white`}>
                                            {mentorBadge.icon && <mentorBadge.icon className="w-3 h-3" />}
                                            {mentorBadge.name}
                                        </span>
                                    </div>
                                ) : isPassoutStudent ? (
                                    <div className="mt-1.5">
                                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap items-center gap-1 shadow-sm ${yearBadge.color} text-white`}>
                                            {yearBadge.icon && <yearBadge.icon className="w-3 h-3" />}
                                            {yearBadge.name}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{senior.role}</p>
                                )}

                                <div className="text-xs mt-2 space-y-1">
                                    <p className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        <span className="truncate">{senior.college}</span>
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-500 text-[11px] break-words">
                                        {senior.course && senior.course}
                                        {senior.branch && (senior.course?.toLowerCase().includes('btech') || senior.course?.toLowerCase().includes('mtech') || senior.course?.toLowerCase().includes('b.tech') || senior.course?.toLowerCase().includes('m.tech')) &&
                                            ` - ${senior.branch}`
                                        }
                                        {yearBadge && yearBadge.subtitle && ` • ${yearBadge.subtitle}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                {/* Empty space - badges now shown below name */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 pb-5 flex gap-3 mt-auto">
                    <button
                        onClick={handleViewProfile}
                        className="group/view relative flex-1 py-2.5 bg-transparent border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 cursor-pointer"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-500 dark:to-rose-400 transform scale-x-0 group-hover/view:scale-x-100 transition-transform duration-300 origin-left" />
                        <span className="relative flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            View Profile
                        </span>
                    </button>
                    <button
                        onClick={handleAskQuery}
                        className="group/connect relative flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 cursor-pointer"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/connect:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative flex items-center gap-2">
                            <svg
                                className="w-4 h-4 group-hover/connect:rotate-12 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            Ask Query
                        </span>
                    </button>
                </div>
            </div>

            {/* Ask Query Modal */}
            <AskQueryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                receiverData={receiverData}
                currentUserId={currentUserId}
                onQuerySent={() => {
         
                }}
            />
        </>
    );
};

export default SeniorCard;