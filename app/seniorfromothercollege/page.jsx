"use client";
import React, { useState, useEffect } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import FiltersContainer from '../seniormycollege/_comp/FiltersContainer';
import SectionHeader from '../seniormycollege/_comp/SectionHeade';
import LoadingSpinner from '../juniormycollege/_comp/LoadingSpinner';
import ErrorMessage from '../juniormycollege/_comp/ErrorMessage';
import EmptyState from '../juniormycollege/_comp/EmptyState';
import JuniorsGrid from '../juniormycollege/_comp/JuniorsGrid';
import useSeniorsFromOtherCollegesFetch from './_comp/useSeniorsFromOtherCollegesFetchHook';
import { useSocket } from '@/app/contexts/SocketContext';
import { fetchFromStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper

const COURSES = ["B.Tech", "M.Tech", "BCA", "MCA", "MBA"];
const BRANCHES = ["CSE", "ECE", "Mechanical", "IT", "Civil"];

export default function SeniorsFromOtherCollegesPage() {
    const { user, isLoading: authLoading } = useKindeBrowserClient();
    const router = useRouter();
    const { onlineUsers, isConnected } = useSocket();
    const [strapiUser, setStrapiUser] = useState(null);

    // Filters State
    const [userTypeFilter, setUserTypeFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedYear, setSelectedYear] = useState("All");

    // Get available years based on current user's year
    const getAvailableYears = () => {
        if (!strapiUser?.year) return ["All"];
        const yearMap = {
            "1st Year": [],
            "2nd Year": ["All", "1st Year"],
            "3rd Year": ["All", "1st Year", "2nd Year"],
            "4th Year": ["All", "1st Year", "2nd Year", "3rd Year"],
            "Pass-out": ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"],
            "Passout": ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"]
        };
        return yearMap[strapiUser.year] || ["All"];
    };

    const YEARS = getAvailableYears();

    // Check if branch filter should be shown
    const shouldShowBranchFilter = selectedCourse === "B.Tech" || selectedCourse === "M.Tech";

    // Fetch current user's Strapi profile
    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!user?.email) return;

            try {
                // ✅ Use secure wrapper instead of direct fetch
                const result = await fetchFromStrapi(
                    `user-profiles?filters[email][$eq]=${encodeURIComponent(user.email)}&populate=*`
                );

                if (result.data && result.data.length > 0) {
                    const userRecord = result.data[0];
                    const userData = userRecord.attributes || userRecord;

                    setStrapiUser({
                        id: userRecord.id,
                        documentId: userRecord.documentId || userRecord.id,
                        ...userData
                    });
                }
            } catch (error) {
                // Error handling without logging
            }
        };

        if (user && !authLoading) {
            fetchCurrentUser();
        }
    }, [user, authLoading]);

    // Initialize filters based on current user's data
    useEffect(() => {
        if (strapiUser) {
            setSelectedCourse(strapiUser.course || "B.Tech");

            if (strapiUser.course === "B.Tech" || strapiUser.course === "M.Tech") {
                setSelectedBranch("");
            } else {
                setSelectedBranch("");
            }
        }
    }, [strapiUser]);

    // Use custom hook for fetching seniors from other colleges
    const {
        seniors: fetchedSeniors,
        isLoading,
        page,
        hasMore,
        totalCount,
        error,
        loadMoreRef,
        resetPagination,
        fetchSeniors
    } = useSeniorsFromOtherCollegesFetch({
        strapiUser,
        selectedCourse,
        selectedBranch,
        selectedYear,
        userTypeFilter,
        searchQuery
    });

    // Sync Socket.IO online status with fetched seniors
    const [seniorsWithStatus, setSeniorsWithStatus] = useState([]);

    useEffect(() => {
        if (!fetchedSeniors || fetchedSeniors.length === 0) {
            setSeniorsWithStatus([]);
            return;
        }

        // Update isActive based on Socket.IO onlineUsers
        const updatedSeniors = fetchedSeniors.map(senior => {
            const isOnline = onlineUsers.some(
                onlineUserId =>
                    onlineUserId === senior.documentId ||
                    onlineUserId === senior.id ||
                    onlineUserId === String(senior.documentId) ||
                    onlineUserId === String(senior.id)
            );

            return {
                ...senior,
                isActive: isOnline
            };
        });

        setSeniorsWithStatus(updatedSeniors);

    }, [fetchedSeniors, onlineUsers]);

    // Apply filters and sorting on the merged data
    const displayedSeniors = React.useMemo(() => {
        let filtered = seniorsWithStatus;

        // Apply active filter
        if (userTypeFilter === "active") {
            filtered = filtered.filter(senior => senior.isActive);
        }

        // Filter and sort mentors by badge tier
        if (userTypeFilter === "mentors") {
            filtered = filtered.filter(senior =>
                senior.isMentor === true ||
                senior.superMentor === true ||
                senior.eliteMentor === true
            );

            // Sort by mentor tier: Elite → Super → Regular
            filtered = [...filtered].sort((a, b) => {
                const getTier = (senior) => {
                    if (senior.eliteMentor) return 3;
                    if (senior.superMentor) return 2;
                    if (senior.isMentor) return 1;
                    return 0;
                };

                const tierDiff = getTier(b) - getTier(a);
                if (tierDiff !== 0) return tierDiff;

                if (b.answeredQueries !== a.answeredQueries) {
                    return b.answeredQueries - a.answeredQueries;
                }
                if (b.helpfulAnswers !== a.helpfulAnswers) {
                    return b.helpfulAnswers - a.helpfulAnswers;
                }
                return b.engagement - a.engagement;
            });
        }

        return filtered;
    }, [seniorsWithStatus, userTypeFilter]);

    // Handlers
    const handleUserTypeChange = (type) => {
        setUserTypeFilter(type);
        resetPagination();
    };

    const handleCourseChange = (course) => {
        setSelectedCourse(course);

        if (course === "B.Tech" || course === "M.Tech") {
            if (strapiUser?.course === course && strapiUser?.branch) {
                setSelectedBranch(strapiUser.branch);
            } else {
                setSelectedBranch("CSE");
            }
        } else {
            setSelectedBranch("");
        }

        resetPagination();
    };

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        resetPagination();
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        resetPagination();
    };

    // Get page subtitle based on user's year
    const getPageSubtitle = () => {
        if (!strapiUser?.year) return "Connect with students from other colleges";

        const subtitleMap = {
            "1st Year": "Connect with 2nd, 3rd & 4th year students and pass-outs from other colleges",
            "2nd Year": "Connect with 3rd & 4th year students and pass-outs from other colleges",
            "3rd Year": "Connect with 4th year students and pass-outs from other colleges",
            "4th Year": "Connect with pass-outs from other colleges"
        };

        return subtitleMap[strapiUser.year] || "Connect with students from other colleges";
    };

    // Show loading if auth is still loading
    if (authLoading) {
        return <LoadingSpinner fullPage />;
    }

    // Show message if user is Pass-out (has no seniors)
    if (strapiUser?.year === "Pass-out") {
        return (
            <div className="min-h-screen bg-theme-primary flex items-center justify-center">
                <EmptyState type="pass-out" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-theme-primary transition-colors duration-300">
            {/* Header & Filters Container */}
            <FiltersContainer
                pageTitle={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                            title="Go Back"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </button>
                        <span>Seniors from Other Colleges</span>
                    </div>
                }
                pageSubtitle={getPageSubtitle()}
                college="Exploring other colleges"
                userTypeFilter={userTypeFilter}
                onUserTypeChange={handleUserTypeChange}
                isSeniorPage={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                courses={COURSES}
                selectedCourse={selectedCourse}
                onCourseChange={handleCourseChange}
                branches={BRANCHES}
                selectedBranch={selectedBranch}
                onBranchChange={handleBranchChange}
                showBranchFilter={shouldShowBranchFilter}
                years={YEARS}
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section>
                    {/* Section Header */}
                    <SectionHeader
                        userTypeFilter={userTypeFilter}
                        totalCount={userTypeFilter === "active" ? displayedSeniors.length : totalCount}
                        selectedCourse={selectedCourse}
                        selectedBranch={selectedBranch}
                        selectedYear={selectedYear}
                        isSeniorPage={true}
                    />

                    {/* Error State */}
                    <ErrorMessage error={error} onRetry={() => fetchSeniors(1)} />

                    {/* Seniors Grid - with online status */}
                    <JuniorsGrid
                        juniors={displayedSeniors}
                        currentUserId={strapiUser?.documentId || strapiUser?.id}
                        onlineUsers={onlineUsers}
                        isSocketConnected={isConnected}
                        isSeniorPage={true}
                    />

                    {/* Loading State - Initial */}
                    {isLoading && page === 1 && <LoadingSpinner size="large" />}

                    {/* Loading State - Infinite Scroll */}
                    {isLoading && page > 1 && (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="small" />
                        </div>
                    )}

                    {/* Infinite Scroll Trigger */}
                    {hasMore && !isLoading && displayedSeniors.length > 0 && (
                        <div ref={loadMoreRef} className="h-20" />
                    )}

                    {/* End of List */}
                    {!hasMore && !isLoading && displayedSeniors.length > 0 && (
                        <EmptyState type="end-of-list" />
                    )}

                    {/* No Results */}
                    {!isLoading && displayedSeniors.length === 0 && !error && (
                        <EmptyState type="no-results" isSeniorPage={true} />
                    )}
                </section>
            </div>
        </div>
    );
}