"use client";
import { useState, useCallback } from "react";
import PageHeader from "./_userquerycollection/PageHeader";
import CompleteProfilePage from "./profile";
import QueryCardFull from "./userquery";

export default function IntegratedParentComponent({ userData }) {
    const [liveStats, setLiveStats] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
    const [queries, setQueries] = useState([]);

    // ⭐ Callback to receive stats from PageHeader
    const handleStatsUpdate = useCallback((stats) => {
        console.log('📊 Stats received in parent:', stats);
        setLiveStats(stats);
    }, []);

    // ⭐ Handle data changes from QueryCard
    const handleDataChange = useCallback((changeData) => {
        console.log('📊 Data change detected:', changeData);

        // Trigger stats refresh based on change type
        switch (changeData.type) {
            case 'view_increment':
                console.log('👁️ View count increased for query:', changeData.queryId);
                // Optionally update local state immediately
                break;

            case 'answer_added':
                console.log('➕ Answer added to query:', changeData.queryId);
                // Trigger full stats refresh
                triggerStatsRefresh();
                break;

            case 'answer_deleted':
                console.log('🗑️ Answer deleted from query:', changeData.queryId);
                // Trigger full stats refresh
                triggerStatsRefresh();
                break;

            case 'query_deleted':
                console.log('🗑️ Query deleted:', changeData.queryId);
                // Remove from local state
                setQueries(prev => prev.filter(q => q.documentId !== changeData.queryId));
                // Trigger full stats refresh
                triggerStatsRefresh();
                break;

            default:
                console.log('Unknown change type:', changeData.type);
        }
    }, []);

    // ⭐ Trigger stats refresh
    const triggerStatsRefresh = useCallback(() => {
        setStatsRefreshTrigger(prev => prev + 1);
    }, []);

    // ⭐ Handle refresh button click
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            // Add your refresh logic here
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('✅ Refresh completed');
        } catch (error) {
            console.error('❌ Refresh failed:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // ⭐ Handle profile update
    const handleProfileUpdate = async () => {
        console.log('👤 Profile updated, refreshing stats...');
        triggerStatsRefresh();
    };

    // ⭐ Handle query click (view tracking)
    const handleQueryClick = async (queryId) => {
        try {
            // Your API call to increment view count
            const response = await fetch(`http://localhost:1337/api/queries/${queryId}/increment-view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                console.log('✅ View count incremented for:', queryId);
                // Stats will be updated through the onDataChange callback
            }
        } catch (error) {
            console.error('❌ Failed to increment view:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header with Stats */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <PageHeader
                    userData={userData}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    statsRefreshTrigger={statsRefreshTrigger}
                    onStatsUpdate={handleStatsUpdate}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                    {/* Left Side - Query List */}
                    <div className="lg:col-span-8 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Your Queries
                        </h2>

                        {queries.length === 0 ? (
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No queries yet. Start by asking a question!
                                </p>
                            </div>
                        ) : (
                            queries.map((query) => (
                                <QueryCardFull
                                    key={query.documentId}
                                    query={query}
                                    userData={userData}
                                    onAnswerAdded={triggerStatsRefresh}
                                    onStatsChange={triggerStatsRefresh}
                                    onQueryClick={() => handleQueryClick(query.documentId)}
                                    onDataChange={handleDataChange}
                                />
                            ))
                        )}
                    </div>

                    {/* Right Side - Profile */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-6">
                            <CompleteProfilePage
                                userData={userData}
                                onUpdate={handleProfileUpdate}
                                liveStats={liveStats}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Summary Section (Optional) */}
            {liveStats && !liveStats.loading && (
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Your Activity Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {liveStats.totalQueries}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Queries
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {liveStats.answersGiven || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Answers Given
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                    {liveStats.bestAnswers}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Best Answers
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {liveStats.helpfulVotes}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Helpful Votes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}