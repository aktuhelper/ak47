import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    Star,
    Pencil,
    MessageCircle,
    MapPin,
    Calendar,
    GraduationCap,
    X,
} from "lucide-react";
import { getSeniorityBadge, getSeniorityGradient, formatBadgeText } from "./profileHelpers";
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

export default function ProfileHeader({
    profile,
    isOwner,
    onEditProfile,
    onAskDoubt,
    onOpenVerificationModal,
    onOpenRejectionModal,
    isSaving
}) {
    const seniorityBadge = getSeniorityBadge(profile.year, profile.course);

    // Get user's earned badges
    const userActivity = {
        // Handle both numeric years and 'Passout' string from Strapi
        // Convert 'passout' to year 5 for badge matching
        year: profile.year?.toString().toLowerCase() === 'passout'
            ? 5
            : extractYearNumber(profile.year),
        answeredQueries: profile.answersGiven || profile.answeredQueries || 0,
        helpfulAnswers: profile.helpfulCount || profile.helpfulAnswers || 0,
        views: profile.totalViews || profile.views || 0,
        queriesPosted: profile.queriesAsked || profile.queriesPosted || 0,
        engagement: profile.engagement || 0,
        verified: profile.isVerified || false
    };

    let badges = assignBadges(userActivity);

    // Remove verified user badge (shown as checkmark next to name instead)
    badges = badges.filter(b => b && b.id !== 'verified_user');

    // Handle mentor badges - show only highest achieved (SIMPLIFIED LOGIC FROM FIRST CODE)
    if (profile.isMentor === true || profile.isMentor === 1) {
        // Remove any existing mentor badges to avoid duplicates
        badges = badges.filter(b =>
            b && b.id !== 'mentor' && b.id !== 'super_mentor' && b.id !== 'elite_mentor'
        );

        // Add only the highest mentor badge based on profile data
        if (profile.eliteMentor === true) {
            badges.push(BADGE_DEFINITIONS.achievementBadges.eliteMentor);
        } else if (profile.superMentor === true) {
            badges.push(BADGE_DEFINITIONS.achievementBadges.superMentor);
        } else {
            badges.push(BADGE_DEFINITIONS.achievementBadges.mentor);
        }
    }

    // Handle active participant badge
    if (profile.activeParticipant === true) {
        const hasActiveParticipantBadge = badges.some(b => b && b.id === 'active_participant');
        if (!hasActiveParticipantBadge) {
            badges.push(BADGE_DEFINITIONS.activityBadges.activeParticipant);
        }
    }

    // Sort badges
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

    return (
        <Card className="overflow-hidden">
            {/* Banner */}
            <div
                className="w-full bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black"
                style={{
                    backgroundImage: profile.bannerUrl ? `url(${profile.bannerUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            <CardContent className="pt-0 pb-6">
                {/* Avatar */}
                <div className="flex justify-center -mt-12 mb-4">
                    <div className="relative">
                        <Avatar className="w-24 h-24 ring-4 ring-background border-2 border-primary/20">
                            <AvatarImage
                                src={profile.avatarUrl || undefined}
                                alt={profile.fullName || "Profile"}
                            />
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-chart-3">
                                {profile.fullName
                                    ? profile.fullName.split(' ')
                                        .map(n => n[0])
                                        .join('')
                                        .slice(0, 2)
                                        .toUpperCase()
                                    : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        {/* Verified badge on avatar */}
                        {profile.isVerified === true && (
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0A66C2] rounded-full flex items-center justify-center ring-4 ring-background shadow-lg">
                                <CheckCircle2 className="w-5 h-5 text-white fill-[#0A66C2] stroke-white stroke-[2.5]" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Name and Verification */}
                <div className="text-center space-y-2 mb-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-xl font-bold">{profile.fullName || 'User'}</h2>

                            {/* Verified tick badge next to name */}
                            {profile.isVerified === true && (
                                <div className="relative">
                                    <CheckCircle2 className="w-5 h-5 text-foreground fill-background stroke-foreground stroke-[2.5]" />
                                </div>
                            )}
                        </div>

                        {/* Verification Status */}
                        {profile.isVerified !== true && profile.verificationStatus === 'pending' && (
                            <Badge
                                variant="outline"
                                className="h-7 px-3 text-xs gap-1.5 bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Verification Pending
                            </Badge>
                        )}

                        {profile.isVerified !== true && profile.verificationStatus === 'rejected' && (
                            <Button
                                onClick={onOpenRejectionModal}
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-xs gap-1.5 cursor-pointer bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 font-semibold"
                            >
                                <X className="w-3.5 h-3.5" />
                                Verification Rejected
                            </Button>
                        )}

                        {profile.isVerified !== true && profile.verificationStatus !== 'pending' && profile.verificationStatus !== 'rejected' && (
                            <Button
                                onClick={onOpenVerificationModal}
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-xs gap-1.5 cursor-pointer text-blue-500 font-bold hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Get Verified
                            </Button>
                        )}
                    </div>

                    {/* Username */}
                    {profile.username && (
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    )}

                    {/* Badge Icons - New Section */}
                    {badges.length > 0 && (
                        <div className="flex justify-center items-center gap-2 flex-wrap mt-3">
                            {badges.slice(0, 6).map((badge, index) => {
                                const Icon = badge.icon;
                                return (
                                    <div
                                        key={`${badge.id}-${index}`}
                                        className={`relative w-9 h-9 rounded-lg ${badge.color} flex items-center justify-center shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 cursor-pointer group`}
                                        title={`${badge.name} - ${badge.subtitle}`}
                                    >
                                        {Icon && <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />}

                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                            <div className="font-bold">{badge.name}</div>
                                            <div className="text-gray-300 text-xs">{badge.subtitle}</div>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                <div className="border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {badges.length > 6 && (
                                <div className="text-xs text-muted-foreground font-medium">
                                    +{badges.length - 6}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Badges */}
                   
                </div>

                {/* Bio */}
                {profile.bio && (
                    <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">
                        {profile.bio}
                    </p>
                )}

                {/* Quick Info */}
                <div className="space-y-2 mb-4 text-sm">
                    {profile.college && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <GraduationCap className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{profile.college}</span>
                        </div>
                    )}
                    {profile.branch && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{profile.branch}</span>
                        </div>
                    )}
                    {profile.graduationYear && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>
                                {profile.year?.toString().toLowerCase() === 'passout'
                                    ? `Graduated ${profile.graduationYear}`
                                    : `Graduating ${profile.graduationYear}`
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    {isOwner && (
                        <Button
                            onClick={onEditProfile}
                            variant="outline"
                            className="w-full gap-2"
                            disabled={isSaving}
                        >
                            <Pencil className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    )}

                    {!isOwner && (profile.isMentor === 1 || profile.isMentor === true) && (
                        <Button
                            onClick={onAskDoubt}
                            className="w-full gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Ask a Doubt
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}