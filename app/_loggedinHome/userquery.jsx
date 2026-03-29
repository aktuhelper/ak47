"use client";
import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import QueryCardFull from '../_loggedinHome/querycard';
import { useQueries } from '../_loggedinHome/_userquerycollection/useQueries';
import PageHeader from '../_loggedinHome/_userquerycollection/PageHeader';
import SearchBar from '../_loggedinHome/_userquerycollection/SearchBar';
import FilterBar from '../_loggedinHome/_userquerycollection/FilterBar';
import LoadingState from '../_loggedinHome/_userquerycollection/LoadingState';
import ErrorState from '../_loggedinHome/_userquerycollection/ErrorState';
import EmptyState from '../_loggedinHome/_userquerycollection/EmptyState';
import { usePersonalQueries } from '../_loggedinHome/_userquerycollection/usePersonalQueries';
import { fetchFromStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper

export default function UserQueriesPage({ userData, onNewQueriesCountChange }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [newPersonalQueriesCount, setNewPersonalQueriesCount] = useState(0);
    const [userAnsweredQueryIds, setUserAnsweredQueryIds] = useState([]);
    const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

    const { queries, loading, error, refreshing, refreshQueries } = useQueries(userData);
    const {
        personalQueries,
        sentQueries,
        loading: personalLoading,
        error: personalError,
        refreshing: personalRefreshing,
        refreshPersonalQueries,
        markAsRead,
        getNewQueriesCount
    } = usePersonalQueries(userData);

    // ⭐ Update new queries count when personalQueries change
    useEffect(() => {
        if (personalQueries.length >= 0) {
            const count = getNewQueriesCount();
     
            setNewPersonalQueriesCount(count);

            // 🔥 Notify parent component about the count change
            if (onNewQueriesCountChange) {
                onNewQueriesCountChange(count);
            }
        }
    }, [personalQueries, getNewQueriesCount, onNewQueriesCountChange]);

    // ⭐ Debug logging
    useEffect(() => {
   
    }, [personalQueries, newPersonalQueriesCount]);

    // 🔍 Debug: Log all unique categories
    useEffect(() => {
        const allQueries = [...queries, ...personalQueries, ...sentQueries];
        const uniqueCategories = [...new Set(allQueries.map(q => q.category))];
     
    }, [queries, personalQueries, sentQueries]);

    // ✅ NEW: Mark all new queries as read when viewing the personal-query tab
    useEffect(() => {
        const markAllAsRead = async () => {
            if (activeFilter === 'personal-query' && personalQueries.length > 0) {
                const newQueries = personalQueries.filter(q => q.isNew);

                if (newQueries.length > 0) {
                   

                    // Mark all new queries as read
                    for (const query of newQueries) {
                        await markAsRead(query.documentId);
                    }

                  

                    // 🔥 Update count after marking as read
                    const updatedCount = getNewQueriesCount();
                    setNewPersonalQueriesCount(updatedCount);
                    if (onNewQueriesCountChange) {
                        onNewQueriesCountChange(updatedCount);
                    }
                }
            }
        };

        markAllAsRead();
    }, [activeFilter]); // Only trigger when activeFilter changes

    // ⭐ Handle query click to mark as read (keeping this for individual query clicks)
    const handleQueryClick = async (query) => {
       

        if (query.isPersonalQuery && query.isNew) {
            
            const success = await markAsRead(query.documentId);

            if (success) {
              
                const updatedCount = getNewQueriesCount();


                // 🔥 Update count after marking individual query as read
                setNewPersonalQueriesCount(updatedCount);
                if (onNewQueriesCountChange) {
                    onNewQueriesCountChange(updatedCount);
                }
            } else {
                console.log('❌ Failed to mark query as read');
            }
        } else {
            console.log('⏭️ Skipping mark as read:', {
                reason: !query.isPersonalQuery ? 'Not a personal query' : 'Already read'
            });
        }
    };

    const filters = [
        { id: 'all', label: 'All Public Queries' },
        {
            id: 'personal-query',
            label: 'Received Private Queries',
            badge: newPersonalQueriesCount > 0 ? newPersonalQueriesCount : null
        },
        { id: 'sent-queries', label: 'Sent Private Queries' },
        { id: 'answered', label: 'Answered Private Queries' },
    ];

    // ✅ FIXED: Categories now match Strapi database exactly
    const categories = [
        { id: 'academics', label: 'Academic' },
        { id: 'career', label: 'Career' },
        { id: 'college-life', label: 'College Life' },
        { id: 'General Query', label: 'General Query' },  // ⚠️ Note: Capital letters & space
    ];

    // ⭐ Fetch all queries where user has answered
    const fetchUserAnsweredQueries = async () => {
        try {
            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(
                `answers?populate=query&filters[user_profile][documentId]=${userData.documentId}`
            );

            // Extract unique query documentIds
            const queryIds = [...new Set(
                data.data
                    ?.map(answer => answer.query?.documentId)
                    .filter(Boolean) || []
            )];

         
            setUserAnsweredQueryIds(queryIds);
        } catch (err) {
            console.error('❌ Failed to fetch user answers:', err);
        }
    };

    // ⭐ Fetch on mount and when userData changes
    useEffect(() => {
        if (userData?.documentId) {
            fetchUserAnsweredQueries();
        }
    }, [userData?.documentId]);

    // 🔥 NEW: Combined refresh function for ALL data
    const handleRefreshAll = async () => {
      

        // Refresh both regular queries and personal queries in parallel
        await Promise.all([
            refreshQueries(),
            refreshPersonalQueries()
        ]);

        
    };

    // Sorting function
    const sortQueries = (queries) => {
        const sorted = [...queries];

        switch (sortBy) {
            case 'most-answered':
                return sorted.sort((a, b) => b.answerCount - a.answerCount);
            case 'most-viewed':
                return sorted.sort((a, b) => b.views - a.views);
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'latest':
            default:
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    };

    // ⭐ Combine queries based on active filter
    const getQueriesForFilter = () => {
        if (activeFilter === 'personal-query') return personalQueries;
        if (activeFilter === 'sent-queries') return sentQueries;
        if (activeFilter === 'answered') return personalQueries; // ⭐ Only personal
        return queries;
    };

    // ✅ FIXED: Simplified category filtering with exact match
    const filteredAndSortedQueries = sortQueries(
        getQueriesForFilter().filter((query) => {
          

            // Search filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesTitle = query.title?.toLowerCase().includes(searchLower);
                const matchesDescription = query.description?.toLowerCase().includes(searchLower);
                if (!matchesTitle && !matchesDescription) {
                 
                    return false;
                }
            }

            // ✅ Category filter - Apply to ALL tabs with exact match
            if (activeCategory) {
                const matches = query.category === activeCategory;
              

                if (!matches) {
                    console.log('❌ Failed category filter');
                    return false;
                }
            }

            // Skip other filters for personal/sent queries
            if (activeFilter === 'personal-query' || activeFilter === 'sent-queries') {
            
                return true; // Category already filtered above
            }


            if (activeFilter === 'answered' && (query.answerCount ?? 0) === 0) {
                return false;
            }

            if (activeFilter === 'my-answers') {
                const hasAnswered = userAnsweredQueryIds.includes(query.documentId);
              
                if (!hasAnswered) {
                    console.log('❌ Failed my-answers filter');
                    return false;
                }
            }

            if (activeFilter === 'popular' && query.views < 200) {
                console.log('❌ Failed popular filter (views < 200)');
                return false;
            }

         
            return true;
        })
    );

    // Loading state
    if (loading || personalLoading) {
        return <LoadingState />;
    }

    // Error state
    if (error || personalError) {
        return <ErrorState error={error || personalError} onRetry={() => window.location.reload()} />;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                <PageHeader
                    userData={userData}
                    onRefresh={handleRefreshAll}
                    refreshing={refreshing || personalRefreshing}
                    statsRefreshTrigger={statsRefreshTrigger}
                />

                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <FilterBar
                    filters={filters}
                    categories={categories}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                {filteredAndSortedQueries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {filteredAndSortedQueries.map((query) => (
                            <QueryCardFull
                                key={query.id}
                                query={query}
                                userData={userData}
                                onAnswerAdded={async () => {
                                   
                                    await handleRefreshAll();
                                    await fetchUserAnsweredQueries();
                                }}
                                onStatsChange={() => {
                                   
                                    setStatsRefreshTrigger(prev => prev + 1);
                                }}
                                onQueryClick={() => handleQueryClick(query)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        searchQuery={searchQuery}
                        activeCategory={activeCategory}
                        activeFilter={activeFilter}
                    />
                )}
            </div>
        </div>
    );
}