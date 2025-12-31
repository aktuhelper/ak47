import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchFromStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper

const PAGE_SIZE = 20;

// Transform Strapi user data
const transformStrapiUser = (user) => {
    const userData = user.attributes || user;

    // Get profile image URL
    let profileImageUrl = null;
    if (userData.profileImage) {
        const profileImage = userData.profileImage.data || userData.profileImage;
        if (profileImage) {
            const imageData = profileImage.attributes || profileImage;
            // ✅ profileImageUrl will be handled by Strapi's response
            profileImageUrl = imageData.url;
        }
    }
    if (!profileImageUrl && userData.profilePic) {
        profileImageUrl = userData.profilePic;
    }

    // Get year badge - Updated to handle Passout
    const yearBadgeMap = {
        "1st Year": "1st-year",
        "2nd Year": "2nd-year",
        "3rd Year": "3rd-year",
        "4th Year": "4th-year",
        "Pass-out": "alumni",
        "Passout": "alumni"
    };

    // Note: isActive will be set to false initially
    // It should be updated via Socket.IO in the parent component
    const isActive = false;

    return {
        id: user.id,
        documentId: user.documentId || user.id,
        name: userData.name || 'Unknown User',
        role: userData.role || 'Senior Student',
        college: userData.college || '',
        course: userData.course || '',
        branch: userData.branch || null,
        year: userData.year || '',
        yearBadge: yearBadgeMap[userData.year] || "3rd-year",
        showYearBadge: true,
        avatar: profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.id}`,
        skills: userData.interests || [],
        isMentor: userData.isMentor || false,
        isActive: isActive,
        isVerified: userData.isVerified || false,
        username: userData.username || '',
        answeredQueries: userData.answeredQueries || 0,
        helpfulAnswers: userData.helpfulAnswers || 0,
        views: userData.views || 0,
        queriesPosted: userData.queriesPosted || 0,
        engagement: userData.engagement || 0,
        superMentor: userData.superMentor || false,
        eliteMentor: userData.eliteMentor || false,
        lastActiveAt: userData.lastActiveAt || null,
    };
};

// Helper function to get senior years based on current user's year
const getSeniorYears = (userYear) => {
    if (!userYear) return [];

    const yearHierarchy = {
        "1st Year": ["2nd Year", "3rd Year", "4th Year", "Pass-out", "Passout"],
        "2nd Year": ["3rd Year", "4th Year", "Pass-out", "Passout"],
        "3rd Year": ["4th Year", "Pass-out", "Passout"],
        "4th Year": ["Pass-out", "Passout"],
        "Pass-out": [],
        "Passout": []
    };

    return yearHierarchy[userYear] || [];
};

export default function useSeniorsFromOtherCollegesFetch({
    strapiUser,
    selectedCourse,
    selectedBranch,
    selectedYear,
    userTypeFilter,
    searchQuery
}) {
    const [seniors, setSeniors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState(null);

    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    // Fetch seniors from other colleges from Strapi - ✅ Using secure wrapper
    const fetchSeniors = useCallback(async (pageNum) => {
        try {
            setIsLoading(true);
            setError(null);


            const params = new URLSearchParams();

            // Pagination
            params.append('pagination[page]', pageNum);
            params.append('pagination[pageSize]', PAGE_SIZE);
            params.append('populate', '*');

            // Exclude current user
            if (strapiUser?.id) {
                params.append('filters[id][$ne]', strapiUser.id);
            }

            // Filter to show only seniors
            const seniorYears = getSeniorYears(strapiUser?.year);
        

            if (seniorYears.length === 0) {
        
                setSeniors([]);
                setTotalCount(0);
                setHasMore(false);
                setIsLoading(false);
                return;
            }

            // Get user's college for exclusion
            const userCollege = strapiUser?.college?.trim() || '';

            // ✅ FIXED: Build filter structure with college exclusion properly nested
            if (searchQuery) {
                // When search is active, use $and to combine all filters

                // Index 0: Year filters
                if (selectedYear && selectedYear !== "All") {
                    // Specific year selected
                    if (selectedYear === "Pass-out" || selectedYear === "Passout") {
                        params.append(`filters[$and][0][$or][0][year][$eq]`, 'Pass-out');
                        params.append(`filters[$and][0][$or][1][year][$eq]`, 'Passout');
                    } else {
                        params.append('filters[$and][0][year][$eq]', selectedYear);
                    }
                } else {
                    // Multiple senior years
                    seniorYears.forEach((year, index) => {
                        params.append(`filters[$and][0][$or][${index}][year][$eq]`, year);
                    });
                }

                // Index 1: Search filters
                params.append('filters[$and][1][$or][0][name][$containsi]', searchQuery);
                params.append('filters[$and][1][$or][1][username][$containsi]', searchQuery);
                params.append('filters[$and][1][$or][2][interests][$containsi]', searchQuery);
                params.append('filters[$and][1][$or][3][college][$containsi]', searchQuery);

                // Index 2: College exclusion (FIXED - moved inside $and)
                if (userCollege) {
                    params.append('filters[$and][2][college][$ne]', userCollege);
                
                }

                // Index 3: Course filter
                if (selectedCourse) {
                    params.append('filters[$and][3][course][$eq]', selectedCourse);
                }

                // Index 4: Branch filter
                if (selectedBranch) {
                    params.append('filters[$and][4][branch][$eq]', selectedBranch);
                }

            } else {
                // No search query - use $and for consistency

                // Index 0: Year filters
                if (selectedYear && selectedYear !== "All") {
                    if (selectedYear === "Pass-out" || selectedYear === "Passout") {
                        params.append('filters[$and][0][$or][0][year][$eq]', 'Pass-out');
                        params.append('filters[$and][0][$or][1][year][$eq]', 'Passout');
                    } else {
                        params.append('filters[$and][0][year][$eq]', selectedYear);
                    }
                } else {
                    seniorYears.forEach((year, index) => {
                        params.append(`filters[$and][0][$or][${index}][year][$eq]`, year);
                    });
                }

                // Index 1: College exclusion (FIXED - moved inside $and)
                if (userCollege) {
                    params.append('filters[$and][1][college][$ne]', userCollege);
                   
                }

                // Index 2: Course filter
                if (selectedCourse) {
                    params.append('filters[$and][2][course][$eq]', selectedCourse);
                }

                // Index 3: Branch filter
                if (selectedBranch) {
                    params.append('filters[$and][3][branch][$eq]', selectedBranch);
                }
            }

            // Sorting
            params.append('sort[0]', 'createdAt:desc');

            // ✅ Use secure wrapper instead of direct fetch
            const endpoint = `user-profiles?${params.toString()}`;
      
          

            const result = await fetchFromStrapi(endpoint);

      

            const transformedData = (result.data || []).map(transformStrapiUser);

            const pagination = result.meta?.pagination || {
                page: 1,
                pageSize: PAGE_SIZE,
                pageCount: 1,
                total: 0
            };

            setTotalCount(pagination.total);

            if (pageNum === 1) {
                setSeniors(transformedData);
            } else {
                setSeniors(prev => [...prev, ...transformedData]);
            }

            setHasMore(pageNum < pagination.pageCount);

        } catch (err) {
            console.error('❌ Error fetching seniors from other colleges:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [selectedCourse, selectedBranch, selectedYear, userTypeFilter, searchQuery, strapiUser]);

    // Fetch data when filters change or page changes
    useEffect(() => {
        if (selectedCourse && strapiUser) {
            fetchSeniors(page);
        }
    }, [page, fetchSeniors, selectedCourse, strapiUser]);

    // Reset pagination when filters change
    const resetPagination = useCallback(() => {
        setPage(1);
        setSeniors([]);
        setHasMore(true);
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        resetPagination();
    }, [selectedCourse, selectedBranch, selectedYear, userTypeFilter, resetPagination]);

    // Search Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            resetPagination();
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery, resetPagination]);

    // Infinite Scroll Observer
    useEffect(() => {
        if (isLoading || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isLoading, hasMore]);

    return {
        seniors,
        isLoading,
        page,
        hasMore,
        totalCount,
        error,
        loadMoreRef,
        resetPagination,
        fetchSeniors
    };
}