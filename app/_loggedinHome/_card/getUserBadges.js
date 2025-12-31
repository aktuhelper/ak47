import { assignBadges } from '../badges/page';

export const getUserBadges = (user) => {
    if (!user) return [];

    // Extract year number from various formats
    let yearNumber = 1;
    if (user.year) {
        if (typeof user.year === 'number') {
            // If it's already a number (1, 2, 3, 4, 5)
            yearNumber = user.year;
        } else if (typeof user.year === 'string') {
            // Check if it's "Passout" (case-insensitive) - return 5 for alumni badge
            if (user.year.toLowerCase() === 'passout') {
                yearNumber = 5;
            } else {
                // If it's a string like "4th Year" or "4"
                const match = user.year.match(/(\d+)/);
                if (match) {
                    yearNumber = parseInt(match[1]);
                }
            }
        }
    }

    // Convert user object to activity format for assignBadges function
    const userActivity = {
        year: yearNumber,
        answeredQueries: user.answeredQueries || 0,
        helpfulAnswers: user.helpfulAnswers || 0,
        views: user.views || 0,
        queriesPosted: user.queriesPosted || 0,
        engagement: user.engagement || 0,
        verified: user.isVerified || false,
        // Add support for direct boolean flags from your API
        isMentor: user.isMentor || false,
        superMentor: user.superMentor || false,
        eliteMentor: user.eliteMentor || false,
        activeParticipant: user.activeParticipant || false
    };

    const allBadges = assignBadges(userActivity);

    // Filter out verified badge (shown separately as checkmark icon)
    let filteredBadges = allBadges.filter(badge => badge.id !== 'verified_user');

    // Mentor badge hierarchy (highest to lowest priority)
    const mentorBadgeHierarchy = ['elite_mentor', 'super_mentor', 'mentor'];

    // Find all mentor badges
    const mentorBadges = filteredBadges.filter(badge =>
        mentorBadgeHierarchy.includes(badge.id)
    );

    if (mentorBadges.length > 0) {
        // Keep only the highest priority mentor badge
        const highestMentorBadge = mentorBadges.reduce((highest, current) => {
            const currentIndex = mentorBadgeHierarchy.indexOf(current.id);
            const highestIndex = mentorBadgeHierarchy.indexOf(highest.id);
            return currentIndex < highestIndex ? current : highest;
        });

        // Remove all mentor badges and add back only the highest one
        filteredBadges = filteredBadges.filter(badge =>
            !mentorBadgeHierarchy.includes(badge.id)
        );
        filteredBadges.push(highestMentorBadge);
    }

    return filteredBadges;
};