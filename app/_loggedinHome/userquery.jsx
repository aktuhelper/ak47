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
import { fetchFromStrapi } from '@/secure/strapi';

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

    useEffect(() => {
        if (personalQueries.length >= 0) {
            const count = getNewQueriesCount();
            setNewPersonalQueriesCount(count);

            if (onNewQueriesCountChange) {
                onNewQueriesCountChange(count);
            }
        }
    }, [personalQueries, getNewQueriesCount, onNewQueriesCountChange]);

    useEffect(() => {
        const markAllAsRead = async () => {
            if (activeFilter === 'personal-query' && personalQueries.length > 0) {
                const newQueries = personalQueries.filter(q => q.isNew);

                if (newQueries.length > 0) {
                    for (const query of newQueries) {
                        await markAsRead(query.documentId);
                    }

                    const updatedCount = getNewQueriesCount();
                    setNewPersonalQueriesCount(updatedCount);
                    if (onNewQueriesCountChange) {
                        onNewQueriesCountChange(updatedCount);
                    }
                }
            }
        };

        markAllAsRead();
    }, [activeFilter]);

    const handleQueryClick = async (query) => {
        if (query.isPersonalQuery && query.isNew) {
            const success = await markAsRead(query.documentId);

            if (success) {
                const updatedCount = getNewQueriesCount();
                setNewPersonalQueriesCount(updatedCount);
                if (onNewQueriesCountChange) {
                    onNewQueriesCountChange(updatedCount);
                }
            }
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
        { id: 'answered', label: 'Answered' },
    ];

    const categories = [
        { id: 'academics', label: 'Academic' },
        { id: 'career', label: 'Career' },
        { id: 'college-life', label: 'College Life' },
        { id: 'general', label: 'General Query' },
    ];

    const fetchUserAnsweredQueries = async () => {
        try {
            const data = await fetchFromStrapi(
                `answers?populate=query&filters[user_profile][documentId]=${userData.documentId}`
            );

            const queryIds = [...new Set(
                data.data
                    ?.map(answer => answer.query?.documentId)
                    .filter(Boolean) || []
            )];

            setUserAnsweredQueryIds(queryIds);
        } catch (err) {
            // Error handling without logging
        }
    };

    useEffect(() => {
        if (userData?.documentId) {
            fetchUserAnsweredQueries();
        }
    }, [userData?.documentId]);

    const handleRefreshAll = async () => {
        await Promise.all([
            refreshQueries(),
            refreshPersonalQueries()
        ]);
    };

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

    const getQueriesForFilter = () => {
        if (activeFilter === 'personal-query') {
            return personalQueries;
        }

        if (activeFilter === 'sent-queries') {
            return sentQueries;
        }

        return queries;
    };

    const filteredAndSortedQueries = sortQueries(
        getQueriesForFilter().filter((query) => {
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesTitle = query.title?.toLowerCase().includes(searchLower);
                const matchesDescription = query.description?.toLowerCase().includes(searchLower);
                if (!matchesTitle && !matchesDescription) {
                    return false;
                }
            }

            if (activeCategory) {
                const matches = query.category === activeCategory;
                if (!matches) {
                    return false;
                }
            }

            if (activeFilter === 'personal-query' || activeFilter === 'sent-queries') {
                return true;
            }

            if (activeFilter === 'answered' && query.answerCount === 0) {
                return false;
            }

            if (activeFilter === 'my-answers') {
                const hasAnswered = userAnsweredQueryIds.includes(query.documentId);
                if (!hasAnswered) {
                    return false;
                }
            }

            if (activeFilter === 'popular' && query.views < 200) {
                return false;
            }

            return true;
        })
    );

    if (loading || personalLoading) {
        return <LoadingState />;
    }

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