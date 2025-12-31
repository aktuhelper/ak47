// ✅ Secure fetchQueriesByCollege - uses secure API wrapper
import { fetchFromStrapi } from '@/secure/strapi';

// Helper function to convert year text to number
function getYearNumber(yearText) {
    if (!yearText) return null;

    // Direct mapping for all possible formats
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

    // Try with trim if not found
    if (!result && yearText.trim) {
        result = yearMap[yearText.trim()];
    }

    return result || null;
}

export async function fetchQueriesByCollege(userData, filters = {}) {
    const {
        page = 1,
        pageSize = 20,
        sortBy = 'createdAt:desc',
        branch = null,
        course = null,
        category = null,
        search = null
    } = filters;

    const params = new URLSearchParams();

    // Pagination
    params.append('pagination[page]', page);
    params.append('pagination[pageSize]', pageSize);

    // Sort
    params.append('sort[0]', sortBy);

    // Populate
    params.append('populate[user_profile][populate][0]', 'profileImage');
    params.append('populate[answers][populate][user_profile][populate][0]', 'profileImage');
    params.append('populate[attachments]', 'true');

    // ============================================
    // COLLEGE FILTER (Primary scope)
    // ============================================
    params.append('filters[user_profile][college][$eq]', userData.college);

    // ============================================
    // VISIBILITY FILTERS (My College Page Logic)
    // ============================================
    // Condition 1: visibility = "public"
    params.append('filters[$or][0][visibility][$eq]', 'public');

    // Condition 2: visibility = "college"
    params.append('filters[$or][1][visibility][$eq]', 'college');

    // Condition 3: visibility = "branch" AND same branch
    // For courses without branches (MCA, BCA, MBA, BPharm), treat as course-level visibility
    if (userData.branch) {
        // BTech/MTech with branches: Match by branch
        params.append('filters[$or][2][$and][0][visibility][$eq]', 'branch');
        params.append('filters[$or][2][$and][1][user_profile][branch][$eq]', userData.branch);
    } else if (userData.course) {
        // MCA/BCA/MBA/BPharm without branches: Match by course
        params.append('filters[$or][2][$and][0][visibility][$eq]', 'branch');
        params.append('filters[$or][2][$and][1][user_profile][course][$eq]', userData.course);
        params.append('filters[$or][2][$and][2][user_profile][branch][$null]', true);
    }

    // Condition 4: visibility = "seniors" AND user.year > creator.year
    const userYearNumber = getYearNumber(userData.year);

    if (userYearNumber && userYearNumber > 1) {
        const seniorIndex = (userData.branch || userData.course) ? 3 : 2; // Adjust index
        params.append(`filters[$or][${seniorIndex}][$and][0][visibility][$eq]`, 'seniors');

        // Get all junior year strings matching your DB format
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
    // ADDITIONAL FILTERS (Optional)
    // ============================================
    if (branch) {
        params.append('filters[user_profile][branch][$eq]', branch);
    }

    if (course) {
        params.append('filters[user_profile][course][$eq]', course);
    }

    if (category) {
        params.append('filters[category][$eq]', category);
    }

    if (search) {
        params.append('filters[$or][0][title][$containsi]', search);
        params.append('filters[$or][1][description][$containsi]', search);
    }

    const endpoint = `queries?${params.toString()}`;

    try {
   

        // ✅ Use secure wrapper
        const data = await fetchFromStrapi(endpoint);

       

        return data;
    } catch (error) {
    
        throw error;
    }
}