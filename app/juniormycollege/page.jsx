"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import FiltersContainer from './_comp/FiltersContainer ';
import SectionHeader from './_comp/SectionHeader';
import LoadingSpinner from './_comp/LoadingSpinner';
import ErrorMessage from './_comp/ErrorMessage';
import EmptyState from './_comp/EmptyState';
import JuniorsGrid from './_comp/JuniorsGrid';
import useJuniorsFetch from './_comp/useJuniorsFetch';
import { useSocket } from '@/app/contexts/SocketContext';
import { fetchFromStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper

const COURSES = ["B.Tech", "M.Tech", "BCA", "MCA", "MBA"];
const BRANCHES = ["CSE", "ECE", "Mechanical", "IT", "Civil"];

export default function JuniorsPage() {
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
               

                // ✅ Use secure wrapper
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
                console.error('❌ Error fetching current user:', error);
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
                setSelectedBranch(strapiUser.branch || "CSE");
            } else {
                setSelectedBranch("");
            }
        }
    }, [strapiUser]);

    // Use custom hook for fetching juniors
    const {
        juniors: rawJuniors,
        isLoading,
        page,
        hasMore,
        totalCount,
        error,
        loadMoreRef,
        resetPagination,
        fetchJuniors
    } = useJuniorsFetch({
        strapiUser,
        selectedCourse,
        selectedBranch,
        selectedYear,
        userTypeFilter,
        searchQuery
    });

    // ✅ Apply client-side filtering with Socket.IO online status
    const filteredJuniors = useMemo(() => {
        // Always update online status from Socket.IO for all juniors
        const juniorsWithOnlineStatus = rawJuniors.map(junior => ({
            ...junior,
            isActive: onlineUsers.includes(junior.documentId || junior.id)
        }));

        // Apply active filter - only show currently online users
        if (userTypeFilter === "active") {
            const activeUsers = juniorsWithOnlineStatus.filter(junior => junior.isActive);
           
            return activeUsers;
        }

        // Apply mentor filter only when userTypeFilter is "mentors"
        if (userTypeFilter === "mentors") {
            // Only show users who have at least one mentor badge
            const mentors = juniorsWithOnlineStatus.filter(junior =>
                junior.isMentor === true ||
                junior.superMentor === true ||
                junior.eliteMentor === true
            );
          

            // Sort mentors by priority: eliteMentor > superMentor > isMentor
            // Then by answeredQueries and helpfulAnswers
            return mentors.sort((a, b) => {
                // Priority sorting
                if (a.eliteMentor && !b.eliteMentor) return -1;
                if (!a.eliteMentor && b.eliteMentor) return 1;
                if (a.superMentor && !b.superMentor) return -1;
                if (!a.superMentor && b.superMentor) return 1;

                // Secondary sorting by performance
                if (b.answeredQueries !== a.answeredQueries) {
                    return b.answeredQueries - a.answeredQueries;
                }
                return b.helpfulAnswers - a.helpfulAnswers;
            });
        }

        // For "all" filter, return all juniors with updated online status
        return juniorsWithOnlineStatus;
    }, [rawJuniors, onlineUsers, userTypeFilter]);

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
        if (!strapiUser?.year) return "Connect with students from your college";

        const subtitleMap = {
            "4th Year": "Connect with 1st, 2nd & 3rd year students from your college",
            "3rd Year": "Connect with 1st & 2nd year students from your college",
            "2nd Year": "Connect with 1st year students from your college"
        };

        return subtitleMap[strapiUser.year] || "Connect with students from your college";
    };

    // Show loading if auth is still loading
    if (authLoading) {
        return <LoadingSpinner fullPage />;
    }

    // Show message if user is 1st year (has no juniors)
    if (strapiUser?.year === "1st Year") {
        return <EmptyState type="first-year" />;
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
                        <span>Your Juniors</span>
                    </div>
                }
                pageSubtitle={getPageSubtitle()}
                college={strapiUser?.college}
                userTypeFilter={userTypeFilter}
                onUserTypeChange={handleUserTypeChange}
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
                        totalCount={filteredJuniors.length}
                        selectedCourse={selectedCourse}
                        selectedBranch={selectedBranch}
                        selectedYear={selectedYear}
                    />

                    {/* Error State */}
                    <ErrorMessage error={error} onRetry={() => fetchJuniors(1)} />

                    {/* ✅ Juniors Grid - With online status from Socket.IO */}
                    <JuniorsGrid
                        juniors={filteredJuniors}
                        currentUserId={strapiUser?.documentId || strapiUser?.id}
                        onlineUsers={onlineUsers}
                        isSocketConnected={isConnected}
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
                    {hasMore && !isLoading && filteredJuniors.length > 0 && (
                        <div ref={loadMoreRef} className="h-20" />
                    )}

                    {/* End of List */}
                    {!hasMore && !isLoading && filteredJuniors.length > 0 && (
                        <EmptyState type="end-of-list" />
                    )}

                    {/* No Results */}
                    {!isLoading && filteredJuniors.length === 0 && !error && (
                        <EmptyState type="no-results" />
                    )}
                </section>
            </div>
        </div>
    );
}