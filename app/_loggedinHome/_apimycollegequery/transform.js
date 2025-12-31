// ✅ Secure transformQueryData - no direct Strapi URL needed
// Image URLs are already absolute from the API proxy

export function transformQueryData(strapiQuery) {
    const { id, documentId } = strapiQuery;
    const userProfile = strapiQuery.user_profile;
    const answers = strapiQuery.answers || [];
    const attachments = strapiQuery.attachments || [];

    // Get profile image URL
    // ✅ URLs are already absolute from the API proxy
    let profileImageUrl = null;
    if (userProfile?.profileImage?.url) {
        profileImageUrl = userProfile.profileImage.url;
    } else if (userProfile?.profilePic) {
        profileImageUrl = userProfile.profilePic;
    } else {
        profileImageUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${userProfile?.username || 'user'}`;
    }

    return {
        id: documentId || id,
        documentId: documentId || id,
        title: strapiQuery.title || 'Untitled Query',
        description: strapiQuery.description,
        category: strapiQuery.category,
        views: strapiQuery.viewCount || 0,
        answerCount: strapiQuery.answerCount || 0,
        timestamp: formatTimestamp(strapiQuery.createdAt),
        createdAt: strapiQuery.createdAt,
        user: {
            documentId: userProfile?.documentId || userProfile?.id,
            name: userProfile?.name || 'Anonymous',
            username: userProfile?.username || '',
            avatar: profileImageUrl,
            profileImageUrl: profileImageUrl,
            college: userProfile?.college || '',
            branch: userProfile?.branch || '',
            course: userProfile?.course || '',
            year: userProfile?.year || '1st Year',
            isOnline: false,
            isMentor: userProfile?.isMentor || false,
            isVerified: userProfile?.isVerified || false,
            superMentor: userProfile?.superMentor || false,
            eliteMentor: userProfile?.eliteMentor || false,
            activeParticipant: userProfile?.activeParticipant || false,
        },
        attachments: attachments.map(att => ({
            type: att.mime?.startsWith('image/') ? 'image' : 'file',
            url: att.url, // ✅ Already absolute from the API proxy
            name: att.name,
            mime: att.mime,
        })),
        answers: answers.map(answer => {
            const answerProfile = answer.user_profile;

            // Get answer profile image
            // ✅ URLs are already absolute from the API proxy
            let answerProfileImage = null;
            if (answerProfile?.profileImage?.url) {
                answerProfileImage = answerProfile.profileImage.url;
            } else if (answerProfile?.profilePic) {
                answerProfileImage = answerProfile.profilePic;
            }

            return {
                id: answer.documentId || answer.id,
                documentId: answer.documentId || answer.id,
                user: answerProfile?.name || 'Anonymous',
                text: answer.answerText,
                upvotes: answer.upvotes || 0,
                isAccepted: answer.isAccepted || false,
                createdAt: answer.createdAt,
                details: `${answerProfile?.course || ''} • ${answerProfile?.branch || ''} • ${answerProfile?.college || ''}`,
                badges: getBadges(answerProfile),
                userProfile: {
                    documentId: answerProfile?.documentId || answerProfile?.id,
                    name: answerProfile?.name || 'Anonymous',
                    profileImageUrl: answerProfileImage,
                    isVerified: answerProfile?.isVerified || false,
                    isMentor: answerProfile?.isMentor || false,
                },
            };
        }),
    };
}

function formatTimestamp(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

function getBadges(profile) {
    const badges = [];
    if (profile?.eliteMentor) badges.push('elite-mentor');
    if (profile?.superMentor) badges.push('super-mentor');
    if (profile?.isMentor) badges.push('mentor');
    if (profile?.activeParticipant) badges.push('active');

    const yearNumber = parseYear(profile?.year);
    if (yearNumber >= 3) badges.push('senior');
    if (yearNumber === 1) badges.push('fresher');

    return badges;
}

function parseYear(yearString) {
    if (!yearString) return 1;
    if (typeof yearString === 'number') return yearString;

    // Extract number from strings like "4th Year", "1st Year", etc.
    const match = yearString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
}