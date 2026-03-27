// ✅ Secure useAnswers hook - all calls go through /api/strapi
import { useState } from 'react';
import { fetchFromStrapi, postToStrapi, updateStrapi } from '@/secure/strapi';

export function useAnswers() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const submitAnswer = async (queryDocumentId, answerText, userDocumentId) => {
        setSubmitting(true);
        setError(null);

        try {
            console.log('🔵 STEP 1: Submitting answer with data:', {
                answerText,
                query: queryDocumentId,
                user_profile: userDocumentId
            });

            // ✅ Use secure wrapper
            const data = await postToStrapi('answers', {
                answerText: answerText,
                query: queryDocumentId,
                user_profile: userDocumentId
            });

            console.log('✅ STEP 2: Answer submitted:', data);

            console.log('🔵 STEP 3: Updating answer count...');
            const newCount = await updateQueryAnswerCount(queryDocumentId);
            console.log('✅ STEP 4: New count returned:', newCount);

            return {
                data,
                newCount,
                success: true
            };
        } catch (err) {
            console.error('❌ Error submitting answer:', err);
            setError(err.message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const updateAnswer = async (answerDocumentId, answerText) => {
        setSubmitting(true);
        setError(null);

        try {
            console.log('🔵 Updating answer:', answerDocumentId);

            // ✅ Use secure wrapper
            const data = await updateStrapi(`answers/${answerDocumentId}`, {
                answerText: answerText
            });

            console.log('✅ Answer updated successfully:', data);

            return {
                data,
                success: true
            };
        } catch (err) {
            console.error('❌ Error updating answer:', err);
            setError(err.message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // ⭐ FIXED: Fetch fresh count helper function
    const fetchFreshAnswerData = async (answerDocumentId) => {
        // ✅ Use secure wrapper
        const data = await fetchFromStrapi(`answers/${answerDocumentId}`);

        return {
            helpfulCount: data.data.helpfulCount ?? 0,
            documentId: data.data.documentId
        };
    };

    // ⭐ IMPROVED: toggleUpvote with proper error handling and fresh count fetching
    const toggleUpvote = async (answerDocumentId, userDocumentId) => {
        setSubmitting(true);
        setError(null);

        try {
            console.log('========================================');
            console.log('🔵 Starting upvote toggle');
            console.log('Answer documentId:', answerDocumentId);
            console.log('User documentId:', userDocumentId);

            // STEP 1: Check for existing vote using documentIds directly
            console.log('🔍 Checking for existing vote...');

            // ✅ Use secure wrapper
            const votersCheckData = await fetchFromStrapi(
                `answers/${answerDocumentId}?populate[voters][populate]=user_profile`
            );

            const existingVoters = votersCheckData.data?.voters || [];

            console.log('📊 Total voters on this answer:', existingVoters.length);

            const existingVote = existingVoters.find(voter =>
                voter.user_profile?.documentId === userDocumentId
            );

            console.log('Vote exists?', existingVote ? 'YES ✅' : 'NO ❌');

            if (existingVote) {
                // ============================================
                // REMOVE VOTE (User is un-voting)
                // ============================================
                console.log('========================================');
                console.log('🔴 REMOVING EXISTING VOTE');
                console.log('Deleting voter record:', existingVote.documentId);

                // ✅ Use secure wrapper - need to import deleteFromStrapi
                const { deleteFromStrapi } = await import('@/secure/strapi');
                await deleteFromStrapi(`voters/${existingVote.documentId}`);

                console.log('✅ Vote deleted successfully');

                // ⭐ FIX: Fetch fresh count after deletion
                const freshData = await fetchFreshAnswerData(answerDocumentId);
                const newCount = Math.max(0, freshData.helpfulCount - 1);

                // Update count in database
                await updateStrapi(`answers/${answerDocumentId}`, {
                    helpfulCount: newCount
                });

                console.log('✅ Count decreased to:', newCount);
                console.log('========================================');
                return { voted: false, newCount };

            } else {
                // ============================================
                // ADD VOTE (User is voting for first time)
                // ============================================
                console.log('========================================');
                console.log('🟢 ADDING NEW VOTE');

                const payload = {
                    answer: answerDocumentId,
                    user_profile: userDocumentId
                };

                console.log('📤 Creating vote with payload:', JSON.stringify(payload, null, 2));

                try {
                    // ✅ Use secure wrapper
                    const createdVote = await postToStrapi('voters', payload);

                    console.log('✅ Vote created successfully:', {
                        voteId: createdVote.data?.id,
                        voteDocId: createdVote.data?.documentId
                    });

                    // ⭐ FIX: Fetch fresh count after creation
                    const freshData = await fetchFreshAnswerData(answerDocumentId);
                    const newCount = freshData.helpfulCount + 1;

                    // Update count in database
                    try {
                        await updateStrapi(`answers/${answerDocumentId}`, {
                            helpfulCount: newCount
                        });
                    } catch (updateError) {
                        // ROLLBACK: Delete the vote we just created
                        console.warn('⚠️ Count update failed, rolling back vote creation...');
                        try {
                            const voteDocId = createdVote.data?.documentId;
                            if (voteDocId) {
                                const { deleteFromStrapi } = await import('@/secure/strapi');
                                await deleteFromStrapi(`voters/${voteDocId}`);
                                console.log('✅ Rollback successful - vote deleted');
                            }
                        } catch (rollbackErr) {
                            console.error('❌ Rollback failed:', rollbackErr);
                        }
                        throw new Error('Failed to update count after creating vote');
                    }

                    console.log('✅ Count increased to:', newCount);
                    console.log('========================================');
                    return { voted: true, newCount };

                } catch (createError) {
                    console.error('❌ Vote creation failed:', createError);

                    // ⭐ FIX: If duplicate error, fetch FRESH count from database
                    if (createError.message?.includes('already voted') ||
                        createError.message?.includes('unique') ||
                        createError.message?.includes('duplicate')) {

                        console.log('⚠️ Duplicate vote detected, fetching FRESH count...');

                        // Fetch the actual current count from database
                        const freshData = await fetchFreshAnswerData(answerDocumentId);
                        console.log('📊 Fresh count from database:', freshData.helpfulCount);

                        return { voted: true, newCount: freshData.helpfulCount };
                    }

                    throw createError;
                }
            }

        } catch (err) {
            console.error('========================================');
            console.error('❌ ERROR:', err.message);
            console.error('========================================');
            setError(err.message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const markBestAnswer = async (answerDocumentId, queryDocumentId) => {
        setSubmitting(true);
        setError(null);

        try {
            console.log('🔵 Marking best answer...');

            // ✅ Use secure wrapper
            const answersData = await fetchFromStrapi(
                `answers?filters[query][documentId]=${queryDocumentId}`
            );

            console.log('🔵 Resetting all best answer flags...');
            await Promise.all(
                answersData.data.map(answer =>
                    updateStrapi(`answers/${answer.documentId}`, {
                        isBestAnswer: false
                    })
                )
            );

            console.log('🔵 Setting new best answer...');
            await updateStrapi(`answers/${answerDocumentId}`, {
                isBestAnswer: true
            });

            console.log('✅ Best answer marked successfully');
            return { success: true };

        } catch (err) {
            console.error('❌ Error marking best answer:', err);
            setError(err.message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const checkUserVote = async (answerDocumentId, userDocumentId) => {
        try {
            // ✅ Use secure wrapper
            const votersCheckData = await fetchFromStrapi(
                `answers/${answerDocumentId}?populate[voters][populate]=user_profile`
            );

            const existingVoters = votersCheckData.data?.voters || [];

            const hasVoted = existingVoters.some(voter =>
                voter.user_profile?.documentId === userDocumentId
            );

            return hasVoted;

        } catch (err) {
            console.error('❌ Error checking vote:', err);
            return false;
        }
    };

    const updateQueryAnswerCount = async (queryDocumentId) => {
        try {
            console.log('🔵 Fetching answers for query:', queryDocumentId);

            await new Promise(resolve => setTimeout(resolve, 500));

            // ✅ Use secure wrapper
            const answersData = await fetchFromStrapi(
                `answers?filters[query][documentId][$eq]=${queryDocumentId}`
            );

            const answerCount = answersData.data?.length || 0;

            console.log('📊 Current answer count from API:', answerCount);

            // ✅ Use secure wrapper
            const updatedQuery = await updateStrapi(`queries/${queryDocumentId}`, {
                answerCount: answerCount
            });

            console.log('✅ Query updated successfully:', updatedQuery);

            return answerCount;
        } catch (err) {
            console.error('❌ Error updating answer count:', err);
            throw err;
        }
    };

    const fetchAnswersForQuery = async (queryDocumentId, currentUserDocumentId = null) => {
        try {
            console.log('🔍 Fetching answers for query documentId:', queryDocumentId);

            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(
                `answers?filters[query][documentId]=${queryDocumentId}&populate[user_profile][populate]=*&populate=query&populate=voters.user_profile&sort=createdAt:desc`
            );

            console.log('📦 Raw API response:', data);
            console.log('📊 Total answers found:', data.data?.length || 0);

            const answersWithVotes = await Promise.all(
                data.data.map(async (answer) => {
                    const answerData = answer;
                    const userProfileData = answerData.user_profile;
                    const userData = userProfileData || {};

                    const profileImageData = userData.profileImage;
                    const profileImageUrl = profileImageData?.url || userData.profilePic;

                    let userHasVoted = false;
                    if (currentUserDocumentId) {
                        userHasVoted = await checkUserVote(answer.documentId, currentUserDocumentId);
                    }

                    return {
                        id: answer.id,
                        documentId: answer.documentId,
                        answerText: answerData.answerText,
                        isAccepted: answerData.isAccepted || false,
                        isBestAnswer: answerData.isBestAnswer || false,
                        helpfulCount: answerData.helpfulCount || 0,
                        userHasVoted: userHasVoted,
                        upvotes: answerData.upvotes || 0,
                        createdAt: answerData.createdAt,
                        user: {
                            name: userData.name || 'Anonymous',
                            profileImageUrl: profileImageUrl,
                            course: userData.course,
                            branch: userData.branch,
                            year: userData.year,
                            college: userData.college,
                            isVerified: userData.isVerified || false,
                            isMentor: userData.isMentor || false,
                            superMentor: userData.superMentor || false,
                            eliteMentor: userData.eliteMentor || false,
                            activeParticipant: userData.activeParticipant || false,
                            documentId: userProfileData?.documentId
                        }
                    };
                })
            );

            return answersWithVotes;
        } catch (err) {
            console.error('❌ Error fetching answers:', err);
            throw err;
        }
    };

    return {
        submitAnswer,
        updateAnswer,
        fetchAnswersForQuery,
        submitting,
        toggleUpvote,
        markBestAnswer,
        checkUserVote,
        error
    };
}