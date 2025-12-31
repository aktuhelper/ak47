import React, { useState, useEffect } from 'react';
import PageHeader from '../_loggedinHome/_homepage/PageHeader';
import StudentsSection from '../_loggedinHome/_homepage/StudentsSection';
import AskQueryModal from './AskQueryModal';
import QueryCardFull from './querycard';
import NextBadgeModal from '../_loggedinHome/_homepage/NextBadgeModal';
import { useSocket } from '@/app/contexts/SocketContext';
import { useFetchPublicQueries } from './_homepage/useFetchPublicQueriesHook';
import { fetchFromStrapi } from '@/secure/strapi';
import { Users, MessageSquare } from 'lucide-react';

export default function HomePagee({ userData }) {
    // Early validation
    if (!userData) {
        return <div className="p-8 text-center text-red-600">Error: User data not available</div>;
    }

    const [activeTab, setActiveTab] = useState('queries');
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [sameCollegeSeniors, setSameCollegeSeniors] = useState([]);
    const [sameCollegeJuniors, setSameCollegeJuniors] = useState([]);
    const [otherCollegeSeniors, setOtherCollegeSeniors] = useState([]);
    const [otherCollegeJuniors, setOtherCollegeJuniors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState(null);

    // Next Badge Modal state
    const [showNextBadgeModal, setShowNextBadgeModal] = useState(false);
    const [nextBadgeData, setNextBadgeData] = useState(null);

    // ✅ Use the custom hook for queries with infinite scrolling (pass userData for visibility filtering)
    const {
        publicQueries,
        loading: queriesLoading,
        error: queriesError,
        hasMore,
        page,
        totalPages,
        fetchQueries,
        loadMore,
        incrementViewCount,
        refreshQueries,
        lastQueryRef
    } = useFetchPublicQueries(userData);

    // ✅ Get Socket.IO online users
    const { onlineUsers, isConnected } = useSocket();

    const userName = userData?.name || "Guest";
    const userCollege = userData?.college || "Your College";
    const userCourse = userData?.course || "Your Course";
    const userBranch = userData?.branch || "Your Branch";
    const year = userData?.year || "1st Year";
    const currentUserId = userData?.documentId || userData?.id;

    // Badge-related data
    const badgeData = {
        answeredQueries: userData?.answeredQueries || 0,
        helpfulAnswers: userData?.helpfulAnswers || 0,
        views: userData?.views || userData?.totalViews || 0,
        queriesPosted: userData?.queriesPosted || userData?.queriesAsked || 0,
        engagement: userData?.engagement || 0,
        isVerified: userData?.isVerified || false,
        isMentor: userData?.isMentor || false,
        superMentor: userData?.superMentor || false,
        eliteMentor: userData?.eliteMentor || false,
        activeParticipant: userData?.activeParticipant || false
    };

    // Helper function to check if course has no branches
    const shouldShowBranch = (course, branch) => {
        if (!course || !branch) return false;

        const noBranchCourses = ['mca', 'bca', 'bpharma', 'mba'];
        const courseLower = course.toLowerCase();

        // Show branch for BTech and MTech, hide for others
        if (courseLower.includes('btech') || courseLower.includes('mtech') ||
            courseLower.includes('b.tech') || courseLower.includes('m.tech')) {
            return true;
        }

        // Hide branch for courses in the noBranchCourses list
        return !noBranchCourses.some(noBranchCourse => courseLower.includes(noBranchCourse));
    };

    // Helper function to get display text (course + branch or just course)
    const getDisplayText = (course, branch) => {
        if (shouldShowBranch(course, branch)) {
            return `${course} • ${branch}`;
        }
        return course || 'Your Course';
    };

    // Helper function to extract year number from year string - Updated for Passout
    const extractYearNumber = (yearString) => {
        if (!yearString) return 1;

        // Handle "Pass-out" and "Passout" variants
        const yearLower = yearString.toLowerCase();
        if (yearLower === 'pass-out' || yearLower === 'passout') {
            return 5; // Alumni/Passout = year 5
        }

        const match = yearString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    };

    // Helper function to convert year number to badge format - Updated for Passout
    const getYearBadge = (yearString) => {
        const yearNum = extractYearNumber(yearString);
        const badges = {
            1: '1st-year',
            2: '2nd-year',
            3: '3rd-year',
            4: '4th-year',
            5: 'alumni' // Passout students get alumni badge
        };
        return badges[yearNum] || '1st-year';
    };

    // Helper function to format user data
    const formatUserData = (user) => {
        // Get profile image URL (already absolute from API proxy)
        let profileImageUrl = null;

        if (user.profileImageUrl) {
            profileImageUrl = user.profileImageUrl;
        } else if (user.profilePic) {
            profileImageUrl = user.profilePic;
        } else if (user.profileImage) {
            const profileImage = Array.isArray(user.profileImage)
                ? user.profileImage[0]
                : user.profileImage;

            if (profileImage?.url) {
                profileImageUrl = profileImage.url;
            }
        }

        const formattedUser = {
            id: user.id,
            documentId: user.documentId || user.id,
            name: user.name || 'Anonymous',
            username: user.username || user.name || 'Anonymous',
            role: user.isMentor ? 'Mentor' : 'Student',
            college: user.college || '',
            course: user.course || '',
            branch: user.branch || '',
            email: user.email || '',
            isMentor: user.isMentor || false,
            superMentor: user.superMentor || false,
            eliteMentor: user.eliteMentor || false,
            isVerified: user.isVerified || false,
            year: user.year, // Keep original year string
            yearBadge: getYearBadge(user.year),
            avatar: profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.id}`,
            skills: user.interests || [],
            isActive: false,
            answeredQueries: user.answeredQueries || 0,
            helpfulAnswers: user.helpfulAnswers || 0,
            views: user.views || user.totalViews || 0,
            queriesPosted: user.queriesPosted || user.queriesAsked || 0,
            engagement: user.engagement || 0
        };

        return formattedUser;
    };

    // ✅ Helper function to update online status
    const updateOnlineStatus = (users) => {
        return users.map(user => {
            const isOnline = onlineUsers.some(
                onlineUserId =>
                    onlineUserId === user.documentId ||
                    onlineUserId === user.id ||
                    onlineUserId === String(user.documentId) ||
                    onlineUserId === String(user.id)
            );

            return {
                ...user,
                isActive: isOnline
            };
        });
    };

    // 🔒 Fetch students data using secure API - Updated to handle Passout as seniors
    useEffect(() => {
        const fetchStudents = async () => {
            if (!userData || !userData.college || !userData.year) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const currentYearNum = extractYearNumber(userData.year);

                // 🔒 Use secure API wrapper
                const data = await fetchFromStrapi('user-profiles?populate=*&pagination[limit]=100');

                const allUsers = data.data || [];

                const sameCollege = [];
                const otherCollege = [];

                allUsers.forEach(user => {
                    if (user.id === currentUserId || user.documentId === currentUserId) return;

                    const formattedUser = formatUserData(user);
                    const userYearNum = extractYearNumber(user.year);
                    const isSameCollege = user.college === userData.college;

                    if (isSameCollege) {
                        sameCollege.push({ ...formattedUser, yearNum: userYearNum });
                    } else {
                        otherCollege.push({ ...formattedUser, yearNum: userYearNum });
                    }
                });

                // ✅ Seniors: Anyone with yearNum > currentYearNum (includes Passout students with yearNum = 5)
                setSameCollegeSeniors(
                    sameCollege
                        .filter(u => u.yearNum > currentYearNum)
                        .map(({ yearNum, ...user }) => user)
                        .slice(0, 6)
                );

                // ✅ Juniors: Anyone with yearNum < currentYearNum
                setSameCollegeJuniors(
                    sameCollege
                        .filter(u => u.yearNum < currentYearNum)
                        .map(({ yearNum, ...user }) => user)
                        .slice(0, 6)
                );

                setOtherCollegeSeniors(
                    otherCollege
                        .filter(u => u.yearNum > currentYearNum)
                        .map(({ yearNum, ...user }) => user)
                        .slice(0, 6)
                );

                setOtherCollegeJuniors(
                    otherCollege
                        .filter(u => u.yearNum < currentYearNum)
                        .map(({ yearNum, ...user }) => user)
                        .slice(0, 6)
                );

            } catch (error) {
                // Error silently handled
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [userData, currentUserId]);

    // ✅ Update online status when onlineUsers changes
    useEffect(() => {
        if (sameCollegeSeniors.length > 0) {
            setSameCollegeSeniors(prev => updateOnlineStatus(prev));
        }
        if (sameCollegeJuniors.length > 0) {
            setSameCollegeJuniors(prev => updateOnlineStatus(prev));
        }
        if (otherCollegeSeniors.length > 0) {
            setOtherCollegeSeniors(prev => updateOnlineStatus(prev));
        }
        if (otherCollegeJuniors.length > 0) {
            setOtherCollegeJuniors(prev => updateOnlineStatus(prev));
        }
    }, [onlineUsers]);

    // ✅ Fetch public queries when queries tab is active
    useEffect(() => {
        if (activeTab === 'queries') {
            fetchQueries();
        }
    }, [activeTab, fetchQueries]);

    // ✅ Handle query click (increment view count)
    const handleQueryClick = async (queryDocumentId) => {
        await incrementViewCount(queryDocumentId, currentUserId);
    };

    // Handle badge click
    const handleBadgeClick = (badge) => {
        setSelectedBadge(badge);
        setTimeout(() => {
            setSelectedBadge(null);
        }, 3000);
    };

    // Handle next badge click
    const handleNextBadgeClick = (nextBadge) => {
        setNextBadgeData(nextBadge);
        setShowNextBadgeModal(true);
    };

    // Modal handlers
    const handleAskQuery = (receiver) => {
        setSelectedReceiver(receiver);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReceiver(null);
    };

    const handleQuerySent = () => {
        if (activeTab === 'queries') {
            refreshQueries();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pb-10 lg:pb-0 bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-10 lg:pb-0 bg-gray-50 dark:bg-black">

            <PageHeader
                userName={userName}
                userCollege={userCollege}
                userCourse={userCourse}
                userBranch={userBranch}
                year={year}
                badgeData={badgeData}
                onBadgeClick={handleBadgeClick}
                onNextBadgeClick={handleNextBadgeClick}
                userData={userData}
            />
            {/* Tabs Navigation - Wrapper for sticky behavior */}
            <div className="sticky top-0 z-40">
                <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex gap-1">
                            {/* All Queries Tab - First */}
                            <button
                                onClick={() => setActiveTab('queries')}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === 'queries'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span>All Queries</span>
                                {activeTab === 'queries' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
                                )}
                            </button>

                            {/* Connect Tab - Second */}
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === 'users'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Users className="w-5 h-5" />
                                <span>Connect</span>
                                {activeTab === 'users' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {activeTab === 'queries' ? (
                    // All Queries Content
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All Queries</h2>
                                <p className="text-gray-600 dark:text-gray-400">View and interact with all public queries from the community</p>
                            </div>
                            {totalPages > 0 && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Page {page} of {totalPages}
                                </div>
                            )}
                        </div>

                        {queriesLoading && publicQueries.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Loading queries...</p>
                            </div>
                        ) : queriesError ? (
                            <div className="text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                <MessageSquare className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error loading queries</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{queriesError}</p>
                                <button
                                    onClick={refreshQueries}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : publicQueries.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
                                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No queries yet</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to post a query to the community</p>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                                >
                                    Connect with Users
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {publicQueries.map((query, index) => {
                                    // ⭐ Attach ref to last element for infinite scroll
                                    const isLastElement = index === publicQueries.length - 1;

                                    return (
                                        <div
                                            key={query.documentId || query.id}
                                            ref={isLastElement ? lastQueryRef : null}
                                        >
                                            <QueryCardFull
                                                query={query}
                                                userData={userData}
                                                onAnswerAdded={refreshQueries}
                                                onStatsChange={refreshQueries}
                                                onQueryClick={() => handleQueryClick(query.documentId)}
                                            />
                                        </div>
                                    );
                                })}

                                {/* ⭐ Loading indicator */}
                                {queriesLoading && hasMore && (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Loading more queries...</p>
                                    </div>
                                )}

                                {/* ⭐ End of list indicator */}
                                {!hasMore && publicQueries.length > 0 && (
                                    <div className="text-center py-8 border-t border-gray-200 dark:border-zinc-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                                            <span>🎉</span>
                                            You've seen all {publicQueries.length} queries
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    // Connect Content
                    <div className="space-y-16">
                        <StudentsSection
                            title="Your College Seniors"
                            description={`Connect with seniors from ${userCollege} • ${getDisplayText(userCourse, userBranch)}`}
                            viewAllLink="/seniormycollege"
                            students={sameCollegeSeniors}
                            currentUserId={currentUserId}
                            onAskQuery={handleAskQuery}
                            emptyMessage="No seniors found in your college"
                        />

                        <StudentsSection
                            title="Your College Juniors"
                            description={`Guide and mentor juniors from ${userCollege} • ${getDisplayText(userCourse, userBranch)}`}
                            viewAllLink="/juniormycollege"
                            students={sameCollegeJuniors}
                            currentUserId={currentUserId}
                            onAskQuery={handleAskQuery}
                            emptyMessage="No juniors found in your college"
                        />

                        <StudentsSection
                            title="Seniors from Other Colleges"
                            description={`Expand your network • ${getDisplayText(userCourse, userBranch)} students across India`}
                            viewAllLink="/seniorfromothercollege"
                            students={otherCollegeSeniors}
                            currentUserId={currentUserId}
                            onAskQuery={handleAskQuery}
                            emptyMessage="No seniors found from other colleges"
                        />

                        <StudentsSection
                            title="Juniors from Other Colleges"
                            description={`Share your knowledge • ${getDisplayText(userCourse, userBranch)} students across India`}
                            viewAllLink="/juniorothercollege"
                            students={otherCollegeJuniors}
                            currentUserId={currentUserId}
                            onAskQuery={handleAskQuery}
                            emptyMessage="No juniors found from other colleges"
                        />
                    </div>
                )}
            </div>

            {/* Ask Query Modal */}
            <AskQueryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                receiverData={selectedReceiver}
                currentUserId={currentUserId}
                onQuerySent={handleQuerySent}
            />

            {/* Next Badge Modal */}
            <NextBadgeModal
                isOpen={showNextBadgeModal}
                onClose={() => setShowNextBadgeModal(false)}
                nextBadge={nextBadgeData}
            />
        </div>
    );
}