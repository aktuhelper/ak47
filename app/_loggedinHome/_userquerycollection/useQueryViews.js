// ✅ Secure useQueryViews hook - all calls go through /api/strapi
import { useState } from 'react';
import { fetchFromStrapi, postToStrapi, updateStrapi, deleteFromStrapi } from '@/secure/strapi';

export function useQueryViews() {
    const [tracking, setTracking] = useState(false);
    const [error, setError] = useState(null);

    // ⭐ Track view for a query
    const trackQueryView = async (queryDocumentId, userDocumentId) => {
        setTracking(true);
        setError(null);

        try {
            console.log('========================================');
            console.log('👁️ Starting view tracking');
            console.log('Query documentId:', queryDocumentId);
            console.log('User documentId:', userDocumentId);

            // STEP 1: Check if user already viewed this query
            console.log('🔍 Checking for existing view...');

            // ✅ Use secure wrapper
            const existingViewData = await fetchFromStrapi(
                `query-views?filters[query][documentId][$eq]=${queryDocumentId}&filters[user_profile][documentId][$eq]=${userDocumentId}`
            );

            if (existingViewData.data && existingViewData.data.length > 0) {
                console.log('ℹ️ User already viewed this query - not counting again');
                console.log('========================================');
                return { alreadyViewed: true, counted: false };
            }

            console.log('✅ First time view - creating record...');

            // STEP 2: Create new view record
            let createdView;
            try {
                // ✅ Use secure wrapper
                createdView = await postToStrapi('query-views', {
                    query: queryDocumentId,
                    user_profile: userDocumentId
                });

                console.log('✅ View record created:', createdView.data?.id);
            } catch (createError) {
                console.error('❌ Failed to create view record:', createError);
                throw new Error('Failed to create view record');
            }

            // STEP 3: Get current view count
            console.log('🔍 Fetching current view count...');

            // ✅ Use secure wrapper
            const queryData = await fetchFromStrapi(`queries/${queryDocumentId}`);

            const currentViews = queryData.data.viewCount || 0;
            const newViewCount = currentViews + 1;

            console.log('📊 Current views:', currentViews);
            console.log('📊 New view count:', newViewCount);

            // STEP 4: Increment viewCount on the query
            try {
                // ✅ Use secure wrapper
                await updateStrapi(`queries/${queryDocumentId}`, {
                    viewCount: newViewCount
                });

                console.log('✅ View count updated successfully');
            } catch (updateError) {
                // ROLLBACK: Delete the view record we just created
                console.warn('⚠️ Count update failed, rolling back view record...');
                const viewDocId = createdView.data?.documentId;
                if (viewDocId) {
                    try {
                        await deleteFromStrapi(`query-views/${viewDocId}`);
                        console.log('✅ Rollback successful - view record deleted');
                    } catch (rollbackError) {
                        console.error('❌ Rollback failed:', rollbackError);
                    }
                }
                throw new Error('Failed to update view count');
            }

            console.log('========================================');

            return {
                alreadyViewed: false,
                counted: true,
                newViewCount
            };

        } catch (err) {
            console.error('========================================');
            console.error('❌ ERROR:', err.message);
            console.error('========================================');
            setError(err.message);
            return { error: err.message, counted: false };
        } finally {
            setTracking(false);
        }
    };

    return {
        trackQueryView,
        tracking,
        error
    };
}