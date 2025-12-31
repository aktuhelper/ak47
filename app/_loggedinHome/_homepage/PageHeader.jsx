import React from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { BADGE_DEFINITIONS, assignBadges } from "../badges/page";
import { extractYearNumber } from "../_profileComp/profileHelpers";

const PageHeader = ({ userData, userName = "Student", userCollege = "Sample College", userCourse = "BTech", userBranch = "CSE", year = "1st Year", badgeData = {}, onBadgeClick, onNextBadgeClick }) => {
    let yearNumber = extractYearNumber(year);
    const isPassout = year && (
        year.toString().toLowerCase().includes('passout') ||
        year.toString().toLowerCase().includes('pass out') ||
        year.toString().toLowerCase().includes('alumni')
    );

    if (isPassout) {
        yearNumber = 5;
    }

    const userActivity = {
        year: yearNumber,
        isMentor: badgeData?.isMentor || false,
        superMentor: badgeData?.superMentor || false,
        eliteMentor: badgeData?.eliteMentor || false,
        activeParticipant: badgeData?.activeParticipant || false,
        isVerified: badgeData?.isVerified || false,
        totalAnswersGiven: badgeData?.totalAnswersGiven || 0,
        bestAnswers: badgeData?.bestAnswers || 0,
        totalQueries: badgeData?.totalQueries || 0,
        helpfulVotes: badgeData?.helpfulVotes || 0,
        totalViews: badgeData?.totalViews || 0
    };

    let badges = assignBadges(userActivity);

    badges.sort((a, b) => {
        const priority = {
            'fresher_1st_year': 1,
            'sophomore_2nd_year': 1,
            'senior_3rd_year': 1,
            'graduate_4th_year': 1,
            'alumni_passout': 1,
            'verified_user': 2,
            'elite_mentor': 3,
            'super_mentor': 4,
            'mentor': 5,
            'active_participant': 6
        };
        return (priority[a.id] || 99) - (priority[b.id] || 99);
    });

    // Function to get next achievable badge
    const getNextBadge = () => {
        const stats = {
            totalAnswersGiven: userData?.totalAnswersGiven || 0,
            bestAnswers: userData?.bestAnswers || 0,
            helpfulVotes: userData?.helpfulVotes || 0,
            totalViews: userData?.totalViews || 0,
            totalQueries: userData?.totalQueries || 0
        };

        // Check for next mentor badge
        if (!userData?.isMentor) {
            const requirements = {
                totalAnswersGiven: Math.max(0, 10 - stats.totalAnswersGiven),
                helpfulVotes: Math.max(0, 5 - stats.helpfulVotes),
                totalViews: Math.max(0, 50 - stats.totalViews)
            };
            return {
                badge: BADGE_DEFINITIONS.achievementBadges.mentor,
                requirements,
                progress: {
                    totalAnswersGiven: { current: stats.totalAnswersGiven, needed: 10 },
                    helpfulVotes: { current: stats.helpfulVotes, needed: 5 },
                    totalViews: { current: stats.totalViews, needed: 50 }
                }
            };
        } else if (userData?.isMentor && !userData?.superMentor) {
            const requirements = {
                totalAnswersGiven: Math.max(0, 50 - stats.totalAnswersGiven),
                bestAnswers: Math.max(0, 25 - stats.bestAnswers),
                helpfulVotes: Math.max(0, 50 - stats.helpfulVotes),
                totalViews: Math.max(0, 500 - stats.totalViews)
            };
            return {
                badge: BADGE_DEFINITIONS.achievementBadges.superMentor,
                requirements,
                progress: {
                    totalAnswersGiven: { current: stats.totalAnswersGiven, needed: 50 },
                    bestAnswers: { current: stats.bestAnswers, needed: 25 },
                    helpfulVotes: { current: stats.helpfulVotes, needed: 50 },
                    totalViews: { current: stats.totalViews, needed: 500 }
                }
            };
        } else if (userData?.superMentor && !userData?.eliteMentor) {
            const requirements = {
                totalAnswersGiven: Math.max(0, 100 - stats.totalAnswersGiven),
                bestAnswers: Math.max(0, 50 - stats.bestAnswers),
                helpfulVotes: Math.max(0, 100 - stats.helpfulVotes),
                totalViews: Math.max(0, 1000 - stats.totalViews)
            };
            return {
                badge: BADGE_DEFINITIONS.achievementBadges.eliteMentor,
                requirements,
                progress: {
                    totalAnswersGiven: { current: stats.totalAnswersGiven, needed: 100 },
                    bestAnswers: { current: stats.bestAnswers, needed: 50 },
                    helpfulVotes: { current: stats.helpfulVotes, needed: 100 },
                    totalViews: { current: stats.totalViews, needed: 1000 }
                }
            };
        }

        // Check for active participant badge
        if (!userData?.activeParticipant) {
            const requirements = {
                totalQueries: Math.max(0, 20 - stats.totalQueries),
                helpfulVotes: Math.max(0, 50 - stats.helpfulVotes)
            };
            return {
                badge: BADGE_DEFINITIONS.activityBadges.activeParticipant,
                requirements,
                progress: {
                    totalQueries: { current: stats.totalQueries, needed: 20 },
                    helpfulVotes: { current: stats.helpfulVotes, needed: 50 }
                }
            };
        }

        return null;
    };

    const nextBadge = getNextBadge();

    const shouldShowBranch = (course, branch) => {
        if (!course || !branch) return false;
        const noBranchCourses = ['mca', 'bca', 'bpharma', 'mba'];
        const courseLower = course.toLowerCase();

        if (courseLower.includes('btech') || courseLower.includes('mtech') ||
            courseLower.includes('b.tech') || courseLower.includes('m.tech')) {
            return true;
        }

        return !noBranchCourses.some(noBranchCourse => courseLower.includes(noBranchCourse));
    };

    const showBranch = shouldShowBranch(userCourse, userBranch);

    return (
        <div className="relative bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-black dark:via-zinc-950 dark:to-neutral-950 border-b border-white/20 dark:border-zinc-800/50 overflow-hidden backdrop-blur-3xl">
            <div className="relative max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse drop-shadow-lg" />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                                Hey <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{userName}</span>!
                            </h1>
                        </div>
                        <p className="text-xl text-gray-800 dark:text-gray-100 max-w-3xl leading-relaxed">
                            Ready to <span className="font-bold text-blue-600 dark:text-blue-400">connect</span>, <span className="font-bold text-purple-600 dark:text-purple-400">learn</span>, and <span className="font-bold text-cyan-600 dark:text-cyan-400">grow</span> with your <span className="font-black tracking-wider" style={{ fontFamily: "'Fredoka One', 'Righteous', 'Rubik Mono One', cursive", letterSpacing: "0.05em" }}><span className="text-[#2663EB] dark:text-blue-400">campus</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-600 dark:from-blue-400 dark:via-cyan-400 dark:to-sky-500">connect</span></span> by <span className="font-bold text-gray-900 dark:text-white">AktuHelper</span>
                        </p>

                        {/* User Info Pills */}
                        <div className="flex flex-wrap gap-4 mt-6">
                            <div className="px-4 py-2 bg-white/40 dark:bg-zinc-900/60 backdrop-blur-xl rounded-full border border-white/50 dark:border-zinc-700/50 shadow-lg">
                                <span className="text-sm text-gray-700 dark:text-gray-400">College: </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{userCollege}</span>
                            </div>

                            {userCourse && (
                                <div className="px-4 py-2 bg-white/40 dark:bg-zinc-900/60 backdrop-blur-xl rounded-full border border-white/50 dark:border-zinc-700/50 shadow-lg">
                                    <span className="text-sm text-gray-700 dark:text-gray-400">
                                        {showBranch ? 'Branch: ' : 'Course: '}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        {showBranch ? userBranch : userCourse}
                                    </span>
                                </div>
                            )}

                            <div className="px-4 py-2 bg-white/40 dark:bg-zinc-900/60 backdrop-blur-xl rounded-full border border-white/50 dark:border-zinc-700/50 shadow-lg">
                                <span className="text-sm text-gray-700 dark:text-gray-400">Year: </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{year}</span>
                            </div>
                        </div>

                        {/* Achievements Section */}
                        {(badges.length > 0 || nextBadge) && (
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-50/80 via-blue-50/40 to-transparent dark:from-zinc-950/80 dark:via-zinc-950/40 dark:to-transparent z-10 pointer-events-none"></div>
                                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50/80 via-blue-50/40 to-transparent dark:from-zinc-950/80 dark:via-zinc-950/40 dark:to-transparent z-10 pointer-events-none"></div>

                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {/* Earned Badges */}
                                        {badges.map((badge, index) => {
                                            const Icon = badge.icon;

                                            return (
                                                <div
                                                    key={`${badge.id}-${index}`}
                                                    className="group relative flex-shrink-0"
                                                    onClick={() => onBadgeClick && onBadgeClick(badge)}
                                                >
                                                    <div className="relative flex items-center gap-3 px-4 py-3 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl border border-white/60 dark:border-zinc-800/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer min-w-[200px]">
                                                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-lg ${badge.color} flex items-center justify-center shadow-md`}>
                                                            {Icon && <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />}
                                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{badge.name}</h4>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">{badge.subtitle}</p>
                                                        </div>

                                                        <div className={`absolute inset-0 rounded-xl ${badge.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>
                                                    </div>

                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-56 bg-gray-900 dark:bg-zinc-800 text-white rounded-lg p-3 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            {Icon && <Icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />}
                                                            <div className="text-xs font-bold text-amber-400">{badge.name}</div>
                                                        </div>
                                                        <div className="text-xs text-gray-300 leading-relaxed">{badge.description}</div>

                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-zinc-800"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Next Badge (Locked) */}
                                        {nextBadge && (
                                            <div
                                                className="relative flex-shrink-0 cursor-pointer"
                                                onClick={() => onNextBadgeClick && onNextBadgeClick(nextBadge)}
                                            >
                                                <div className="relative flex items-center gap-3 px-4 py-3 bg-gray-100/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] opacity-75 hover:opacity-100">
                                                    <div className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center shadow-md">
                                                        <Lock className="w-6 h-6 text-white" strokeWidth={2.5} />
                                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent"></div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight flex items-center gap-1.5">
                                                            {nextBadge.badge.name}
                                                            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">Next</span>
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">Click to view progress</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent"></div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3">
                                        {badges.length === 0 && nextBadge
                                            ? `Start your journey! Unlock your first badge`
                                            : badges.length === 1
                                                ? "Great start! Keep engaging to unlock more achievements"
                                                : nextBadge
                                                    ? `Outstanding! You've unlocked ${badges.length} achievements. Keep going!`
                                                    : `Amazing! You've unlocked ${badges.length} achievements`}
                                    </p>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default PageHeader;