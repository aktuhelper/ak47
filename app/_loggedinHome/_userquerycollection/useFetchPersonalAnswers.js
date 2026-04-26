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
            const data = await fetchFromStrapi(
                `personal-query-answers?` +
                `filters[personal_query][documentId]=${personalQueryDocumentId}&` +
                `populate[user_profile][populate][0]=profileImage&` +
                `populate[user_profile][fields][0]=name&populate[user_profile][fields][1]=email&populate[user_profile][fields][2]=documentId&` +
                `populate[voters][populate]=user_profile&` +
                `sort=createdAt:desc`
            );

            const transformedAnswers = data.data?.map(answer => {
                const userProfile = answer.user_profile || {};

                let profileImageUrl = null;
                if (userProfile.profileImage) {
                    if (Array.isArray(userProfile.profileImage) && userProfile.profileImage.length > 0) {
                        profileImageUrl = userProfile.profileImage[0]?.url;
                    } else if (typeof userProfile.profileImage === 'object' && userProfile.profileImage?.url) {
                        profileImageUrl = userProfile.profileImage.url;
                    }
                }
                if (!profileImageUrl) profileImageUrl = '/default-avatar.png';

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
                    isAccepted: answer.isAccepted || false,
                    isRejected: answer.isRejected || false,
                    helpfulCount: answer.helpfulCount || 0,
                    createdAt: answer.createdAt,
                    updatedAt: answer.updatedAt,
                    user_profile: {
                        documentId: userProfile.documentId || 'unknown',
                        id: userProfile.id,
                        name: userProfile.name || 'Unknown User',
                        email: userProfile.email || null,
                        profileImageUrl: profileImageUrl,
                        profilePic: profileImageUrl,
                        isVerified: userProfile.isVerified || false,
                        course: userProfile.course || 'N/A',
                        branch: userProfile.branch || 'N/A',
                        year: userProfile.year || 'N/A',
                        college: userProfile.college || 'N/A',
                        isMentor: userProfile.isMentor || false,
                        superMentor: userProfile.superMentor || false,
                        eliteMentor: userProfile.eliteMentor || false,
                        activeParticipant: userProfile.activeParticipant || false
                    },
                    voters
                };
            }) || [];

            setAnswers(transformedAnswers);
            setAnswerCount(transformedAnswers.length);
            return transformedAnswers;

        } catch (err) {
            console.error('❌ Error fetching personal answers:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ✅ NEW: Optimistic update — instantly reflects accept/reject in UI
    const updateAnswerStatus = (answerDocumentId, status) => {
        setAnswers(prev =>
            prev.map(a =>
                a.documentId === answerDocumentId
                    ? {
                        ...a,
                        isAccepted: status === 'accepted',
                        isRejected: status === 'rejected',
                        // revert to original if status is 'pending'
                        ...(status === 'pending' && { isAccepted: false, isRejected: false }),
                    }
                    : a
            )
        );
    };

    const refreshPersonalAnswers = async () => {
        if (!personalQueryDocumentId) return;
        setRefreshing(true);
        try {
            await fetchPersonalAnswers();
        } catch (err) {
            console.error('❌ Refresh failed:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const checkUserAnswer = (userDocumentId) => {
        if (!userDocumentId || !answers.length) return null;
        return answers.find(a => a.user_profile?.documentId === userDocumentId) || null;
    };

    const getAnswerCount = async () => {
        if (!personalQueryDocumentId) return 0;
        try {
            const data = await fetchFromStrapi(
                `personal-query-answers?filters[personal_query][documentId]=${personalQueryDocumentId}`
            );
            const count = data.data?.length || 0;
            setAnswerCount(count);
            return count;
        } catch (err) {
            console.error('❌ Error fetching answer count:', err);
            return answerCount;
        }
    };

    const hasUserVoted = (answer, voterDocumentId) => {
        if (!answer.voters || !voterDocumentId) return false;
        return answer.voters.some(v => v.documentId === voterDocumentId);
    };

    const getBestAnswer = () => answers.find(a => a.isBestAnswer === true) || null;

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
        if (personalQueryDocumentId) fetchPersonalAnswers();
    }, [personalQueryDocumentId]);

    return {
        answers,
        loading,
        error,
        refreshing,
        answerCount,
        fetchPersonalAnswers,
        refreshPersonalAnswers,
        updateAnswerStatus,   // ✅ exported
        checkUserAnswer,
        getAnswerCount,
        hasUserVoted,
        getBestAnswer,
        sortAnswers,
    };
}