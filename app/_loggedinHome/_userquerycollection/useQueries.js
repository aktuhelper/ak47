// ✅ Secure useQueries hook - all calls go through /api/strapi
import { useState, useEffect } from 'react';
import { fetchFromStrapi } from '@/secure/strapi';

export function useQueries(userData) {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const formatQueryData = (data) => {
        return data.data.map(query => {
            const queryData = query.attributes || query;
            ;
            // Check if attachments is already an array or wrapped in data
            const attachmentsArray = Array.isArray(queryData.attachments)
                ? queryData.attachments
                : queryData.attachments?.data || [];

            // ⭐ Attachment URLs are already absolute from the API proxy
            const attachments = attachmentsArray.map(att => {
                const attData = att.attributes || att;
                return {
                    type: attData.mime?.startsWith('image/') ? 'image' : 'file',
                    url: attData.url,
                    name: attData.name
                };
            });

            const createdAt = new Date(queryData.createdAt);
            const now = new Date();
            const diffInHours = Math.floor((now - createdAt) / (1000 * 60 * 60));
            const timestamp = diffInHours < 24
                ? `${diffInHours} hours ago`
                : `${Math.floor(diffInHours / 24)} days ago`;

            // ✅ Pull actual query author from populated user_profile
            const userProfile = queryData.user_profile || {};
           
            return {
                id: query.id,
                documentId: query.documentId,
                title: queryData.title || '',
                description: queryData.description || '',
                category: queryData.category || 'General Query',
                visibility: queryData.visibility || 'public',
                isAnonymous: queryData.isAnonymous || false,
                views: queryData.viewCount || 0,
                answerCount: queryData.answerCount || 0,
                timestamp: timestamp,
                createdAt: queryData.createdAt,
                attachments: attachments,
                user: {
                    documentId: userProfile.documentId,
                    name: userProfile.name || 'Anonymous',
                    profilePic: userProfile.profilePic || userProfile.profileImage?.url || null,
                    profileImageUrl: userProfile.profileImageUrl || userProfile.profileImage?.url || null,
                    course: userProfile.course || '',
                    branch: userProfile.branch || '',
                    year: userProfile.year || '',
                    college: userProfile.college || '',
                    isVerified: userProfile.isVerified || false,
                    isMentor: userProfile.isMentor || false,
                    superMentor: userProfile.superMentor || false,
                    eliteMentor: userProfile.eliteMentor || false,
                },
                answers: []
            };
        });
    };

    const fetchQueries = async (isRefreshing = false) => {
        if (!userData?.documentId) {
            setLoading(false);
            return;
        }

        try {
            if (isRefreshing) {
                setRefreshing(true);
            
            } else {
                setLoading(true);
            }
            setError(null);

           

            const timestamp = new Date().getTime();

            // ✅ Use secure wrapper
            const data = await fetchFromStrapi(
                `queries?filters[user_profile][documentId][$eq]=${userData.documentId}&populate[attachments][populate]=*&populate[user_profile][populate]=*&_t=${timestamp}`
            );

        

            if (data?.data) {
                const formattedQueries = formatQueryData(data);
                
                setQueries(formattedQueries);
            } else {
                setQueries([]);
            }
        } catch (err) {
            console.error('❌ Error fetching queries:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, [userData?.documentId]);

    const refreshQueries = async () => {
        await fetchQueries(true);
    };

    return { queries, loading, error, refreshing, refreshQueries };
}