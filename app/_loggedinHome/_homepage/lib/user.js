export async function fetchUserByDocumentId(documentId) {
    try {
        const response = await fetch(`/api/user-profiles/${documentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('User not found');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}