// ✅ Secure usePersonalQueries hook - all calls go through /api/strapi
import { useState, useEffect, useCallback } from 'react';
import { fetchFromStrapi, updateStrapi } from '@/secure/strapi';

export function usePersonalQueries(userData) {
    const [personalQueries, setPersonalQueries] = useState([]); // Received
    const [sentQueries, setSentQueries] = useState([]); // Sent
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch personal queries RECEIVED by current user
    const fetchPersonalQueries = async () => {
        try {
            const endpoint = `personal-queries?filters[toUser][documentId]=${userData.documentId}&populate[fromUser][populate][0]=profileImage&populate[toUser][populate][0]=profileImage&populate=attachment&sort=createdAt:desc`;
       

            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(endpoint);

          

            // Transform to match query format
            const transformed = data.data?.map(pq => {
                const senderUser = pq.fromUser || {};
                const receiverUser = pq.toUser || {};

                // ⭐ Get sender's profile image URL - try profilePic first, then profileImage
                let senderProfileImageUrl = null;

                // Priority 1: Check profilePic text field (direct URL)
                if (senderUser.profilePic && typeof senderUser.profilePic === 'string') {
                    senderProfileImageUrl = senderUser.profilePic;
                }

                // Priority 2: Check profileImage media field
                if (!senderProfileImageUrl && senderUser.profileImage) {
                    if (Array.isArray(senderUser.profileImage) && senderUser.profileImage.length > 0) {
                        // URLs are already absolute from the API proxy
                        senderProfileImageUrl = senderUser.profileImage[0]?.url;
                    } else if (typeof senderUser.profileImage === 'object' && senderUser.profileImage?.url) {
                        // URLs are already absolute from the API proxy
                        senderProfileImageUrl = senderUser.profileImage.url;
                    }
                }

                // Fallback to default avatar if nothing found
                if (!senderProfileImageUrl) {
                    senderProfileImageUrl = '/default-avatar.png';
                }

                // ⭐ Get attachment URL correctly
                let attachmentUrl = null;
                if (pq.attachment) {
                    if (typeof pq.attachment === 'object' && pq.attachment.url) {
                        // URLs are already absolute from the API proxy
                        attachmentUrl = pq.attachment.url;
                    } else if (typeof pq.attachment === 'string') {
                        attachmentUrl = pq.attachment;
                    }
                }

                // ✅ Check both isNew and readAt fields
                const isQueryNew = pq.isNew === true && !pq.readAt;

                return {
                    id: pq.id,
                    documentId: pq.documentId,
                    title: pq.title,
                    description: pq.description,
                    category: pq.category,
                    isNew: isQueryNew,
                    readAt: pq.readAt,
                    createdAt: pq.createdAt,
                    answerCount: 0,
                    views: 0,
                    isPersonalQuery: true,
                    fromUser: senderUser,
                    toUser: receiverUser,
                    attachmentUrl: attachmentUrl,
                    attachment: pq.attachment,
                    user: {
                        documentId: senderUser.documentId || 'unknown',
                        name: senderUser.name || 'Unknown User',
                        profileImageUrl: senderProfileImageUrl,
                        profilePic: senderProfileImageUrl,
                        isVerified: senderUser.isVerified || false,
                        course: senderUser.course || 'N/A',
                        branch: senderUser.branch || 'N/A',
                        year: senderUser.year || 'N/A',
                        college: senderUser.college || 'N/A',
                        ...senderUser
                    },
                    attachments: attachmentUrl ? [{
                        url: attachmentUrl,
                        type: attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'document',
                        name: pq.attachment?.name || attachmentUrl.split('/').pop(),
                        mime: pq.attachment?.mime || null,
                        size: pq.attachment?.size || null
                    }] : []
                };
            }) || [];

            setPersonalQueries(transformed);
            
            return transformed;
        } catch (err) {
            console.error('❌ Failed to fetch personal queries:', err);
            throw err;
        }
    };

    // Fetch personal queries SENT by current user
    const fetchSentQueries = async () => {
        try {
            const endpoint = `personal-queries?filters[fromUser][documentId]=${userData.documentId}&populate[fromUser][populate][0]=profileImage&populate[toUser][populate][0]=profileImage&populate=attachment&sort=createdAt:desc`;
          

            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(endpoint);


            // Transform to match query format
            const transformed = data.data?.map(pq => {
                const receiverUser = pq.toUser || {};
                const senderUser = pq.fromUser || {};

                // ⭐ Get receiver's profile image URL - try profilePic first, then profileImage
                let receiverProfileImageUrl = null;

                // Priority 1: Check profilePic text field (direct URL)
                if (receiverUser.profilePic && typeof receiverUser.profilePic === 'string') {
                    receiverProfileImageUrl = receiverUser.profilePic;
                }

                // Priority 2: Check profileImage media field
                if (!receiverProfileImageUrl && receiverUser.profileImage) {
                    if (Array.isArray(receiverUser.profileImage) && receiverUser.profileImage.length > 0) {
                        // URLs are already absolute from the API proxy
                        receiverProfileImageUrl = receiverUser.profileImage[0]?.url;
                    } else if (typeof receiverUser.profileImage === 'object' && receiverUser.profileImage?.url) {
                        // URLs are already absolute from the API proxy
                        receiverProfileImageUrl = receiverUser.profileImage.url;
                    }
                }

                // Fallback to default avatar if nothing found
                if (!receiverProfileImageUrl) {
                    receiverProfileImageUrl = '/default-avatar.png';
                }

                // ⭐ Get attachment URL correctly
                let attachmentUrl = null;
                if (pq.attachment) {
                    if (typeof pq.attachment === 'object' && pq.attachment.url) {
                        // URLs are already absolute from the API proxy
                        attachmentUrl = pq.attachment.url;
                    } else if (typeof pq.attachment === 'string') {
                        attachmentUrl = pq.attachment;
                    }
                }

                return {
                    id: pq.id,
                    documentId: pq.documentId,
                    title: pq.title,
                    description: pq.description,
                    category: pq.category,
                    createdAt: pq.createdAt,
                    answerCount: 0,
                    views: 0,
                    isSentQuery: true,
                    fromUser: senderUser,
                    toUser: receiverUser,
                    attachmentUrl: attachmentUrl,
                    attachment: pq.attachment,
                    user: {
                        documentId: receiverUser.documentId || 'unknown',
                        name: receiverUser.name || 'Unknown User',
                        profileImageUrl: receiverProfileImageUrl,
                        profilePic: receiverProfileImageUrl,
                        isVerified: receiverUser.isVerified || false,
                        course: receiverUser.course || 'N/A',
                        branch: receiverUser.branch || 'N/A',
                        year: receiverUser.year || 'N/A',
                        college: receiverUser.college || 'N/A',
                        ...receiverUser
                    },
                    attachments: attachmentUrl ? [{
                        url: attachmentUrl,
                        type: attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'document',
                        name: pq.attachment?.name || attachmentUrl.split('/').pop(),
                        mime: pq.attachment?.mime || null,
                        size: pq.attachment?.size || null
                    }] : []
                };
            }) || [];

            setSentQueries(transformed);
           
           
            return transformed;
        } catch (err) {
            console.error('❌ Failed to fetch sent queries:', err);
            throw err;
        }
    };

    // Fetch both on mount
    const fetchAllPersonalQueries = async () => {
        if (!userData?.documentId) {
        
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await Promise.all([
                fetchPersonalQueries(),
                fetchSentQueries()
            ]);
        } catch (err) {
     
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Refresh function
    const refreshPersonalQueries = async () => {
        if (!userData?.documentId) {
       
            return;
        }

        setRefreshing(true);
        try {
            await Promise.all([
                fetchPersonalQueries(),
                fetchSentQueries()
            ]);
        } catch (err) {
            console.error('❌ Refresh failed:', err);
        } finally {
            setRefreshing(false);
        }
    };

    // Mark personal query as read
    const markAsRead = async (queryDocumentId) => {
        try {
            

            // ✅ Use secure wrapper
            const updatedData = await updateStrapi(`personal-queries/${queryDocumentId}`, {
                isNew: false,
                readAt: new Date().toISOString()
            });


            // Update local state
            setPersonalQueries(prev =>
                prev.map(q =>
                    q.documentId === queryDocumentId
                        ? { ...q, isNew: false, readAt: new Date().toISOString() }
                        : q
                )
            );

            return true;
        } catch (err) {
            console.error('❌ Error marking query as read:', err);
            return false;
        }
    };

    // Get new queries count
    const getNewQueriesCount = useCallback(() => {
        return personalQueries.filter(q => q.isNew).length;
    }, [personalQueries]);

    // Load on mount
    useEffect(() => {
        fetchAllPersonalQueries();
    }, [userData?.documentId]);

    return {
        personalQueries,
        sentQueries,
        loading,
        error,
        refreshing,
        refreshPersonalQueries,
        markAsRead,
        getNewQueriesCount
    };
}