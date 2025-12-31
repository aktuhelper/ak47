// ✅ Secure API utility functions - all calls go through /api/strapi
import { postToStrapi, updateStrapi } from '@/secure/strapi';

export const updateUserProfile = async (documentId, profileData) => {
    try {
        // ✅ Use secure wrapper
        const result = await updateStrapi(`user-profiles/${documentId}`, profileData);
        return result;
    } catch (error) {
        throw error;
    }
};

export const uploadImageToStrapi = async (file, fieldName, userId) => {
    try {
        const formData = new FormData();
        formData.append('files', file);

        // ✅ Use /api/strapi route which handles multipart/form-data
        const response = await fetch('/api/strapi', {
            method: 'POST',
            body: formData, // Note: No Content-Type header - browser sets it automatically with boundary
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();

        // Return both ID and URL
        return {
            id: data[0]?.id,
            url: data[0]?.url
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Upload banner image to Strapi
 */
export const uploadBannerToStrapi = async (file) => {
    try {
        const formData = new FormData();
        formData.append('files', file);

        // ✅ Use /api/strapi route
        const response = await fetch('/api/strapi', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
        }

        const result = await response.json();

        return result[0];
    } catch (error) {
        throw error;
    }
};

/**
 * Submit verification request with document
 */
export const submitVerificationRequest = async (userId, documentFile) => {
    try {
        // Step 1: Upload the document file
        const formData = new FormData();
        formData.append('files', documentFile);

        const uploadResponse = await fetch('/api/strapi', {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Failed to upload document');
        }

        const uploadedFiles = await uploadResponse.json();
        const uploadedFileId = uploadedFiles[0]?.id;

        if (!uploadedFileId) {
            throw new Error('No file ID returned from upload');
        }

        // Step 2: Create verification request entry
        const verificationData = {
            user_profile: userId,
            document: uploadedFileId,
            statuss: 'pending ', // ✅ Try with spaces (notice the spaces before and after)
            submittedAt: new Date().toISOString(),
        }

        // ✅ Use secure wrapper
        const result = await postToStrapi('verification-requests', verificationData);

        return result;

    } catch (error) {
        throw error;
    }
};

/**
 * Upload multiple files to Strapi
 */
export const uploadMultipleFilesToStrapi = async (files) => {
    try {
        if (!files || files.length === 0) {
            return [];
        }

        const formData = new FormData();

        // Append all files to the same 'files' field
        files.forEach((file) => {
            formData.append('files', file);
        });

        // ✅ Use /api/strapi route
        const response = await fetch('/api/strapi', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
        }

        const uploadedFiles = await response.json();

        // Return array of file objects with id and url
        return uploadedFiles.map(file => ({
            id: file.id,
            url: file.url,
            name: file.name,
            mime: file.mime
        }));

    } catch (error) {
        throw error;
    }
};