// ✅ Secure useFetchQueries - uses secure API wrapper
import { useState, useEffect, useCallback } from 'react';
import { fetchFromStrapi } from '@/secure/strapi';

// Helper function to convert year text to number
function getYearNumber(yearText) {
    if (!yearText) return null;

    const yearMap = {
        '4th Year': 4, '3rd Year': 3, '2nd Year': 2, '1st Year': 1,
        '4th': 4, '3rd': 3, '2nd': 2, '1st': 1,
        'Fourth Year': 4, 'Third Year': 3, 'Second Year': 2, 'First Year': 1,
        'fourth': 4, 'third': 3, 'second': 2, 'first': 1,
        '4': 4, '3': 3, '2': 2, '1': 1
    };

    let result = yearMap[yearText];
    if (!result && yearText.trim) {
        result = yearMap[yearText.trim()];
    }

    return result || null;
}

export function useFetchQueries(activeFilter, activeCategory, sortBy, searchQuery, userData) {
    const [displayedQueries, setDisplayedQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Calculate trending score
    const calculateTrendingScore = (query) => {
        const views = query.views || 0;
        const answerCount = query.answerCount || 0;
        return views + (answerCount * 5);
    };

    // Get date range based on active filter
    const getDateRange = () => {
        const now = new Date();
        let startDate = new Date();

        switch (activeFilter) {
            case 'hot':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(now.getDate() - 30);
                break;
            case 'trending':
            default:
                startDate.setHours(now.getHours() - 48);
                break;
        }

        return startDate.toISOString();
    };

    // Fetch queries from Strapi API with visibility filters
    const fetchQueriesFromAPI = async (pageNum = 1, isNewSearch = false) => {
        if (loading || !userData) return;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            // Basic pagination
            params.append('pagination[page]', pageNum);
            params.append('pagination[pageSize]', 10);

            // Populate nested relations properly for Strapi v5
            params.append('populate[user_profile][populate][0]', 'profileImage');
            params.append('populate[attachments][populate]', '*');

            // ============================================
            // VISIBILITY FILTERS (Trending Page - Global)
            // ============================================

            // Condition 1: visibility = "public" from ALL colleges
            params.append('filters[$or][0][visibility][$eq]', 'public');

            // Condition 2: visibility = "college" from user's college ONLY
            params.append('filters[$or][1][$and][0][visibility][$eq]', 'college');
            params.append('filters[$or][1][$and][1][user_profile][college][$eq]', userData.college);

            // Condition 3: visibility = "branch" - special handling for courses with/without branches
            let branchConditionIndex = 2;

            if (userData.branch) {
                // BTech/MTech with branches: Match by branch from ANY college
                params.append(`filters[$or][${branchConditionIndex}][$and][0][visibility][$eq]`, 'branch');
                params.append(`filters[$or][${branchConditionIndex}][$and][1][user_profile][branch][$eq]`, userData.branch);
            } else if (userData.course) {
                // MCA/BCA/MBA/BPharm: Match by course from ANY college (users without branches)
                params.append(`filters[$or][${branchConditionIndex}][$and][0][visibility][$eq]`, 'branch');
                params.append(`filters[$or][${branchConditionIndex}][$and][1][user_profile][course][$eq]`, userData.course);
                params.append(`filters[$or][${branchConditionIndex}][$and][2][user_profile][branch][$null]`, true);
            }

            // Condition 4: visibility = "seniors" where user is senior from ANY college
            const userYearNumber = getYearNumber(userData.year);
            if (userYearNumber && userYearNumber > 1) {
                const seniorIndex = (userData.branch || userData.course) ? 3 : 2;
                params.append(`filters[$or][${seniorIndex}][$and][0][visibility][$eq]`, 'seniors');

                // Get all junior year strings
                const juniorYears = [];
                for (let i = 1; i < userYearNumber; i++) {
                    if (i === 1) juniorYears.push('1st Year', '1st', '1');
                    else if (i === 2) juniorYears.push('2nd Year', '2nd', '2');
                    else if (i === 3) juniorYears.push('3rd Year', '3rd', '3');
                    else juniorYears.push('4th Year', '4th', '4');
                }

                // Build nested $or for junior years
                juniorYears.forEach((year, index) => {
                    params.append(`filters[$or][${seniorIndex}][$and][1][$or][${index}][user_profile][year][$eq]`, year);
                });
            }

            // ============================================
            // ADDITIONAL FILTERS
            // ============================================

            // Add date filter based on active filter
            try {
                const startDate = getDateRange();
                params.append('filters[createdAt][$gte]', startDate);
            } catch (dateErr) {
                console.warn('⚠️ Date filter skipped:', dateErr);
            }

            // Add category filter if selected
            if (activeCategory) {
                const categoryForAPI = activeCategory.toLowerCase().replace(' ', '-');
                params.append('filters[category][$eqi]', categoryForAPI);
            }

            // Add search filter if exists
            if (searchQuery.trim()) {
                params.append('filters[$or][0][title][$containsi]', searchQuery);
                params.append('filters[$or][1][description][$containsi]', searchQuery);
            }

            // Add sorting with correct field names
            if (sortBy === 'most-viewed' || sortBy === 'trending') {
                params.append('sort[0]', 'viewCount:desc');
                params.append('sort[1]', 'createdAt:desc');
            } else if (sortBy === 'most-answered') {
                params.append('sort[0]', 'answerCount:desc');
                params.append('sort[1]', 'createdAt:desc');
            } else if (sortBy === 'latest') {
                params.append('sort[0]', 'createdAt:desc');
            } else {
                params.append('sort[0]', 'viewCount:desc');
                params.append('sort[1]', 'createdAt:desc');
            }

            // Add cache-busting parameter for refresh
            if (isNewSearch) {
                params.append('_t', Date.now().toString());
            }

            const endpoint = `queries?${params.toString()}`;
           

            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(endpoint);

     

            if (!data.data || !Array.isArray(data.data)) {
          
                throw new Error('Invalid API response structure');
            }

            // Transform Strapi data with proper user and attachment extraction
            const transformedQueries = (data.data || []).map(item => {
                const views = item.viewCount || 0;
                const answerCount = item.answerCount || 0;

                const displayCategory = item.category
                    ? item.category.charAt(0).toUpperCase() + item.category.slice(1)
                    : 'General Query';

                // Extract user data from user_profile relation
                let userData = null;
                if (item.user_profile) {
                    const userProfile = item.user_profile.data || item.user_profile;

                    if (userProfile) {
                        const userAttrs = userProfile.attributes || userProfile;

                        // Get profile image URL
                        // ✅ URLs are already absolute from the API proxy
                        let profileImageUrl = null;
                        if (userAttrs.profileImage) {
                            const profileImage = userAttrs.profileImage.data || userAttrs.profileImage;
                            if (profileImage) {
                                const imageData = profileImage.attributes || profileImage;
                                profileImageUrl = imageData.url;
                            }
                        }

                        if (!profileImageUrl && userAttrs.profilePic) {
                            profileImageUrl = userAttrs.profilePic;
                        }

                        userData = {
                            documentId: userProfile.documentId || '',
                            name: userAttrs.name || 'Anonymous',
                            username: userAttrs.username || '',
                            profileImageUrl: profileImageUrl || 'https://api.dicebear.com/7.x/notionists/svg?seed=default',
                            college: userAttrs.college || 'Unknown College',
                            branch: userAttrs.branch || 'N/A',
                            course: userAttrs.course || 'N/A',
                            year: userAttrs.year || 1,
                            isVerified: userAttrs.isVerified || false,
                            isMentor: userAttrs.isMentor || false,
                            superMentor: userAttrs.superMentor || false,
                            eliteMentor: userAttrs.eliteMentor || false,
                            activeParticipant: userAttrs.activeParticipant || false,
                            isOnline: false,
                        };
                    }
                }

                // Extract attachments
                // ✅ URLs are already absolute from the API proxy
                let attachments = [];
                if (item.attachments) {
                    const attachmentsData = item.attachments.data || item.attachments;

                    if (Array.isArray(attachmentsData)) {
                        attachments = attachmentsData.map(att => {
                            const attData = att.attributes || att;
                            return {
                                type: attData.mime?.startsWith('image/') ? 'image' : 'file',
                                url: attData.url, // Already absolute
                                name: attData.name,
                                mime: attData.mime,
                            };
                        });
                    }
                }

                return {
                    id: item.id,
                    documentId: item.documentId,
                    title: item.title || 'Untitled Query',
                    description: item.description || '',
                    category: displayCategory,
                    views: views,
                    answerCount: answerCount,
                    createdAt: item.createdAt,
                    timestamp: new Date(item.createdAt).toLocaleString(),
                    quesstatus: item.quesstatus || 'active',
                    isAnonymous: item.isAnonymous || false,
                    visibility: item.visibility || 'public',
                    trendingScore: calculateTrendingScore({
                        views: views,
                        answerCount: answerCount
                    }),
                    user: userData || {
                        documentId: '',
                        name: item.isAnonymous ? 'Anonymous User' : 'Unknown User',
                        username: '',
                        profileImageUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=default',
                        college: 'Unknown College',
                        branch: 'N/A',
                        course: 'N/A',
                        year: 1,
                        isVerified: false,
                        isOnline: false,
                        isMentor: false,
                        superMentor: false,
                        eliteMentor: false,
                        activeParticipant: false,
                    },
                    attachments: attachments,
                };
            });

            // Client-side sorting for trending score
            if (sortBy === 'trending') {
                transformedQueries.sort((a, b) => b.trendingScore - a.trendingScore);
            }

            // Update state
            if (isNewSearch || pageNum === 1) {
                setDisplayedQueries(transformedQueries);
            } else {
                setDisplayedQueries(prev => [...prev, ...transformedQueries]);
            }

            const pagination = data.meta?.pagination || {};
            setTotalCount(pagination.total || transformedQueries.length);
            setHasMore(pageNum < (pagination.pageCount || 1));
            setPage(pageNum);

          

        } catch (err) {
      
            setError(err.message || 'Failed to load queries');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and refresh trigger
    useEffect(() => {
        if (userData) {
            setPage(1);
            setHasMore(true);
            fetchQueriesFromAPI(1, true);
        }
    }, [activeFilter, activeCategory, sortBy, refreshTrigger, userData]);

    // Search with debounce
    useEffect(() => {
        if (!userData) return;

        const timer = setTimeout(() => {
            setPage(1);
            setHasMore(true);
            fetchQueriesFromAPI(1, true);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, userData]);

    // Load more queries
    const loadMoreQueries = useCallback(() => {
        if (loading || !hasMore) return;
        fetchQueriesFromAPI(page + 1, false);
    }, [loading, hasMore, page]);

    // Callback to refresh queries when answers are added/deleted
    const handleQueryUpdate = () => {

        fetchQueriesFromAPI(1, true);
    };

    // New refresh function that triggers fresh data fetch
    const handleRefresh = useCallback(() => {
     
        setPage(1);
        setHasMore(true);
        setRefreshTrigger(prev => prev + 1);
    }, []);

    return {
        displayedQueries,
        loading,
        hasMore,
        error,
        totalCount,
        loadMoreQueries,
        handleQueryUpdate,
        retryFetch: handleRefresh,
    };
}