import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, ShieldCheck, Gem, Award, Sprout, TrendingUp, Flame, Crown } from 'lucide-react';
import { fetchFromStrapi, updateStrapi } from '@/secure/strapi';

// Custom badge component for year badges with icons
const YearBadgeWithIcon = ({ badge, size = 'md', showTooltip = true }) => {
    const [showInfo, setShowInfo] = useState(false);

    const sizes = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const Icon = badge.icon;

    return (
        <div className="relative inline-block">
            <div
                className={`${sizes[size]} ${badge.color} rounded-full flex items-center justify-center cursor-pointer border-2 ${badge.borderColor} shadow-lg ${badge.glowColor || ''} hover:scale-110 transition-transform`}
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
            >
                <Icon className="w-1/2 h-1/2 text-white drop-shadow-lg" strokeWidth={2.5} />
            </div>

            {showTooltip && showInfo && (
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                    <div className="font-bold">{badge.name}</div>
                    <div className="text-gray-300 text-xs">{badge.subtitle}</div>
                    <div className="mt-1 text-gray-400">{badge.description}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Badge definitions with categories, criteria, and styling
export const BADGE_DEFINITIONS = {
    // Year-based badges
    yearBadges: {
        fresher: {
            id: 'fresher_1st_year',
            name: 'Fresher',
            subtitle: '1st Year',
            description: 'Fresher',
            isYearBadge: true,
            icon: Sprout,
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            textColor: 'text-green-600',
            borderColor: 'border-green-500',
            glowColor: 'shadow-green-500/50',
            criteria: { year: 1 }
        },
        sophomore: {
            id: 'sophomore_2nd_year',
            name: 'Sophomore',
            subtitle: '2nd Year',
            description: 'senior 2nd Year',
            isYearBadge: true,
            icon: TrendingUp,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-500',
            glowColor: 'shadow-blue-500/50',
            criteria: { year: 2 }
        },
        senior: {
            id: 'senior_3rd_year',
            name: 'Senior',
            subtitle: '3rd Year',
            description: 'senior 3rd Year',
            isYearBadge: true,
            icon: Flame,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            textColor: 'text-purple-600',
            borderColor: 'border-purple-500',
            glowColor: 'shadow-purple-500/50',
            criteria: { year: 3 }
        },
        graduate: {
            id: 'graduate_4th_year',
            name: 'Graduate',
            subtitle: '4th Year',
            description: 'senior 4th Year',
            isYearBadge: true,
            icon: Crown,
            color: 'bg-gradient-to-br from-amber-500 to-amber-600',
            textColor: 'text-amber-600',
            borderColor: 'border-amber-500',
            glowColor: 'shadow-amber-500/50',
            criteria: { year: 4 }
        },
        alumni: {
            id: 'alumni_passout',
            name: 'Alumni',
            subtitle: 'Passed Out',
            description: 'Distinguished graduate and valued member of the alumni community',
            isYearBadge: true,
            icon: Crown,
            color: 'bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900',
            textColor: 'text-purple-900',
            borderColor: 'border-purple-900',
            glowColor: 'shadow-purple-900/50',
            criteria: { year: 5 }
        }
    },

    // Achievement badges
    achievementBadges: {
        mentor: {
            id: 'mentor',
            name: 'Mentor',
            subtitle: 'Helping Others',
            description: '10+ answers, 5+ helpful votes, and 50+ views.',
            icon: Shield,
            color: 'bg-gradient-to-br from-teal-500 to-teal-600',
            textColor: 'text-teal-600',
            borderColor: 'border-teal-500',
            glowColor: 'shadow-teal-500/50',
            criteria: { totalAnswersGiven: 10, helpfulVotes: 5, views: 50 }
        },
        superMentor: {
            id: 'super_mentor',
            name: 'Super Mentor',
            subtitle: 'Community Leader',
            description: '50+ answers, 25+ best answers, 50+ helpful votes, and 500+ views.',
            icon: ShieldCheck,
            color: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600',
            textColor: 'text-indigo-600',
            borderColor: 'border-indigo-500',
            glowColor: 'shadow-indigo-500/50',
            criteria: { totalAnswersGiven: 50, bestAnswers: 25, helpfulVotes: 50, views: 500 }
        },
        eliteMentor: {
            id: 'elite_mentor',
            name: 'Elite Mentor',
            subtitle: 'Top Contributor',
            description: '100+ answers, 50+ best answers, 100+ helpful votes, and 1000+ views.',
            icon: Gem,
            color: 'bg-gradient-to-br from-rose-600 via-red-600 to-pink-700',
            textColor: 'text-rose-700',
            borderColor: 'border-rose-600',
            glowColor: 'shadow-rose-600/50',
            criteria: { totalAnswersGiven: 100, bestAnswers: 50, helpfulVotes: 100, views: 1000 }
        }
    },

    // Activity badges
    activityBadges: {
        activeParticipant: {
            id: 'active_participant',
            name: 'Active Participant',
            subtitle: 'Engaged Member',
            description: 'Posted 20+ queries and actively engaged.',
            icon: Award,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600',
            borderColor: 'border-indigo-500',
            criteria: { queriesPosted: 20, engagement: 50 }
        }
    },

    // Verification badges
    verificationBadges: {
        verifiedUser: {
            id: 'verified_user',
            name: 'Verified User',
            subtitle: 'Authenticated',
            description: 'Identity verified through institutional email or official documentation.',
            icon: CheckCircle,
            color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-500',
            glowColor: 'shadow-blue-500/50',
            criteria: { verified: true }
        }
    }
};

/**
 * Calculate and update badge flags in Strapi based on userData
 * @param {Object} userData - User data object containing stats
 */
export const calculateAndUpdateBadges = async (userData) => {
    try {
        if (!userData?.documentId) {
            throw new Error('Invalid user data provided');
        }


        // Get stats directly from userData
        const stats = {
            totalQueries: userData.totalQueries || 0,
            totalAnswersGiven: userData.totalAnswersGiven || 0,
            bestAnswers: userData.bestAnswers || 0,
            helpfulVotes: userData.helpfulVotes || 0,
            views: userData.totalViews || 0
        };



        // Determine badge flags based on NEW criteria
        const badgeFlags = {
            // Mentor: 10+ answers, 5+ helpful votes, 50+ views
            isMentor: stats.totalAnswersGiven >= 10 && stats.helpfulVotes >= 5 && stats.views >= 50,

            // Super Mentor: 50+ answers, 25+ best answers, 50+ helpful votes, 500+ views
            superMentor: stats.totalAnswersGiven >= 50 && stats.bestAnswers >= 25 && stats.helpfulVotes >= 50 && stats.views >= 500,

            // Elite Mentor: 100+ answers, 50+ best answers, 100+ helpful votes, 1000+ views
            eliteMentor: stats.totalAnswersGiven >= 100 && stats.bestAnswers >= 50 && stats.helpfulVotes >= 100 && stats.views >= 1000,

            // Active Participant: unchanged
            activeParticipant: stats.totalQueries >= 20 && stats.helpfulVotes >= 50
        };

        // Only set highest mentor badge to true
        if (badgeFlags.eliteMentor) {
            badgeFlags.superMentor = false;
            badgeFlags.isMentor = false;
        } else if (badgeFlags.superMentor) {
            badgeFlags.isMentor = false;
        }

   

        // Update Strapi with badge flags
        await updateStrapi(`user-profiles/${userData.documentId}`, badgeFlags);


        return badgeFlags;
    } catch (error) {
        console.error('❌ Error calculating badges:', error);
        throw error;
    }
};

// Badge assignment logic - uses flags from userData
export const assignBadges = (userActivity) => {
    const earnedBadges = [];

    // Check year badge
    const yearBadge = Object.values(BADGE_DEFINITIONS.yearBadges).find(
        badge => badge.criteria.year === userActivity.year
    );
    if (yearBadge) earnedBadges.push(yearBadge);

    // Handle mentor badges with priority - only add the highest one based on flags
    if (userActivity.eliteMentor === true) {
        earnedBadges.push(BADGE_DEFINITIONS.achievementBadges.eliteMentor);
    } else if (userActivity.superMentor === true) {
        earnedBadges.push(BADGE_DEFINITIONS.achievementBadges.superMentor);
    } else if (userActivity.isMentor === true) {
        earnedBadges.push(BADGE_DEFINITIONS.achievementBadges.mentor);
    }

    // Check activity badges
    if (userActivity.activeParticipant === true) {
        earnedBadges.push(BADGE_DEFINITIONS.activityBadges.activeParticipant);
    }

    // Check verification badges
    if (userActivity.isVerified === true) {
        earnedBadges.push(BADGE_DEFINITIONS.verificationBadges.verifiedUser);
    }

    return earnedBadges;
};

// Badge Component - Display individual badge
export const Badge = ({ badge, size = 'md', showTooltip = true }) => {
    // Use icon badge for year badges
    if (badge.isYearBadge) {
        return <YearBadgeWithIcon badge={badge} size={size} showTooltip={showTooltip} />;
    }

    const [showInfo, setShowInfo] = useState(false);

    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base'
    };

    const Icon = badge.icon;

    return (
        <div className="relative inline-block">
            <div
                className={`${sizes[size]} ${badge.color} rounded-full flex items-center justify-center cursor-pointer border-2 ${badge.borderColor} shadow-lg ${badge.glowColor || ''} hover:scale-110 transition-transform`}
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
            >
                {badge.customIcon ? (
                    <Icon />
                ) : (
                    <Icon className="w-1/2 h-1/2 text-white drop-shadow-lg" strokeWidth={2.5} />
                )}
            </div>

            {showTooltip && showInfo && (
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                    <div className="font-bold">{badge.name}</div>
                    <div className="text-gray-300 text-xs">{badge.subtitle}</div>
                    <div className="mt-1 text-gray-400">{badge.description}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

// BadgeList Component - Display multiple badges
export const BadgeList = ({ badges, size = 'md', maxDisplay = 5 }) => {
    const displayBadges = badges.slice(0, maxDisplay);
    const remainingCount = badges.length - maxDisplay;

    return (
        <div className="flex items-center gap-2">
            {displayBadges.map((badge, index) => (
                <Badge key={badge.id} badge={badge} size={size} />
            ))}
            {remainingCount > 0 && (
                <div className="text-sm text-gray-500 font-medium">
                    +{remainingCount} more
                </div>
            )}
        </div>
    );
};

// UserBadgeCard Component - Display user with badges
export const UserBadgeCard = ({ user }) => {
    const userBadges = assignBadges(user.activity);
    const primaryBadge = userBadges[0];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <img
                    src={user.avatar || '/api/placeholder/48/48'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        {primaryBadge && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${primaryBadge.color} text-white`}>
                                {primaryBadge.subtitle}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{user.info}</p>
                    <div className="mt-2">
                        <BadgeList badges={userBadges} size="sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default {
    BADGE_DEFINITIONS,
    assignBadges,
    calculateAndUpdateBadges,
    Badge,
    BadgeList,
    UserBadgeCard
};