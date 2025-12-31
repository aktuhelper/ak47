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
         

            // ✅ Use secure wrapper
            const data = await postToStrapi('answers', {
                answerText: answerText,
                query: queryDocumentId,
                user_profile: userDocumentId
            });

           

        
            const newCount = await updateQueryAnswerCount(queryDocumentId);
          

            return {
                data,
                newCount,
                success: true
            };
        } catch (err) {
     
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
         

            // ✅ Use secure wrapper
            const data = await updateStrapi(`answers/${answerDocumentId}`, {
                answerText: answerText
            });



            return {
                data,
                success: true
            };
        } catch (err) {
    
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
         
            // STEP 1: Check for existing vote using documentIds directly
       

            // ✅ Use secure wrapper
            const votersCheckData = await fetchFromStrapi(
                `answers/${answerDocumentId}?populate[voters][populate]=user_profile`
            );

            const existingVoters = votersCheckData.data?.voters || [];

          

            const existingVote = existingVoters.find(voter =>
                voter.user_profile?.documentId === userDocumentId
            );

           

            if (existingVote) {
                // ============================================
          ;

                // ✅ Use secure wrapper - need to import deleteFromStrapi
                const { deleteFromStrapi } = await import('@/secure/strapi');
                await deleteFromStrapi(`voters/${existingVote.documentId}`);

          

                // ⭐ FIX: Fetch fresh count after deletion
                const freshData = await fetchFreshAnswerData(answerDocumentId);
                const newCount = Math.max(0, freshData.helpfulCount - 1);

                // Update count in database
                await updateStrapi(`answers/${answerDocumentId}`, {
                    helpfulCount: newCount
                });

            
                return { voted: false, newCount };

            } else {
       

                const payload = {
                    answer: answerDocumentId,
                    user_profile: userDocumentId
                };

               

                try {
                    // ✅ Use secure wrapper
                    const createdVote = await postToStrapi('voters', payload);

              

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
                   
                        try {
                            const voteDocId = createdVote.data?.documentId;
                            if (voteDocId) {
                                const { deleteFromStrapi } = await import('@/secure/strapi');
                                await deleteFromStrapi(`voters/${voteDocId}`);
                              
                            }
                        } catch (rollbackErr) {
                            
                        }
                        throw new Error('Failed to update count after creating vote');
                    }

                 
                    return { voted: true, newCount };

                } catch (createError) {
                    console.error('❌ Vote creation failed:', createError);

                    // ⭐ FIX: If duplicate error, fetch FRESH count from database
                    if (createError.message?.includes('already voted') ||
                        createError.message?.includes('unique') ||
                        createError.message?.includes('duplicate')) {

                      

                        // Fetch the actual current count from database
                        const freshData = await fetchFreshAnswerData(answerDocumentId);
                

                        return { voted: true, newCount: freshData.helpfulCount };
                    }

                    throw createError;
                }
            }

        } catch (err) {
       
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
            

            // ✅ Use secure wrapper
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

          
            return { success: true };

        } catch (err) {
       
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

            return false;
        }
    };

    const updateQueryAnswerCount = async (queryDocumentId) => {
        try {
           

            await new Promise(resolve => setTimeout(resolve, 500));

            // ✅ Use secure wrapper
            const answersData = await fetchFromStrapi(
                `answers?filters[query][documentId][$eq]=${queryDocumentId}`
            );

            const answerCount = answersData.data?.length || 0;

          

            // ✅ Use secure wrapper
            const updatedQuery = await updateStrapi(`queries/${queryDocumentId}`, {
                answerCount: answerCount
            });

         

            return answerCount;
        } catch (err) {
         
            throw err;
        }
    };

    const fetchAnswersForQuery = async (queryDocumentId, currentUserDocumentId = null) => {
        try {
          

            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(
                `answers?filters[query][documentId]=${queryDocumentId}&populate[user_profile][populate]=*&populate=query&populate=voters.user_profile&sort=createdAt:desc`
            );

     

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