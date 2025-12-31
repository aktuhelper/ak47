import { useState, useEffect, useCallback } from 'react';

function getSortValue(sortValue) {
    switch (sortValue) {
        case 'most-answered':
            return 'answerCount:desc';
        case 'most-viewed':
            return 'viewCount:desc';
        case 'top-rated':
            return 'viewCount:desc';
        case 'latest':
        default:
            return 'createdAt:desc';
    }
}

export function useQueriesFetch({
    userData,
    activeFilter,
    activeCategory,
    sortBy,
    searchQuery,
    fetchQueriesByCollege,
    transformQueryData
}) {
    const [displayedQueries, setDisplayedQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalQueries, setTotalQueries] = useState(0);

    const fetchQueries = useCallback(async (pageNum = 1, append = false) => {
        // Check if userData has minimum required field (college)
        // branch and year are optional - visibility filters handle their absence
        if (!userData?.college) {
           
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const filters = {
                page: pageNum,
                pageSize: 20,
                sortBy: getSortValue(sortBy),
                search: searchQuery || null,
                category: activeCategory || null,
            };

            // Add UI-level filters (different from visibility filters)
            if (activeFilter === 'branch' && userData.branch) {
                filters.branch = userData.branch;
            }
            if (activeFilter === 'course' && userData.course) {
                filters.course = userData.course;
            }

            // Pass full userData object for visibility filtering
            const response = await fetchQueriesByCollege(userData, filters);
            const transformedQueries = response.data.map(transformQueryData);

            if (append) {
                setDisplayedQueries(prev => [...prev, ...transformedQueries]);
            } else {
                setDisplayedQueries(transformedQueries);
            }

            setTotalQueries(response.meta?.pagination?.total || 0);
            setHasMore(
                response.meta?.pagination?.page < response.meta?.pagination?.pageCount
            );
        } catch (error) {
            console.error('❌ Error fetching queries:', error);
            if (!append) {
                setDisplayedQueries([]);
            }
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [userData, activeFilter, activeCategory, sortBy, searchQuery, fetchQueriesByCollege, transformQueryData]);

    useEffect(() => {
        if (userData?.college) {
            setPage(1);
            fetchQueries(1, false);
        }
    }, [sortBy, searchQuery, activeCategory, activeFilter, userData?.college, fetchQueries]);

    const loadMoreQueries = useCallback(() => {
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchQueries(nextPage, true);
    }, [loading, hasMore, page, fetchQueries]);

    const refreshQueries = useCallback(() => {
        setPage(1);
        fetchQueries(1, false);
    }, [fetchQueries]);

    return {
        displayedQueries,
        loading,
        hasMore,
        totalQueries,
        loadMoreQueries,
        refreshQueries
    };
}