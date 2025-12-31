"use client";
import { useRef, useEffect } from 'react';
import { useQueryFilters } from '../_loggedinHome/_trendingquery/useQueryFilters';
import { useFetchQueries } from '../_loggedinHome/_trendingquery/useFetchQueries';
import TrendingHeader from '../_loggedinHome/_trendingquery/TrendingHeader';
import SearchBar from '../_loggedinHome/_trendingquery/SearchBar';
import FilterBar from '../_loggedinHome/_trendingquery/FilterBar';
import ErrorMessage from '../_loggedinHome/_trendingquery/ErrorMessage';
import LoadingSpinner from '../_loggedinHome/_trendingquery/LoadingSpinner';
import EmptyState from '../_loggedinHome/_trendingquery/EmptyState';
import QueriesGrid from '../_loggedinHome/_trendingquery/QueriesGrid';
export default function TrendingQueriesPage({ userData }) {
    const observerTarget = useRef(null);
    const {
        activeFilter,
        activeCategory,
        sortBy,
        searchQuery,
        handleFilterChange,
        handleCategoryChange,
        handleSortChange,
        handleSearchChange,
    } = useQueryFilters();
    const {
        displayedQueries,
        loading,
        hasMore,
        error,
        totalCount,
        loadMoreQueries,
        handleQueryUpdate,
        retryFetch,
    } = useFetchQueries(activeFilter, activeCategory, sortBy, searchQuery, userData);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) {
                    loadMoreQueries();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loading, hasMore, loadMoreQueries]);
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <TrendingHeader
                    totalCount={totalCount}
                    onRefresh={retryFetch}
                    isRefreshing={loading}
                />

                {/* Search Bar */}
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                />
                {/* Filter Bar */}
                <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                />
                {/* Error Message */}
                <ErrorMessage error={error} onRetry={retryFetch} />
                {/* Query Cards Grid or Empty State */}
                {displayedQueries.length > 0 ? (
                    <QueriesGrid
                        queries={displayedQueries}
                        userData={userData}
                        onQueryUpdate={handleQueryUpdate}
                        observerTarget={observerTarget}
                        hasMore={hasMore}
                        loading={loading}
                    />
                ) : (
                    <div>
                        {loading ? (
                            <LoadingSpinner variant="full" message="Loading trending queries..." />
                        ) : (
                            <EmptyState
                                searchQuery={searchQuery}
                                activeCategory={activeCategory}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}