import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import BadgeSystem from "../badges/page";

const { BADGE_DEFINITIONS, assignBadges } = BadgeSystem;

// Helper to extract year number from year string
const extractYearNumber = (year) => {
    if (!year) return null;
    if (typeof year === 'number') return year;

    // Check if it's "Passout" (case-insensitive) - return 5 for alumni badge
    if (String(year).toLowerCase() === 'passout') return 5;

    const match = String(year).match(/\d+/);
    return match ? parseInt(match[0]) : null;
};

export default function ProfileBadges({ profile }) {
    // FIXED: Prepare user activity data with correct property names AND badge flags
    const userActivity = {
        // Year handling
        year: profile.year?.toString().toLowerCase() === 'passout'
            ? 5
            : extractYearNumber(profile.year),

        // Badge flags from Strapi (CRITICAL - these were missing!)
        isMentor: profile.isMentor || false,
        superMentor: profile.superMentor || false,
        eliteMentor: profile.eliteMentor || false,
        activeParticipant: profile.activeParticipant || false,
        isVerified: profile.isVerified || false,

        // Stats (optional - for reference only)
        totalAnswersGiven: profile.answersGiven || profile.totalAnswersGiven || 0,
        bestAnswers: profile.helpfulCount || profile.bestAnswers || 0,
        totalQueries: profile.queriesAsked || profile.totalQueries || 0,
        helpfulVotes: profile.helpfulVotes || 0,
        engagement: profile.engagement || 0
    };

    // FIXED: Let assignBadges handle everything automatically
    let badges = assignBadges(userActivity);

    // Sort badges to ensure proper display order
    badges.sort((a, b) => {
        const priority = {
            // Year badges (highest priority)
            'fresher_1st_year': 1,
            'sophomore_2nd_year': 1,
            'senior_3rd_year': 1,
            'graduate_4th_year': 1,
            'alumni_passout': 1,

            // Verification badges
            'verified_user': 2,

            // Mentor badges (descending order of importance)
            'elite_mentor': 3,
            'super_mentor': 4,
            'mentor': 5,

            // Activity badges
            'active_participant': 6
        };

        return (priority[a.id] || 99) - (priority[b.id] || 99);
    });

    // If no badges, don't render the card
    if (badges.length === 0) return null;

    return (
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-primary/10">
                        <Award className="w-4 h-4 text-primary" />
                    </div>
                    Achievements
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-2">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;

                        return (
                            <div
                                key={`${badge.id}-${index}`}
                                className="group relative flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-border hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                {/* Subtle background glow effect */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${badge.color}`} />

                                {/* Badge icon */}
                                <div className={`relative w-10 h-10 rounded-lg ${badge.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                                    {Icon && <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />}
                                </div>

                                {/* Badge info */}
                                <div className="relative flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-foreground mb-0.5">
                                        {badge.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {badge.subtitle || badge.description}
                                    </div>
                                </div>

                                {/* Badge metadata */}
                                {badge.isYearBadge ? (
                                    <div className={`relative text-xs font-semibold flex-shrink-0 px-2 py-0.5 rounded-md ${badge.color} text-white shadow-sm`}>
                                        {badge.subtitle}
                                    </div>
                                ) : badge.earnedDate ? (
                                    <div className="relative text-xs font-medium text-muted-foreground/70 flex-shrink-0 px-2 py-0.5 rounded-md bg-muted/30">
                                        {badge.earnedDate}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}