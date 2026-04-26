// File: app/_loggedinHome/_hooks/useFetchPublicQueries.js
import { useState, useCallback, useRef } from 'react';
import { fetchFromStrapi, postToStrapi } from '@/secure/strapi';

// Helper function to convert year text to number
function getYearNumber(yearText) {
    if (!yearText) return null;

    const yearMap = {
        '4th Year': 4,
        '3rd Year': 3,
        '2nd Year': 2,
        '1st Year': 1,
        '4th': 4,
        '3rd': 3,
        '2nd': 2,
        '1st': 1,
        'Fourth Year': 4,
        'Third Year': 3,
        'Second Year': 2,
        'First Year': 1,
        'fourth': 4,
        'third': 3,
        'second': 2,
        'first': 1,
        '4': 4,
        '3': 3,
        '2': 2,
        '1': 1
    };

    let result = yearMap[yearText];

    if (!result && yearText.trim) {
        result = yearMap[yearText.trim()];
    }

    return result || null;
}

export const useFetchPublicQueries = (userData = null) => {
    const [publicQueries, setPublicQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const observer = useRef();
    const PAGE_SIZE = 10;

    // ✅ Fetch queries with pagination and visibility filtering
    const fetchQueries = useCallback(async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            setError(null);
            console.log(`🔍 Fetching public queries - Page ${pageNum}...`);

            // ⭐ Build query params with visibility filters
            const params = new URLSearchParams();

            // Pagination
            params.append('pagination[page]', pageNum);
            params.append('pagination[pageSize]', PAGE_SIZE);

            // Sort
            params.append('sort[0]', 'createdAt:desc');

            // Populate
            params.append('populate[user_profile][populate][0]', 'profileImage');
            params.append('populate[answers][populate][user_profile][populate][0]', 'profileImage');
            params.append('populate[attachments]', 'true');

            // ============================================
            // VISIBILITY FILTERS (if userData provided)
            // ============================================
            if (userData && userData.college) {
                console.log('👤 User data provided, applying visibility filters:', {
                    college: userData.college,
                    branch: userData.branch,
                    course: userData.course,
                    year: userData.year
                });

                // Condition 1: visibility = "public" (NO college filter)
                params.append('filters[$or][0][visibility][$eq]', 'public');

                // Condition 2: visibility = "college" AND same college
                params.append('filters[$or][1][$and][0][visibility][$eq]', 'college');
                params.append('filters[$or][1][$and][1][user_profile][college][$eq]', userData.college);

                // Condition 3: visibility = "branch" AND same branch/course AND same college
                if (userData.branch) {
                    // BTech/MTech with branches: Match by branch
                    params.append('filters[$or][2][$and][0][visibility][$eq]', 'branch');
                    params.append('filters[$or][2][$and][1][user_profile][college][$eq]', userData.college);
                    params.append('filters[$or][2][$and][2][user_profile][branch][$eq]', userData.branch);
                } else if (userData.course) {
                    // MCA/BCA/MBA/BPharm without branches: Match by course
                    params.append('filters[$or][2][$and][0][visibility][$eq]', 'branch');
                    params.append('filters[$or][2][$and][1][user_profile][college][$eq]', userData.college);
                    params.append('filters[$or][2][$and][2][user_profile][course][$eq]', userData.course);
                    params.append('filters[$or][2][$and][3][user_profile][branch][$null]', true);
                }

                // Condition 4: visibility = "seniors" AND same college AND user.year > creator.year
                const userYearNumber = getYearNumber(userData.year);

                if (userYearNumber && userYearNumber > 1) {
                    const seniorIndex = (userData.branch || userData.course) ? 3 : 2;
                    params.append(`filters[$or][${seniorIndex}][$and][0][visibility][$eq]`, 'seniors');
                    params.append(`filters[$or][${seniorIndex}][$and][1][user_profile][college][$eq]`, userData.college);

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
                        params.append(`filters[$or][${seniorIndex}][$and][2][$or][${index}][user_profile][year][$eq]`, year);
                    });
                }
            } else {
                // If no userData, only show public queries
                console.log('🌍 No user data, showing only public queries');
                params.append('filters[visibility][$eq]', 'public');
            }

            const queryString = params.toString();
            const endpoint = `queries?${queryString}`;
            console.log('📡 API Endpoint:', endpoint);

            // 🔒 Use secure API wrapper
            const data = await fetchFromStrapi(endpoint);

            console.log('📊 Pagination info:', {
                page: data.meta?.pagination?.page,
                pageSize: data.meta?.pagination?.pageSize,
                pageCount: data.meta?.pagination?.pageCount,
                total: data.meta?.pagination?.total
            });

            // ⭐ Format queries
            const formattedQueries = (data.data || []).map(query => {
                const userProfile = query.user_profile;

                if (!userProfile) {
                    console.warn('⚠️ No user_profile for query:', query.id);
                    return formatQueryWithAnonymousUser(query);
                }

                // Get profile image
                let profileImageUrl = getProfileImageUrl(userProfile);

                return {
                    id: query.id,
                    documentId: query.documentId || query.id,
                    title: query.title || 'Untitled Query',
                    description: query.description || query.content || '',
                    category: query.category || 'General',
                    visibility: query.visibility || 'public',
                    views: query.viewCount || 0,
                    answerCount: query.answerCount || 0,
                    createdAt: query.createdAt || new Date().toISOString(),
                    updatedAt: query.updatedAt || query.createdAt || new Date().toISOString(),
                    attachments: formatAttachments(query.attachments),
                    isPersonalQuery: false,
                    isSentQuery: false,
                    user: formatUserProfile(userProfile, profileImageUrl)
                };
            });

            // ⭐ Append or replace queries
            if (append) {
                setPublicQueries(prev => [...prev, ...formattedQueries]);
            } else {
                setPublicQueries(formattedQueries);
            }

            // ⭐ Update pagination state
            const pagination = data.meta?.pagination;
            setPage(pagination?.page || 1);
            setTotalPages(pagination?.pageCount || 0);
            setHasMore((pagination?.page || 1) < (pagination?.pageCount || 0));

            console.log('✅ Queries loaded:', {
                currentPage: pagination?.page,
                totalPages: pagination?.pageCount,
                hasMore: (pagination?.page || 1) < (pagination?.pageCount || 0),
                queriesLoaded: formattedQueries.length,
                totalQueries: append ? publicQueries.length + formattedQueries.length : formattedQueries.length
            });

            return formattedQueries;

        } catch (err) {
            console.error('❌ Error fetching queries:', err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [publicQueries.length, userData]);

    // ✅ Load more queries (next page)
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;
        console.log('📄 Loading more queries...');
        fetchQueries(page + 1, true);
    }, [loading, hasMore, page, fetchQueries]);

    // ✅ Increment view count using custom backend endpoint
    const incrementViewCount = useCallback(async (queryDocumentId, userId) => {
        try {
            console.log('👁️ Calling backend to increment view:', { queryDocumentId, userId });

            // 🔒 Use secure API wrapper
            const endpoint = `/api/queries/${queryDocumentId}/increment-view`;
            const responseData = await postToStrapi(endpoint, {
                userId: userId || null
            });

            const { viewCount, alreadyViewed, reason } = responseData.data;

            if (alreadyViewed) {
                console.log(`⏭️ View not counted: ${reason}`);
            } else {
                console.log('✅ View count incremented to:', viewCount);
            }

            // Update local state with server's viewCount
            setPublicQueries(prev =>
                prev.map(q =>
                    q.documentId === queryDocumentId
                        ? { ...q, views: viewCount }
                        : q
                )
            );

            return { success: true, viewCount, alreadyViewed };
        } catch (err) {
            console.error('❌ Error incrementing view:', err);
            return { success: false };
        }
    }, []);

    // ✅ Update a single query in the list
    const updateQuery = useCallback((queryDocumentId, updates) => {
        setPublicQueries(prev =>
            prev.map(q =>
                q.documentId === queryDocumentId
                    ? { ...q, ...updates }
                    : q
            )
        );
    }, []);

    // ✅ Refresh queries (re-fetch from start)
    const refreshQueries = useCallback(async () => {
        console.log('🔄 Refreshing public queries...');
        setPage(1);
        setHasMore(true);
        return await fetchQueries(1, false);
    }, [fetchQueries]);

    // ✅ Intersection Observer for last element
    const lastQueryRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log('🔽 Reached bottom, loading more...');
                loadMore();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadMore]);

    return {
        publicQueries,
        loading,
        error,
        hasMore,
        page,
        totalPages,
        fetchQueries,
        loadMore,
        incrementViewCount,
        updateQuery,
        refreshQueries,
        lastQueryRef
    };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get profile image URL from user profile
const getProfileImageUrl = (userProfile) => {
    if (userProfile.profileImageUrl) {
        return userProfile.profileImageUrl;
    }
    if (userProfile.profilePic) {
        return userProfile.profilePic;
    }
    if (userProfile.profileImage) {
        const profileImage = Array.isArray(userProfile.profileImage)
            ? userProfile.profileImage[0]
            : userProfile.profileImage;

        if (profileImage?.url) {
            // Note: Image URLs from Strapi are already absolute via the API proxy
            return profileImage.url;
        }
    }
    return null;
};

// Format attachments
const formatAttachments = (attachments) => {
    return (attachments || []).map(att => ({
        url: att.url, // URLs are already absolute via the API proxy
        type: att.mime?.startsWith('image/') ? 'image' : 'file',
        name: att.name,
        mime: att.mime,
        size: att.size
    }));
};

// Format user profile
const formatUserProfile = (userProfile, profileImageUrl) => {
    const fallbackAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${userProfile.id}`;
    const avatar = profileImageUrl || fallbackAvatar;

    return {
        id: userProfile.id,
        documentId: userProfile.documentId || userProfile.id,
        name: userProfile.name || 'Anonymous User',
        username: userProfile.username || userProfile.name || 'Anonymous',
        profileImageUrl: avatar,
        profilePic: avatar,
        avatar: avatar,
        college: userProfile.college || 'Unknown College',
        course: userProfile.course || 'Unknown Course',
        branch: userProfile.branch || 'Unknown Branch',
        year: userProfile.year || '1st Year',
        email: userProfile.email || '',
        isVerified: userProfile.isVerified || false,
        isMentor: userProfile.isMentor || false,
        superMentor: userProfile.superMentor || false,
        eliteMentor: userProfile.eliteMentor || false,
        answeredQueries: userProfile.answeredQueries || 0,
        helpfulAnswers: userProfile.helpfulAnswers || 0,
        views: userProfile.views || userProfile.totalViews || 0,
        queriesPosted: userProfile.queriesPosted || userProfile.queriesAsked || 0,
        engagement: userProfile.engagement || 0
    };
};

// Format query with anonymous user
const formatQueryWithAnonymousUser = (query) => {
    const anonymousAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${query.id}`;

    return {
        id: query.id,
        documentId: query.documentId || query.id,
        title: query.title || 'Untitled Query',
        description: query.description || query.content || '',
        category: query.category || 'General',
        visibility: query.visibility || 'public',
        views: query.viewCount || 0,
        answerCount: query.answerCount || 0,
        createdAt: query.createdAt || new Date().toISOString(),
        updatedAt: query.updatedAt || query.createdAt || new Date().toISOString(),
        attachments: formatAttachments(query.attachments),
        isPersonalQuery: false,
        isSentQuery: false,
        user: {
            id: null,
            documentId: null,
            name: 'Anonymous User',
            username: 'Anonymous',
            profileImageUrl: anonymousAvatar,
            profilePic: anonymousAvatar,
            avatar: anonymousAvatar,
            college: 'Unknown College',
            course: 'Unknown Course',
            branch: 'Unknown Branch',
            year: '1st Year',
            email: '',
            isVerified: false,
            isMentor: false,
            superMentor: false,
            eliteMentor: false,
            answeredQueries: 0,
            helpfulAnswers: 0,
            views: 0,
            queriesPosted: 0,
            engagement: 0
        }
    };
};