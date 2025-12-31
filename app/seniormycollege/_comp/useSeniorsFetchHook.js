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

export default function useSeniorsFetch({
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

    // Fetch seniors from Strapi - ✅ Using secure wrapper
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

            // Filter by same college only
            if (strapiUser?.college) {
                params.append('filters[college][$eq]', strapiUser.college);
               
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

            // Filter by senior years - Handle both "Pass-out" and "Passout"
            if (selectedYear && selectedYear !== "All") {
                // Normalize the selected year to match both variants
                if (selectedYear === "Pass-out" || selectedYear === "Passout") {
                    // Search for both "Pass-out" and "Passout"
                    params.append('filters[$or][0][year][$eq]', 'Pass-out');
                    params.append('filters[$or][1][year][$eq]', 'Passout');
                 
                } else {
                    params.append('filters[year][$eq]', selectedYear);
                 
                }
            } else {
                // Use $or for multiple years at root level
                seniorYears.forEach((year, index) => {
                    params.append(`filters[$or][${index}][year][$eq]`, year);
                });
            }

            // Filter by course
            if (selectedCourse) {
                params.append('filters[course][$eq]', selectedCourse);
             
            }

            // Filter by branch
            if (selectedBranch) {
                params.append('filters[branch][$eq]', selectedBranch);
             
            }

            // Note: Mentor filtering (all types) will be done on client-side
            // since we need to include isMentor, superMentor, and eliteMentor
            // and complex nested $or queries can conflict with year $or filter

            // Search functionality
            if (searchQuery) {
                params.append('filters[$or][0][name][$containsi]', searchQuery);
                params.append('filters[$or][1][username][$containsi]', searchQuery);
                params.append('filters[$or][2][interests][$containsi]', searchQuery);
              
            }

            // Sorting
            // Note: Server-side sorting by answeredQueries/helpfulAnswers not available
            // Will sort on client-side after fetching
            params.append('sort[0]', 'createdAt:desc');

            // ✅ Use secure wrapper instead of direct fetch
            const endpoint = `user-profiles?${params.toString()}`;
            

            const result = await fetchFromStrapi(endpoint);

            

            const transformedData = (result.data || []).map(transformStrapiUser);

            // ✅ CLIENT-SIDE FILTERING (mentors done in parent component)
            const filteredData = transformedData;

            // Note: All filtering is done in the parent component after Socket.IO
            // updates the isActive status and mentor badges are evaluated

            const pagination = result.meta?.pagination || {
                page: 1,
                pageSize: PAGE_SIZE,
                pageCount: 1,
                total: 0
            };

            setTotalCount(pagination.total);

            if (pageNum === 1) {
                setSeniors(filteredData);
            } else {
                setSeniors(prev => [...prev, ...filteredData]);
            }

            setHasMore(pageNum < pagination.pageCount);

        } catch (err) {
          
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