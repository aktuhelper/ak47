// ✅ Secure Vote API - all calls go through /api/strapi
import { fetchFromStrapi, postToStrapi, updateStrapi, deleteFromStrapi } from '@/secure/strapi';

// Helper function to get numeric ID from documentId
const getNumericId = async (contentType, documentId) => {
    const result = await fetchFromStrapi(
        `${contentType}?filters[documentId][$eq]=${documentId}`
    );

    const matchedItem = result.data?.find(item => item.documentId === documentId);

    if (!matchedItem) {
        throw new Error(`${contentType} not found with documentId: ${documentId}`);
    }

    return matchedItem.id;
};

// Check if user has voted on a specific answer (using numeric IDs)
const checkUserVoteOnAnswer = async (answerNumericId, userNumericId) => {
    try {
        const votersData = await fetchFromStrapi(
            'voters?populate[answer]=*&populate[user_profiles]=*'
        );

        const existingVote = votersData.data?.find(voter => {
            const voterAnswerId = voter.answer?.id;
            const voterUserProfiles = voter.user_profiles || [];

            const hasThisUser = voterUserProfiles.some(profile => profile?.id === userNumericId);
            const isForThisAnswer = voterAnswerId === answerNumericId;

            return isForThisAnswer && hasThisUser;
        });

        return existingVote || null;
    } catch (error) {
        return null;
    }
};

export const toggleUpvote = async (answerDocumentId, userDocumentId) => {
    try {
        const answerNumericId = await getNumericId('answers', answerDocumentId);
        const userNumericId = await getNumericId('user-profiles', userDocumentId);

        const existingVote = await checkUserVoteOnAnswer(answerNumericId, userNumericId);

        const answerData = await fetchFromStrapi(`answers/${answerDocumentId}`);
        const currentCount = answerData.data.helpfulCount || 0;

        if (existingVote) {
            await deleteFromStrapi(`voters/${existingVote.documentId}`);

            const newCount = Math.max(0, currentCount - 1);
            await updateStrapi(`answers/${answerDocumentId}`, {
                helpfulCount: newCount
            });

            return { voted: false, newCount };

        } else {
            const doubleCheck = await checkUserVoteOnAnswer(answerNumericId, userNumericId);
            if (doubleCheck) {
                throw new Error('You have already voted on this answer');
            }

            const payload = {
                answer: answerNumericId,
                user_profiles: [userNumericId]
            };

            let createdVote;
            try {
                createdVote = await postToStrapi('voters', payload);
            } catch (error) {
                if (error.message?.includes('unique') ||
                    error.message?.includes('duplicate') ||
                    error.message?.includes('already voted')) {
                    throw new Error('You have already voted on this answer');
                }

                throw new Error(`Failed to create vote: ${error.message || 'Unknown error'}`);
            }

            const verifyVote = await checkUserVoteOnAnswer(answerNumericId, userNumericId);
            if (!verifyVote) {
                throw new Error('Vote creation verification failed');
            }

            const newCount = currentCount + 1;
            try {
                await updateStrapi(`answers/${answerDocumentId}`, {
                    helpfulCount: newCount
                });
            } catch (updateError) {
                try {
                    await deleteFromStrapi(`voters/${createdVote.data?.documentId}`);
                } catch (rollbackErr) {
                    // Rollback failed silently
                }
                throw new Error('Failed to update count');
            }

            return { voted: true, newCount };
        }
    } catch (error) {
        throw error;
    }
};

export const markBestAnswer = async (answerDocumentId, queryDocumentId) => {
    try {
        const answersData = await fetchFromStrapi(
            `answers?filters[query][documentId]=${queryDocumentId}`
        );

        await Promise.all(
            answersData.data.map(answer =>
                updateStrapi(`answers/${answer.documentId}`, {
                    isBestAnswer: false
                })
            )
        );

        await updateStrapi(`answers/${answerDocumentId}`, {
            isBestAnswer: true
        });

        return true;
    } catch (error) {
        throw error;
    }
};