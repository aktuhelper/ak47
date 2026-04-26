// ✅ Secure Vote API - all calls go through /api/strapi
import { fetchFromStrapi, postToStrapi, updateStrapi, deleteFromStrapi } from '@/secure/strapi';

// Helper function to get numeric ID from documentId
const getNumericId = async (contentType, documentId) => {
    console.log(`🔍 Fetching numeric ID for ${contentType} with documentId:`, documentId);

    // ✅ Use secure wrapper
    const result = await fetchFromStrapi(
        `${contentType}?filters[documentId][$eq]=${documentId}`
    );

    const matchedItem = result.data?.find(item => item.documentId === documentId);

    if (!matchedItem) {
        throw new Error(`${contentType} not found with documentId: ${documentId}`);
    }

    console.log(`✅ Found matching ${contentType}:`, {
        id: matchedItem.id,
        documentId: matchedItem.documentId
    });

    return matchedItem.id;
};

// Check if user has voted on a specific answer (using numeric IDs)
const checkUserVoteOnAnswer = async (answerNumericId, userNumericId) => {
    try {
        console.log('🔍 Checking vote for answer:', answerNumericId, 'user:', userNumericId);

        // ✅ Use secure wrapper
        const votersData = await fetchFromStrapi(
            'voters?populate[answer]=*&populate[user_profiles]=*'
        );

        console.log('📊 Total voters fetched:', votersData.data?.length || 0);

        // Find existing vote by matching NUMERIC IDs for BOTH answer AND user
        const existingVote = votersData.data?.find(voter => {
            const voterAnswerId = voter.answer?.id;
            const voterUserProfiles = voter.user_profiles || [];

            // Check if this vote is for the specific answer AND includes this user
            const hasThisUser = voterUserProfiles.some(profile => profile?.id === userNumericId);
            const isForThisAnswer = voterAnswerId === answerNumericId;

            const isMatch = isForThisAnswer && hasThisUser;

            if (isMatch) {
                console.log('✅ FOUND EXISTING VOTE:', {
                    voterDocId: voter.documentId,
                    voterId: voter.id,
                    answerNumericId: voterAnswerId,
                    userNumericId: userNumericId
                });
            }

            return isMatch;
        });

        if (!existingVote) {
            console.log('❌ No existing vote found for answer:', answerNumericId, 'user:', userNumericId);
        }

        return existingVote || null;
    } catch (error) {
        console.error('❌ Error checking vote:', error);
        return null;
    }
};

export const toggleUpvote = async (answerDocumentId, userDocumentId) => {
    try {
        console.log('========================================');
        console.log('🔵 Toggle Upvote Started');
        console.log('Answer documentId:', answerDocumentId);
        console.log('User documentId:', userDocumentId);

        // STEP 1: Convert documentIds to numeric IDs
        const answerNumericId = await getNumericId('answers', answerDocumentId);
        const userNumericId = await getNumericId('user-profiles', userDocumentId);

        console.log('✅ Answer numeric ID:', answerNumericId);
        console.log('✅ User numeric ID:', userNumericId);

        // STEP 2: Check if user already voted on THIS SPECIFIC ANSWER
        const existingVote = await checkUserVoteOnAnswer(answerNumericId, userNumericId);

        // STEP 3: Get current helpfulCount
        const answerData = await fetchFromStrapi(`answers/${answerDocumentId}`);
        const currentCount = answerData.data.helpfulCount || 0;
        console.log('📊 Current helpfulCount:', currentCount);

        if (existingVote) {
            // ============================================
            // REMOVE VOTE (Un-upvote)
            // ============================================
            console.log('🔴 REMOVING VOTE');
            console.log('Deleting voter:', existingVote.documentId);

            // ✅ Use secure wrapper
            await deleteFromStrapi(`voters/${existingVote.documentId}`);

            console.log('✅ Vote deleted successfully');

            // Update count
            const newCount = Math.max(0, currentCount - 1);
            await updateStrapi(`answers/${answerDocumentId}`, {
                helpfulCount: newCount
            });

            console.log('✅ Count decreased to:', newCount);
            console.log('========================================');
            return { voted: false, newCount };

        } else {
            // ============================================
            // ADD VOTE (Upvote)
            // ============================================
            console.log('🟢 ADDING VOTE');

            // Double-check to prevent race conditions
            const doubleCheck = await checkUserVoteOnAnswer(answerNumericId, userNumericId);
            if (doubleCheck) {
                console.log('⚠️ DUPLICATE DETECTED in double-check!');
                throw new Error('You have already voted on this answer');
            }

            // ⭐ CRITICAL: Include BOTH answer AND user_profiles in the voter record
            const payload = {
                answer: answerNumericId,  // Link to the specific answer (numeric ID)
                user_profiles: [userNumericId]  // Link to the user (numeric ID)
            };

            console.log('📤 Creating vote with payload:', JSON.stringify(payload, null, 2));

            // ✅ Use secure wrapper
            let createdVote;
            try {
                createdVote = await postToStrapi('voters', payload);
            } catch (error) {
                console.error('❌ Vote creation failed:', error);

                if (error.message?.includes('unique') ||
                    error.message?.includes('duplicate') ||
                    error.message?.includes('already voted')) {
                    throw new Error('You have already voted on this answer');
                }

                throw new Error(`Failed to create vote: ${error.message || 'Unknown error'}`);
            }

            console.log('✅ Vote created:', {
                voteId: createdVote.data?.id,
                voteDocId: createdVote.data?.documentId
            });

            // Verify the vote was created
            const verifyVote = await checkUserVoteOnAnswer(answerNumericId, userNumericId);
            if (!verifyVote) {
                console.error('⚠️ Vote verification failed!');
                throw new Error('Vote creation verification failed');
            }
            console.log('✅ Vote verified successfully');

            // Update count
            const newCount = currentCount + 1;
            try {
                await updateStrapi(`answers/${answerDocumentId}`, {
                    helpfulCount: newCount
                });
            } catch (updateError) {
                // ROLLBACK: Delete the vote we just created
                console.warn('⚠️ Count update failed, rolling back...');
                try {
                    await deleteFromStrapi(`voters/${createdVote.data?.documentId}`);
                    console.log('✅ Rollback successful');
                } catch (rollbackErr) {
                    console.error('❌ Rollback failed:', rollbackErr);
                }
                throw new Error('Failed to update count');
            }

            console.log('✅ Count increased to:', newCount);
            console.log('========================================');
            return { voted: true, newCount };
        }
    } catch (error) {
        console.error('========================================');
        console.error('❌ ERROR in toggleUpvote:', error.message);
        console.error('========================================');
        throw error;
    }
};

export const markBestAnswer = async (answerDocumentId, queryDocumentId) => {
    try {
        console.log('🔵 Marking best answer...');
        console.log('Answer:', answerDocumentId);
        console.log('Query:', queryDocumentId);

        // First, fetch all answers for this query
        const answersData = await fetchFromStrapi(
            `answers?filters[query][documentId]=${queryDocumentId}`
        );

        console.log('📊 Total answers found:', answersData.data?.length || 0);

        // Reset all isBestAnswer to false
        console.log('🔵 Resetting all best answer flags...');
        await Promise.all(
            answersData.data.map(answer =>
                updateStrapi(`answers/${answer.documentId}`, {
                    isBestAnswer: false
                })
            )
        );

        // Mark the selected answer as best
        console.log('🔵 Setting new best answer...');
        await updateStrapi(`answers/${answerDocumentId}`, {
            isBestAnswer: true
        });

        console.log('✅ Best answer marked successfully');
        return true;
    } catch (error) {
        console.error('❌ Error marking best answer:', error);
        throw error;
    }
};