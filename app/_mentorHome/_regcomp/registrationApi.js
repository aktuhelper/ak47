import { postToStrapi } from '@/secure/strapi'

export async function uploadProfileImage(file) {
    try {


        const formData = new FormData();
        formData.append('files', file);

        // ✅ Upload through secure API route
        const uploadResponse = await fetch('/api/strapi', {
            method: 'POST',
            body: formData, // Don't set Content-Type header, browser will set it automatically with boundary
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        const imageId = uploadData[0].id;
       
        return imageId;
    } catch (error) {
 
        throw error;
    }
}

export async function createUserProfile(profileData) {
    try {
   
       

        // ✅ Use postToStrapi for secure API call
        const result = await postToStrapi('user-profiles', profileData);


        return result;
    } catch (error) {
        console.error('❌ Error saving profile:', error);

        // Parse error message for better user feedback
        const errorMessage = error.message || '';

        if (errorMessage.includes('email') || errorMessage.includes('unique')) {
            throw new Error('This email is already registered!');
        } else if (errorMessage.includes('username')) {
            throw new Error('This username is already taken!');
        } else {
            throw new Error(errorMessage || 'Registration failed. Please try again.');
        }
    }
}

export function buildProfilePayload({
    name,
    username,
    email,
    college,
    manualCollege,
    selectedCollege,
    course,
    branch,
    year,
    interests,
    uploadedImageId,
    profilePicUrl,
    isProfilePicFile
}) {
    const isEngineering = course === "B.Tech" || course === "M.Tech";

    // Build base profile data - removed the 'data' wrapper
    const profileData = {
        name,
        username,
        email,
        college: selectedCollege === "Other" ? manualCollege : college,
        course,
        year,
        interests,
    };

    // Add branch only for engineering courses with valid non-empty value
    if (isEngineering && branch && branch.trim() !== "") {
        profileData.branch = branch;
       
    } else {
        console.log("⚠️ Skipping branch field - isEngineering:", isEngineering, "| branch:", `'${branch}'`);
    }

    // Add image data conditionally
    if (isProfilePicFile && uploadedImageId) {
        profileData.profileImage = uploadedImageId;
   
    } else if (!isProfilePicFile && profilePicUrl) {
        profileData.profilePic = profilePicUrl;
        console.log("✅ Adding avatar URL:", profilePicUrl);
    }

    return profileData;
}