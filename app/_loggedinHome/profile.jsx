import { useState, useEffect } from "react";
import ProfileHeader from "./_profileComp/ProfileHeader";
import ProfileStats from "./_profileComp/ProfileStats";
import ProfileAbout from "./_profileComp/ProfileAbout";
import ProfileEducation from "./_profileComp/ProfileEducation";
import ProfileBadges from "./_profileComp/ProfileBadges";
import ProfileSocialLinks from "./_profileComp/ProfileSocialLinks";
import EditProfileModal from "./_profileComp/EditProfileModal";
import VerificationModal from "./_profileComp/VerificationModal";
import RejectionModal from "./_profileComp/RejectionModal";
import { fetchFromStrapi } from '@/secure/strapi';

export default function CompleteProfilePage({ userData, onUpdate }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [liveStats, setLiveStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const [profile, setProfile] = useState({
        id: userData?.id || "",
        userId: userData?.id || "",
        fullName: userData?.name || "",
        username: userData?.username || "",
        verificationStatus: userData?.verificationStatus || null,
        verificationRejectionReason: userData?.verificationRejectionReason || null,
        bio: userData?.bio || "Hi there! I'm using Campus Connect.",
        avatarUrl: userData?.profileImageUrl || userData?.profilePic || '/logo_192.png',
        bannerUrl: userData?.bannerUrl || '/banner.jpeg',
        isVerified: userData?.isVerified ?? false,
        isMentor: userData?.isMentor ?? false,
        superMentor: userData?.superMentor ?? false,
        eliteMentor: userData?.eliteMentor ?? false,
        activeParticipant: userData?.activeParticipant ?? false,
        college: userData?.college || "",
        branch: userData?.branch || "",
        course: userData?.course || "",
        year: userData?.year || "1st Year",
        enrollmentYear: userData?.enrollmentYear || new Date().getFullYear(),
        graduationYear: userData?.graduationYear || new Date().getFullYear() + 4,
        skills: Array.isArray(userData?.interests) ? userData.interests : [],
        interests: Array.isArray(userData?.interests) ? userData.interests : [],
        linkedinUrl: userData?.linkedinUrl || "",
        githubUrl: userData?.githubUrl || "",
        portfolioUrl: userData?.portfolioUrl || "",
        twitterUrl: userData?.twitterUrl || "",
        leetcodeUrl: userData?.leetcodeUrl || "",
        instagramUrl: userData?.instagramUrl || "",
        queriesAsked: userData?.totalQueries ?? 0,
        answersGiven: userData?.bestAnswers ?? 0,
        helpfulCount: userData?.helpfulVotes ?? 0,
        totalViews: userData?.totalViews ?? 0,
        bestAnswers: userData?.bestAnswers ?? 0,
        responseRate: 0,
    });

    useEffect(() => {
        const fetchStatsFromDatabase = async () => {
            if (!userData?.documentId) {
                return;
            }

            try {
                setLoadingStats(true);

                const data = await fetchFromStrapi(`user-profiles/${userData.documentId}`);

                const dbStats = {
                    totalQueries: data.data?.totalQueries ?? 0,
                    bestAnswers: data.data?.bestAnswers ?? 0,
                    helpfulVotes: data.data?.helpfulVotes ?? 0,
                    totalViews: data.data?.totalViews ?? 0,
                };

                setLiveStats(dbStats);

                setProfile(prev => ({
                    ...prev,
                    queriesAsked: dbStats.totalQueries,
                    answersGiven: dbStats.bestAnswers,
                    bestAnswers: dbStats.bestAnswers,
                    helpfulCount: dbStats.helpfulVotes,
                    totalViews: dbStats.totalViews,
                }));
            } catch (error) {
                // Error handling without logging
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStatsFromDatabase();
    }, [userData?.documentId]);

    const isOwner = true;

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleAskDoubt = () => {
        alert("This would navigate to messaging or doubt submission!");
    };

    const handleOpenVerificationModal = () => {
        setIsVerificationModalOpen(true);
    };

    const handleOpenRejectionModal = () => {
        setIsRejectionModalOpen(true);
    };

    const handleVerificationSubmitted = () => {
        setProfile({
            ...profile,
            verificationStatus: 'pending'
        });
    };

    const handleProfileUpdated = async () => {
        if (onUpdate && typeof onUpdate === 'function') {
            await onUpdate();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden bg-muted">
                <img
                    src={profile.bannerUrl}
                    alt="Profile Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background" />
            </div>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 -mt-24 md:-mt-32 lg:-mt-40 pb-6 md:pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-4 xl:col-span-3">
                        <div className="lg:sticky lg:top-6 space-y-6">
                            <ProfileHeader
                                profile={profile}
                                isOwner={isOwner}
                                onEditProfile={handleEditProfile}
                                onAskDoubt={handleAskDoubt}
                                onOpenVerificationModal={handleOpenVerificationModal}
                                onOpenRejectionModal={handleOpenRejectionModal}
                                isSaving={isSaving}
                            />

                            <ProfileStats
                                profile={profile}
                                loading={loadingStats}
                            />
                        </div>
                    </aside>

                    <main className="lg:col-span-8 xl:col-span-9 space-y-6">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <ProfileAbout profile={profile} />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            <ProfileEducation profile={profile} />
                            <ProfileBadges profile={profile} />
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <ProfileSocialLinks profile={profile} />
                        </div>
                    </main>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                userData={userData}
                onProfileUpdated={handleProfileUpdated}
            />

            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                userData={userData}
                onVerificationSubmitted={handleVerificationSubmitted}
            />

            <RejectionModal
                isOpen={isRejectionModalOpen}
                onClose={() => setIsRejectionModalOpen(false)}
                rejectionReason={profile.verificationRejectionReason}
                onResubmit={() => setIsVerificationModalOpen(true)}
            />
        </div>
    );
}