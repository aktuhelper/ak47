// ✅ Secure useQueryViews hook - all calls go through /api/strapi
import { useState } from 'react';
import { fetchFromStrapi, postToStrapi, updateStrapi, deleteFromStrapi } from '@/secure/strapi';

export function useQueryViews() {
    const [tracking, setTracking] = useState(false);
    const [error, setError] = useState(null);

    const trackQueryView = async (queryDocumentId, userDocumentId) => {
        setTracking(true);
        setError(null);

        try {
            const existingViewData = await fetchFromStrapi(
                `query-views?filters[query][documentId][$eq]=${queryDocumentId}&filters[user_profile][documentId][$eq]=${userDocumentId}`
            );

            if (existingViewData.data && existingViewData.data.length > 0) {
                return { alreadyViewed: true, counted: false };
            }

            let createdView;
            try {
                createdView = await postToStrapi('query-views', {
                    query: queryDocumentId,
                    user_profile: userDocumentId
                });
            } catch (createError) {
                throw new Error('Failed to create view record');
            }

            const queryData = await fetchFromStrapi(`queries/${queryDocumentId}`);

            const currentViews = queryData.data.viewCount || 0;
            const newViewCount = currentViews + 1;

            try {
                await updateStrapi(`queries/${queryDocumentId}`, {
                    viewCount: newViewCount
                });
            } catch (updateError) {
                const viewDocId = createdView.data?.documentId;
                if (viewDocId) {
                    try {
                        await deleteFromStrapi(`query-views/${viewDocId}`);
                    } catch (rollbackError) {
                        // Rollback failed silently
                    }
                }
                throw new Error('Failed to update view count');
            }

            return {
                alreadyViewed: false,
                counted: true,
                newViewCount
            };

        } catch (err) {
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