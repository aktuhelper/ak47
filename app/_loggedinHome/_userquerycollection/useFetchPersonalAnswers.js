// ✅ Secure useFetchPersonalAnswers hook - all calls go through /api/strapi
import { useState, useEffect } from 'react';
import { fetchFromStrapi } from '@/secure/strapi';

export function useFetchPersonalAnswers(personalQueryDocumentId, userData) {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [answerCount, setAnswerCount] = useState(0);

    const fetchPersonalAnswers = async () => {
        if (!personalQueryDocumentId) {
            setLoading(false);
            return;
        }

        try {
 

            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(
                `personal-query-answers?` +
                `filters[personal_query][documentId]=${personalQueryDocumentId}&` +
                `populate[user_profile][populate][0]=profileImage&` +
                `populate[voters][populate]=user_profile&` +
                `sort=createdAt:desc`
            );

           

            // ⭐ IMPROVED: Better data transformation with proper media field handling
            const transformedAnswers = data.data?.map(answer => {
                // Extract user profile data
                const userProfile = answer.user_profile || {};

                // ⭐ Get profile image URL from profileImage field (Strapi Media)
                let profileImageUrl = null;

                // Check profileImage media field from Strapi
                if (userProfile.profileImage) {
                    if (Array.isArray(userProfile.profileImage) && userProfile.profileImage.length > 0) {
                        // Image URLs are already absolute from the API proxy
                        profileImageUrl = userProfile.profileImage[0]?.url;
                    } else if (typeof userProfile.profileImage === 'object' && userProfile.profileImage?.url) {
                        // Image URLs are already absolute from the API proxy
                        profileImageUrl = userProfile.profileImage.url;
                    }
                }

                // Fallback to default avatar if nothing found
                if (!profileImageUrl) {
                    profileImageUrl = '/default-avatar.png';
                }

             

                // Transform voters array
                const voters = (answer.voters || []).map(voter => ({
                    id: voter.id,
                    documentId: voter.documentId,
                    user_profile: voter.user_profile || null
                }));

              

                return {
                    id: answer.id,
                    documentId: answer.documentId,
                    answerText: answer.answerText,
                    isBestAnswer: answer.isBestAnswer || false,
                    helpfulCount: answer.helpfulCount || 0,
                    createdAt: answer.createdAt,
                    updatedAt: answer.updatedAt,
                    // ⭐ Full user profile data
                    user_profile: {
                        documentId: userProfile.documentId || 'unknown',
                        id: userProfile.id,
                        name: userProfile.name || 'Unknown User',
                        // ⭐ Image fields - profileImageUrl contains the resolved URL
                        profileImageUrl: profileImageUrl,  // This is the resolved URL to use in UI
                        profilePic: profileImageUrl,       // Keep for compatibility
                        isVerified: userProfile.isVerified || false,
                        course: userProfile.course || 'N/A',
                        branch: userProfile.branch || 'N/A',
                        year: userProfile.year || 'N/A',
                        college: userProfile.college || 'N/A',
                        // Badge fields
                        isMentor: userProfile.isMentor || false,
                        superMentor: userProfile.superMentor || false,
                        eliteMentor: userProfile.eliteMentor || false,
                        activeParticipant: userProfile.activeParticipant || false
                    },
                    // ⭐ Voters data
                    voters: voters
                };
            }) || [];

            setAnswers(transformedAnswers);
            setAnswerCount(transformedAnswers.length);

            

            return transformedAnswers;
        } catch (err) {
        
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refreshPersonalAnswers = async () => {
        if (!personalQueryDocumentId) return;

        setRefreshing(true);
        try {
            await fetchPersonalAnswers();
           
        } catch (err) {
       
        } finally {
            setRefreshing(false);
        }
    };

    const checkUserAnswer = (userDocumentId) => {
        if (!userDocumentId || !answers.length) return null;

        const userAnswer = answers.find(
            answer => answer.user_profile?.documentId === userDocumentId
        );

   

        return userAnswer || null;
    };

    const getAnswerCount = async () => {
        if (!personalQueryDocumentId) return 0;

        try {
            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(
                `personal-query-answers?filters[personal_query][documentId]=${personalQueryDocumentId}`
            );

            const count = data.data?.length || 0;

            setAnswerCount(count);
            return count;
        } catch (err) {
            console.error('❌ Error fetching answer count:', err);
            return answerCount; // Return cached count
        }
    };

    const hasUserVoted = (answer, voterDocumentId) => {
        if (!answer.voters || !voterDocumentId) return false;

        return answer.voters.some(
            voter => voter.documentId === voterDocumentId
        );
    };

    const getBestAnswer = () => {
        return answers.find(answer => answer.isBestAnswer === true) || null;
    };

    const sortAnswers = (sortType = 'latest') => {
        const sorted = [...answers];

        switch (sortType) {
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            case 'most-helpful':
                return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);

            case 'best-first':
                return sorted.sort((a, b) => {
                    if (a.isBestAnswer && !b.isBestAnswer) return -1;
                    if (!a.isBestAnswer && b.isBestAnswer) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

            case 'latest':
            default:
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    };

    useEffect(() => {
        if (personalQueryDocumentId) {
            fetchPersonalAnswers();
        }
    }, [personalQueryDocumentId]);

    return {
        answers,
        loading,
        error,
        refreshing,
        answerCount,
        fetchPersonalAnswers,
        refreshPersonalAnswers,
        checkUserAnswer,
        getAnswerCount,
        hasUserVoted,
        getBestAnswer,
        sortAnswers
    };
}