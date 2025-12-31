"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    CheckCircle2,
    MessageCircle,
    MapPin,
    Calendar,
    GraduationCap,
    Award,
    Sparkles,
    Link2,
    Linkedin,
    Github,
    Globe,
    Twitter,
    Code2,
    Instagram
} from "lucide-react";
import { BADGE_DEFINITIONS, assignBadges } from "@/app/_loggedinHome/badges/page";
import AskQueryModal from "@/app/_loggedinHome/AskQueryModal";

import { fetchFromStrapi } from "@/secure/strapi";

const combinedColors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-pink-500 to-pink-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-red-500 to-red-600',
    'bg-gradient-to-r from-teal-500 to-teal-600',
    'bg-gradient-to-r from-cyan-500 to-cyan-600',
];

const extractYearNumber = (yearString) => {
    if (!yearString) return 1;

    // Handle "Passout" or "Pass out" or similar variations
    if (yearString.toLowerCase().includes('pass')) {
        return 5; // Return 5 for alumni badge
    }

    const match = yearString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
};

const getYearSuffix = (year) => {
    if (year === 5) return 'Passout';
    const suffixes = ['1st', '2nd', '3rd', '4th', '5th'];
    return suffixes[year - 1] || `${year}th`;
};

export default function ProfilePage() {
    const params = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // Get current user's documentId from localStorage
                const currentUserDocId = localStorage.getItem('userDocumentId'); // or 'userId' - adjust based on what you store

                if (currentUserDocId) {
                    setCurrentUserId(currentUserDocId);
                }
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        };

        fetchCurrentUser();
    }, []);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);

                // Use strapi.js wrapper instead of direct fetch
                const result = await fetchFromStrapi(`user-profiles/${params.id}?populate=*`);

                const rawData = result.data;

                if (!rawData) {
                    throw new Error('User not found');
                }

                // Format user data (rest of the code remains the same)
                let profileImageUrl = null;
                if (rawData.profileImageUrl) {
                    profileImageUrl = rawData.profileImageUrl;
                } else if (rawData.profilePic) {
                    profileImageUrl = rawData.profilePic;
                } else if (rawData.profileImage?.url) {
                    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
                    profileImageUrl = rawData.profileImage.url.startsWith('http')
                        ? rawData.profileImage.url
                        : `${STRAPI_URL}${rawData.profileImage.url}`;
                }

                let bannerUrl = null;
                if (rawData.bannerUrl) {
                    bannerUrl = rawData.bannerUrl;
                } else if (rawData.bannerImage?.url) {
                    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
                    bannerUrl = rawData.bannerImage.url.startsWith('http')
                        ? rawData.bannerImage.url
                        : `${STRAPI_URL}${rawData.bannerImage.url}`;
                }

                const formattedUser = {
                    id: rawData.id,
                    documentId: rawData.documentId || rawData.id,
                    name: rawData.name || 'Anonymous',
                    username: rawData.username || rawData.name || 'Anonymous',
                    email: rawData.email || '',
                    college: rawData.college || '',
                    course: rawData.course || '',
                    branch: rawData.branch || '',
                    year: rawData.year || '',
                    enrollmentYear: rawData.enrollmentYear || new Date().getFullYear(),
                    graduationYear: rawData.graduationYear || '',
                    bio: rawData.bio || '',
                    skills: rawData.skills || [],
                    interests: rawData.interests || [],
                    isMentor: rawData.isMentor || false,
                    superMentor: rawData.superMentor || false,
                    eliteMentor: rawData.eliteMentor || false,
                    isVerified: rawData.isVerified || false,
                   
                    activeParticipant: rawData.activeParticipant || false,
                    profileImageUrl: profileImageUrl,
                    profilePic: profileImageUrl || '/logo_192.png',
                    avatar: profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${rawData.id}`,
                    bannerUrl: bannerUrl,
                    answersGiven: rawData.answersGiven || rawData.answeredQueries || rawData.totalAnswersGiven || 0,
                    helpfulCount: rawData.helpfulCount || rawData.helpfulAnswers || rawData.helpfulVotes || 0,
                    totalViews: rawData.totalViews || rawData.views || 0,
                    queriesAsked: rawData.queriesAsked || rawData.queriesPosted || rawData.totalQueries || 0,
                    bestAnswers: rawData.bestAnswers || 0,
                    linkedinUrl: rawData.linkedinUrl || '',
                    githubUrl: rawData.githubUrl || '',
                    portfolioUrl: rawData.portfolioUrl || '',
                    twitterUrl: rawData.twitterUrl || '',
                    leetcodeUrl: rawData.leetcodeUrl || '',
                    instagramUrl: rawData.instagramUrl || '',
                    currentUserId: rawData.documentId || null,
                };
                setUserData(formattedUser);
                setError(null);
            } catch (err) {
                console.error('Error loading user:', err);
                setError(err.message || 'Failed to load user profile');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchUserProfile();
        }
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error || 'User not found'}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Get user's earned badges
    const userActivity = {
        year: extractYearNumber(userData.year),
        answeredQueries: userData.answersGiven || 0,
        helpfulAnswers: userData.helpfulCount || 0,
        views: userData.totalViews || 0,
        queriesPosted: userData.queriesAsked || 0,
        engagement: 0,
        verified: userData.isVerified || false
    };

    let badges = assignBadges(userActivity);

    // Remove verified user badge (shown as checkmark instead)
    badges = badges.filter(b => b && b.id !== 'verified_user');

    // Handle mentor badges - show only highest achieved
    if (userData.isMentor === true) {
        badges = badges.filter(b =>
            b && b.id !== 'mentor' && b.id !== 'super_mentor' && b.id !== 'elite_mentor'
        );

        if (userData.eliteMentor === true) {
            badges.push(BADGE_DEFINITIONS.achievementBadges.eliteMentor);
        } else if (userData.superMentor === true) {
            badges.push(BADGE_DEFINITIONS.achievementBadges.superMentor);
        } else {
            badges.push(BADGE_DEFINITIONS.achievementBadges.mentor);
        }
    }

    if (userData.activeParticipant === true) {
        const hasActiveParticipantBadge = badges.some(b => b && b.id === 'active_participant');
        if (!hasActiveParticipantBadge) {
            badges.push(BADGE_DEFINITIONS.activityBadges.activeParticipant);
        }
    }

    // Sort badges
    badges.sort((a, b) => {
        const priority = {
            'fresher_1st_year': 1, 'sophomore_2nd_year': 1, 'senior_3rd_year': 1, 'graduate_4th_year': 1,
            'verified_user': 2, 'elite_mentor': 3, 'super_mentor': 4, 'mentor': 5, 'active_participant': 6
        };
        return (priority[a.id] || 99) - (priority[b.id] || 99);
    });

    // Social links
    const socialLinks = [
        { name: "LinkedIn", icon: Linkedin, url: userData.linkedinUrl, color: "text-[#0A66C2]", bgColor: "bg-[#0A66C2]/10", hoverBg: "hover:bg-[#0A66C2]/20" },
        { name: "GitHub", icon: Github, url: userData.githubUrl, color: "text-foreground", bgColor: "bg-gray-100", hoverBg: "hover:bg-gray-200" },
        { name: "Portfolio", icon: Globe, url: userData.portfolioUrl, color: "text-purple-500", bgColor: "bg-purple-500/10", hoverBg: "hover:bg-purple-500/20" },
        { name: "Twitter", icon: Twitter, url: userData.twitterUrl, color: "text-[#1DA1F2]", bgColor: "bg-[#1DA1F2]/10", hoverBg: "hover:bg-[#1DA1F2]/20" },
        { name: "LeetCode", icon: Code2, url: userData.leetcodeUrl, color: "text-orange-500", bgColor: "bg-orange-500/10", hoverBg: "hover:bg-orange-500/20" },
        { name: "Instagram", icon: Instagram, url: userData.instagramUrl, color: "text-pink-500", bgColor: "bg-pink-500/10", hoverBg: "hover:bg-pink-500/20" },
    ].filter(link => link.url && link.url.trim() !== '');

    const allSkillsInterests = [...new Set([...(userData.skills || []), ...(userData.interests || [])])];

    const handleAskDoubt = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleQuerySent = () => {
        console.log('Query sent successfully!');
        // You can add additional actions here, like showing a success message
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Full Width Banner Image Section */}
            <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden bg-gray-200">
                <img
                    src={userData.bannerUrl || "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop"}
                    alt="Profile Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/80" />
            </div>

            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Main Content Container */}
            <div className="relative max-w-7xl mx-auto px-4 -mt-24 md:-mt-32 lg:-mt-40 pb-6 md:pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Profile Card */}
                    <aside className="lg:col-span-4 xl:col-span-3">
                        <div className="lg:sticky lg:top-6 space-y-6">
                            {/* Profile Header Card */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="w-full h-20 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black" />

                                <div className="pt-0 pb-6 px-6">
                                    {/* Avatar */}
                                    <div className="flex justify-center -mt-12 mb-4">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full ring-4 ring-white border-2 border-blue-200 overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500">
                                                <img
                                                    src={userData.profileImageUrl || userData.avatar}
                                                    alt={userData.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {userData.isVerified && (
                                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0A66C2] rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                                                    <CheckCircle2 className="w-5 h-5 text-white fill-[#0A66C2] stroke-white stroke-[2.5]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name and Verification */}
                                    <div className="text-center space-y-2 mb-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
                                                {userData.isVerified && (
                                                    <CheckCircle2 className="w-5 h-5 text-gray-900 fill-white stroke-gray-900 stroke-[2.5]" />
                                                )}
                                            </div>
                                        </div>

                                        {userData.username && (
                                            <p className="text-sm text-gray-500">@{userData.username}</p>
                                        )}

                                        {/* Badge Icons */}
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
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                                <div className="font-bold">{badge.name}</div>
                                                                <div className="text-gray-300 text-xs">{badge.subtitle}</div>
                                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                                    <div className="border-4 border-transparent border-t-gray-900"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {badges.length > 6 && (
                                                    <div className="text-xs text-gray-500 font-medium">+{badges.length - 6}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    {userData.bio && (
                                        <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
                                            {userData.bio}
                                        </p>
                                    )}

                                    {/* Quick Info */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        {userData.college && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{userData.college}</span>
                                            </div>
                                        )}
                                        {userData.branch && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{userData.branch}</span>
                                            </div>
                                        )}
                                        {userData.graduationYear && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span>Graduating {userData.graduationYear}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button - Available for Everyone */}
                                    <button
                                        onClick={handleAskDoubt}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Ask a Query
                                    </button>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {userData.queriesAsked || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Queries</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {userData.answersGiven || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Answers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {userData.helpfulCount || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Helpful</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {(userData.totalViews || 0).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">Views</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-8 xl:col-span-9 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">About</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {userData.bio && (
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-300 rounded-full" />
                                        <p className="text-base text-gray-700 leading-relaxed pl-4">{userData.bio}</p>
                                    </div>
                                )}

                                {allSkillsInterests.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-blue-100">
                                                <Sparkles className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <h4 className="text-sm font-semibold text-gray-900">Skills & Interests</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {allSkillsInterests.map((item, index) => (
                                                <span
                                                    key={`${item}-${index}`}
                                                    className={`${combinedColors[index % combinedColors.length]} text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Two Column Layout - Education & Achievements */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Education Card */}
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <GraduationCap className="w-4 h-4" />
                                        Education
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-gray-500">College</span>
                                            <span className="font-medium text-right text-gray-900">{userData.college || "Not specified"}</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-gray-500">Branch</span>
                                            <span className="font-medium text-right text-gray-900">{userData.branch || "Not specified"}</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-gray-500">Course</span>
                                            <span className="font-medium text-right text-gray-900">{userData.course || "Not specified"}</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-gray-500">Year</span>
                                            <span className="font-medium text-right text-gray-900">
                                                {userData.year ? `${getYearSuffix(extractYearNumber(userData.year))} Year` : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-gray-500">Graduation</span>
                                            <span className="font-medium text-right text-gray-900">{userData.graduationYear || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Achievements Card */}
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <div className="p-1 rounded-lg bg-blue-100">
                                            <Award className="w-4 h-4 text-blue-600" />
                                        </div>
                                        Achievements
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2">
                                        {badges.map((badge, index) => {
                                            const Icon = badge.icon;
                                            return (
                                                <div
                                                    key={`${badge.id}-${index}`}
                                                    className="group relative flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                                                >
                                                    <div className={`relative w-10 h-10 rounded-lg ${badge.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                                                        {Icon && <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />}
                                                    </div>
                                                    <div className="relative flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-gray-900 mb-0.5">{badge.name}</div>
                                                        <div className="text-xs text-gray-500">{badge.subtitle || badge.description}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <Link2 className="w-4 h-4" />
                                        Connect
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                        {socialLinks.map((link) => (
                                            <button
                                                key={link.name}
                                                onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                                                className={`group flex flex-col items-center gap-2 p-3 rounded-lg ${link.bgColor} ${link.hoverBg} transition-all hover:scale-105`}
                                            >
                                                <link.icon className={`w-6 h-6 ${link.color}`} />
                                                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                                    {link.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            
            <AskQueryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                receiverData={userData}
                currentUserId={currentUserId}
                onQuerySent={handleQuerySent}
            />
        </div>
    );
}