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

    const fetchQueries = useCallback(async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();

            params.append('pagination[page]', pageNum);
            params.append('pagination[pageSize]', PAGE_SIZE);
            params.append('sort[0]', 'createdAt:desc');
            params.append('populate[user_profile][populate][0]', 'profileImage');
            params.append('populate[answers][populate][user_profile][populate][0]', 'profileImage');
            params.append('populate[attachments]', 'true');

            if (userData && userData.college) {
                params.append('filters[$or][0][visibility][$eq]', 'public');
                params.append('filters[$or][1][$and][0][visibility][$eq]', 'college');
                params.append('filters[$or][1][$and][1][user_profile][college][$eq]', userData.college);

                if (userData.branch) {
                    params.append('filters[$or][2][$and][0][visibility][$eq]', 'branch');
                    params.append('filters[$or][2][$and][1][user_profile][college][$eq]', userData.college);
                    params.append('filters[$or][2][$and][2][user_profile][branch][$eq]', userData.branch);
                } else if (userData.course) {
                    params.append('filters[$or][2][$and][0][visibility][$eq]', 'branch');
                    params.append('filters[$or][2][$and][1][user_profile][college][$eq]', userData.college);
                    params.append('filters[$or][2][$and][2][user_profile][course][$eq]', userData.course);
                    params.append('filters[$or][2][$and][3][user_profile][branch][$null]', true);
                }

                const userYearNumber = getYearNumber(userData.year);

                if (userYearNumber && userYearNumber > 1) {
                    const seniorIndex = (userData.branch || userData.course) ? 3 : 2;
                    params.append(`filters[$or][${seniorIndex}][$and][0][visibility][$eq]`, 'seniors');
                    params.append(`filters[$or][${seniorIndex}][$and][1][user_profile][college][$eq]`, userData.college);

                    const juniorYears = [];
                    for (let i = 1; i < userYearNumber; i++) {
                        if (i === 1) juniorYears.push('1st Year', '1st', '1');
                        else if (i === 2) juniorYears.push('2nd Year', '2nd', '2');
                        else if (i === 3) juniorYears.push('3rd Year', '3rd', '3');
                        else juniorYears.push('4th Year', '4th', '4');
                    }

                    juniorYears.forEach((year, index) => {
                        params.append(`filters[$or][${seniorIndex}][$and][2][$or][${index}][user_profile][year][$eq]`, year);
                    });
                }
            } else {
                params.append('filters[visibility][$eq]', 'public');
            }

            const queryString = params.toString();
            const endpoint = `queries?${queryString}`;
            const data = await fetchFromStrapi(endpoint);

            const formattedQueries = (data.data || []).map(query => {
                const userProfile = query.user_profile;

                if (!userProfile) {
                    return formatQueryWithAnonymousUser(query);
                }

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

            if (append) {
                setPublicQueries(prev => [...prev, ...formattedQueries]);
            } else {
                setPublicQueries(formattedQueries);
            }

            const pagination = data.meta?.pagination;
            setPage(pagination?.page || 1);
            setTotalPages(pagination?.pageCount || 0);
            setHasMore((pagination?.page || 1) < (pagination?.pageCount || 0));

            return formattedQueries;

        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [publicQueries.length, userData]);

    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;
        fetchQueries(page + 1, true);
    }, [loading, hasMore, page, fetchQueries]);

    const incrementViewCount = useCallback(async (queryDocumentId, userId) => {
        try {
            const endpoint = `/api/queries/${queryDocumentId}/increment-view`;
            const responseData = await postToStrapi(endpoint, {
                userId: userId || null
            });

            const { viewCount } = responseData.data;

            setPublicQueries(prev =>
                prev.map(q =>
                    q.documentId === queryDocumentId
                        ? { ...q, views: viewCount }
                        : q
                )
            );

            return { success: true, viewCount };
        } catch (err) {
            return { success: false };
        }
    }, []);

    const updateQuery = useCallback((queryDocumentId, updates) => {
        setPublicQueries(prev =>
            prev.map(q =>
                q.documentId === queryDocumentId
                    ? { ...q, ...updates }
                    : q
            )
        );
    }, []);

    const refreshQueries = useCallback(async () => {
        setPage(1);
        setHasMore(true);
        return await fetchQueries(1, false);
    }, [fetchQueries]);

    const lastQueryRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
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
            return profileImage.url;
        }
    }
    return null;
};

const formatAttachments = (attachments) => {
    return (attachments || []).map(att => ({
        url: att.url,
        type: att.mime?.startsWith('image/') ? 'image' : 'file',
        name: att.name,
        mime: att.mime,
        size: att.size
    }));
};

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