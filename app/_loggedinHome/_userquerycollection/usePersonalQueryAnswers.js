// ✅ Secure usePersonalQueryAnswers hook - all calls go through /api/strapi
import { useState } from 'react';
import { fetchFromStrapi, postToStrapi, updateStrapi, deleteFromStrapi } from '@/secure/strapi';

export function usePersonalQueryAnswers() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // ============================================
    // 1. SUBMIT NEW PERSONAL ANSWER
    // ============================================
    const submitPersonalAnswer = async (personalQueryDocumentId, answerText, userDocumentId, querySenderDocumentId) => {
        setSubmitting(true);
        setError(null);

        try {
            // ⭐ VALIDATION: Prevent sender from answering their own query
            if (userDocumentId === querySenderDocumentId) {
                throw new Error('You cannot answer your own query');
            }

           

            // ✅ Use secure wrapper
            const data = await postToStrapi('personal-query-answers', {
                answerText: answerText,
                personal_query: personalQueryDocumentId,
                user_profile: userDocumentId,
                isBestAnswer: false,
                helpfulCount: 0
            });



            const newCount = await getPersonalAnswerCount(personalQueryDocumentId);
      

            return {
                data,
                newCount,
                success: true
            };
        } catch (err) {
            console.error('❌ Error submitting personal answer:', err);
            setError(err.message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================
    // 2. UPDATE EXISTING PERSONAL ANSWER
    // ============================================
    const updatePersonalAnswer = async (answerDocumentId, answerText, userDocumentId, answerAuthorDocumentId) => {
        setSubmitting(true);
        setError(null);

        try {
            // ⭐ VALIDATION: Only answer author can update
            if (userDocumentId !== answerAuthorDocumentId) {
                throw new Error('You can only edit your own answers');
            }

        

            // ✅ Use secure wrapper
            const data = await updateStrapi(`personal-query-answers/${answerDocumentId}`, {
                answerText: answerText
            });

          

            return {
                data,
                success: true
            };
        } catch (err) {
            console.error('❌ Error updating personal answer:', err);
            setError(err.message);
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // ============================================
    // 3. DELETE PERSONAL ANSWER
    // ============================================
    const deletePersonalAnswer = async (answerDocumentId, userDocumentId, answerAuthorDocumentId, querySenderDocumentId) => {
        try {
            // ⭐ VALIDATION: Only answer author or query sender can delete
            if (userDocumentId !== answerAuthorDocumentId && userDocumentId !== querySenderDocumentId) {
                throw new Error('You can only delete your own answers or answers to your query');
            }



            // ✅ Use secure wrapper
            await deleteFromStrapi(`personal-query-answers/${answerDocumentId}`);

     
            return true;
        } catch (err) {
            console.error('❌ Error deleting personal answer:', err);
            throw err;
        }
    };

    // ============================================
    // 4. GET ANSWER COUNT
    // ============================================
    const getPersonalAnswerCount = async (personalQueryDocumentId) => {
        try {
            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(
                `personal-query-answers?filters[personal_query][documentId]=${personalQueryDocumentId}`
            );

            const count = data.data?.length || 0;


            return count;
        } catch (err) {
            console.error('❌ Error fetching personal answer count:', err);
            return 0;
        }
    };

    // ============================================
    // 5. MARK AS BEST ANSWER
    // ============================================
    const markAsBestAnswer = async (answerDocumentId, personalQueryDocumentId, userDocumentId, querySenderDocumentId, answerAuthorDocumentId) => {
        try {
            // ⭐ VALIDATION: Only query SENDER can mark best answer (they asked the question)
            if (userDocumentId !== querySenderDocumentId) {
                throw new Error('Only the query sender can mark best answers');
            }

            // ⭐ VALIDATION: Sender cannot mark their own answer as best
            if (answerAuthorDocumentId === querySenderDocumentId) {
                throw new Error('You cannot mark your own answer as best');
            }

   

            // First, unmark all other answers for this query
            const allAnswersData = await fetchFromStrapi(
                `personal-query-answers?filters[personal_query][documentId]=${personalQueryDocumentId}&filters[isBestAnswer][$eq]=true`
            );

            // Unmark previous best answers
            const unmarking = (allAnswersData.data || [])
                .filter(answer => answer.documentId !== answerDocumentId)
                .map(answer =>
                    updateStrapi(`personal-query-answers/${answer.documentId}`, {
                        isBestAnswer: false
                    })
                );

            await Promise.all(unmarking);

            // Mark the new best answer
            await updateStrapi(`personal-query-answers/${answerDocumentId}`, {
                isBestAnswer: true
            });

            return true;
        } catch (err) {
            console.error('❌ Error marking best answer:', err);
            throw err;
        }
    };

    // ============================================
    // 6. UNMARK BEST ANSWER
    // ============================================
    const unmarkBestAnswer = async (answerDocumentId, userDocumentId, querySenderDocumentId) => {
        try {
            // ⭐ VALIDATION: Only query SENDER can unmark best answer
            if (userDocumentId !== querySenderDocumentId) {
                throw new Error('Only the query sender can unmark best answers');
            }

        

            // ✅ Use secure wrapper
            await updateStrapi(`personal-query-answers/${answerDocumentId}`, {
                isBestAnswer: false
            });

            
            return true;
        } catch (err) {
            console.error('❌ Error unmarking best answer:', err);
            throw err;
        }
    };

    return {
        submitPersonalAnswer,
        updatePersonalAnswer,
        deletePersonalAnswer,
        getPersonalAnswerCount,
        markAsBestAnswer,
        unmarkBestAnswer,
        submitting,
        error
    };
}