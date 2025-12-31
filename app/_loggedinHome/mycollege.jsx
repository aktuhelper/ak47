"use client";
import { useState } from 'react';
import { fetchQueriesByCollege } from '../_loggedinHome/_apimycollegequery/strapi';
import { transformQueryData } from '../_loggedinHome/_apimycollegequery/transform';
import QueryCardFull from '../_loggedinHome/querycard';
import { CollegeHeader } from '../_loggedinHome/_mycollegequery/CollegeHeader';
import { SearchBar } from '../_loggedinHome/_mycollegequery/SearchBar';
import { FilterBar } from '../_loggedinHome/_mycollegequery/FilterBar';
import { QueryGrid } from '../_loggedinHome/_mycollegequery/QueryGrid';
import { InfiniteScrollTrigger } from '../_loggedinHome/_mycollegequery/InfiniteScrollTrigger';
import { EmptyState } from '../_loggedinHome/_mycollegequery/EmptyState';
import { useQueriesFetch } from '../_loggedinHome/_mycollegequery/useQueriesFetch';
import { useInfiniteScroll } from '../_loggedinHome/_mycollegequery/useInfiniteScroll';

export default function MyCollegePage({ userData }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortBy, setSortBy] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');

    const {
        displayedQueries,
        loading,
        hasMore,
        totalQueries,
        loadMoreQueries,
        refreshQueries
    } = useQueriesFetch({
        userData,
        activeFilter,
        activeCategory,
        sortBy,
        searchQuery,
        fetchQueriesByCollege,
        transformQueryData
    });

    const observerTarget = useInfiniteScroll({
        loading,
        hasMore,
        onLoadMore: loadMoreQueries
    });

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setActiveCategory(null);
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId);
        setActiveFilter('all');
    };

    if (!userData) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-zinc-600 dark:text-zinc-400">Loading user data...</p>
                </div>
            </div>
        );
    }

    const hasFilters = activeFilter !== 'all' || activeCategory !== null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <CollegeHeader
                    collegeName={userData.college}
                    totalQueries={totalQueries}
                    onRefresh={refreshQueries}
                />
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <FilterBar
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    userBranch={userData.branch}
                    userCourse={userData.course}
                />

                {displayedQueries.length > 0 ? (
                    <>
                        <QueryGrid
                            queries={displayedQueries}
                            userData={userData}
                            onAnswerAdded={refreshQueries}
                            onStatsChange={refreshQueries}
                            QueryCardComponent={QueryCardFull}
                        />

                        <InfiniteScrollTrigger
                            observerRef={observerTarget}
                            hasMore={hasMore}
                            loading={loading}
                            queriesCount={displayedQueries.length}
                        />
                    </>
                ) : (
                    <EmptyState
                        loading={loading}
                        hasFilters={hasFilters}
                        searchQuery={searchQuery}
                    />
                )}
            </div>
        </div>
    );
}
