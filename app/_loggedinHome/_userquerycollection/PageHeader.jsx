"use client";
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import StatsCard from './StatsCard';
import RefreshButton from './RefreshButton';
import { fetchFromStrapi, updateStrapi } from '@/secure/strapi';
// ✅ Import badge calculator

export default function PageHeader({
    userData,
    onRefresh,
    refreshing,
    statsRefreshTrigger
}) {
    const [stats, setStats] = useState({
        totalQueries: 0,
        bestAnswers: 0,
        helpfulVotes: 0,
        totalViews: 0,
        responseRate: 0,
        totalAnswersGiven: 0, // ✅ Added for badge calculation
        loading: true
    });

    const fetchLiveStats = async () => {
        if (!userData?.documentId) return;

        try {
       

            // ============================================
            // 1. Fetch all PUBLIC queries posted by this user
            // ============================================
            const queriesData = await fetchFromStrapi(
                `queries?filters[user_profile][documentId]=${userData.documentId}&populate=*`
            );
            const queries = queriesData.data || [];

            // ============================================
            // 2. Fetch all PERSONAL queries (sent by this user)
            // ============================================
            const personalQueriesData = await fetchFromStrapi(
                `personal-queries?filters[fromUser][documentId]=${userData.documentId}&populate=*`
            );
            const personalQueries = personalQueriesData.data || [];

     

            // ============================================
            // 3. Calculate TOTAL queries (public + personal)
            // ============================================
            const totalQueries = queries.length + personalQueries.length;

            // ============================================
            // 4. Calculate query-related stats for PUBLIC queries
            // ============================================
            let answeredQueriesCount = 0;
            let totalViews = 0;

            const statsPromises = queries.map(async (query) => {
                const answersData = await fetchFromStrapi(
                    `answers?filters[query][documentId]=${query.documentId}`
                );
                const answerCount = answersData.data?.length || 0;

                if (answerCount > 0) {
                    answeredQueriesCount++;
                }

                totalViews += query.viewCount || 0;
            });

            await Promise.all(statsPromises);

            // ⭐ Calculate Response Rate (only for public queries)
            const responseRate = queries.length > 0
                ? Math.round((answeredQueriesCount / queries.length) * 100)
                : 0;

            // ============================================
            // 5. Fetch all answers GIVEN by this user (PUBLIC)
            // ============================================
            const userAnswersData = await fetchFromStrapi(
                `answers?filters[user_profile][documentId]=${userData.documentId}&populate=*`
            );
            const userAnswers = userAnswersData.data || [];

            // ============================================
            // 6. Fetch all answers GIVEN by this user (PERSONAL)
            // ============================================
            const personalAnswersData = await fetchFromStrapi(
                `personal-query-answers?filters[user_profile][documentId]=${userData.documentId}&populate=*`
            );
            const personalAnswers = personalAnswersData.data || [];


            // Combine both public and personal answers
            const allAnswers = [...userAnswers, ...personalAnswers];
            const totalAnswersGiven = allAnswers.length; // ✅ Total answers given by user

            // Count Best Answers from both public and personal
            const bestAnswersCount = allAnswers.filter(
                answer => answer.isBestAnswer === true
            ).length;

            // Sum Helpful Votes from both public and personal
            const helpfulVotesCount = allAnswers.reduce(
                (sum, answer) => sum + (answer.helpfulCount || 0),
                0
            );


            // ============================================
            // 7. Update state with all stats
            // ============================================
            const newStats = {
                totalQueries: totalQueries,
                bestAnswers: bestAnswersCount,
                helpfulVotes: helpfulVotesCount,
                totalViews: totalViews,
                responseRate: responseRate,
                totalAnswersGiven: totalAnswersGiven, // ✅ Added
                loading: false
            };

            setStats(newStats);

            // ============================================
            // 8. Save stats to user_profile collection
            // ============================================
            try {
          

                await updateStrapi(`user-profiles/${userData.documentId}`, {
                    totalQueries: totalQueries,
                    bestAnswers: bestAnswersCount,
                    helpfulVotes: helpfulVotesCount,
                    totalViews: totalViews,
                    totalAnswersGiven: totalAnswersGiven // ✅ Save this too
                });

          
            } catch (saveError) {
                console.error('❌ Error saving stats to user profile:', saveError);
            }

            // ============================================
            // 9. ✅ Calculate and update badges
            // ============================================
            

        

        } catch (err) {
          
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchLiveStats();
    }, [userData?.documentId]);

    // Refresh stats when trigger changes
    useEffect(() => {
        if (statsRefreshTrigger > 0) {
         
            fetchLiveStats();
        }
    }, [statsRefreshTrigger]);

    // ⭐ Enhanced refresh function
    const handleRefresh = async () => {
        setStats(prev => ({ ...prev, loading: true }));

        // Run both in parallel for faster refresh
        await Promise.all([
            fetchLiveStats(),
            onRefresh ? onRefresh() : Promise.resolve()
        ]);

       
    };

    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <User className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            My Queries
                        </h1>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-3">
                        View and manage all your posted queries
                    </p>
                </div>

                <RefreshButton onRefresh={handleRefresh} refreshing={refreshing || stats.loading} />
            </div>

            {/* Stats Cards - 5 cards with professional colors, no icons */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-4">
                <StatsCard
                    label="Total Queries"
                    value={stats.loading ? '...' : stats.totalQueries}
                    valueColor="text-emerald-600 dark:text-emerald-400"
                />
                <StatsCard
                    label="Response Rate"
                    value={stats.loading ? '...' : `${stats.responseRate}%`}
                    valueColor="text-emerald-600 dark:text-emerald-400"
                />
                <StatsCard
                    label="Answers Given"
                    value={stats.loading ? '...' : `${stats.totalAnswersGiven}`}
                    valueColor="text-emerald-600 dark:text-emerald-400"
                />
                <StatsCard
                    label="Best Answers"
                    value={stats.loading ? '...' : stats.bestAnswers}
                    valueColor="text-emerald-600 dark:text-emerald-400"
                />
                <StatsCard
                    label="Helpful Votes"
                    value={stats.loading ? '...' : stats.helpfulVotes}
                    valueColor="text-emerald-600 dark:text-emerald-400"
                />
                <StatsCard
                    label="Total Views"
                    value={stats.loading ? '...' : stats.totalViews}
                    valueColor="text-emerald-600 dark:text-emerald-400"
                />
            </div>
        </div>
    );
}