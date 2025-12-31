'use client'
import React, { useState, useEffect } from 'react'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import LoadingScreen from '../_loggedinHome/LoadingScreen'
import Sidebar from '../_loggedinHome/sidebar'
import HomePagee from '../_loggedinHome/hero'
import AskQueryPage from '../_loggedinHome/AskQueryPage'
import TrendingQueries from '../_loggedinHome/trendingquery'
import UserQueries from '../_loggedinHome/userquery'
import MyCollegePage from '../_loggedinHome/mycollege'
import CompleteProfilePage from '../_loggedinHome/profile'
import { fetchFromStrapi } from '@/secure/strapi'
import { calculateAndUpdateBadges } from '../_loggedinHome/badges/page';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const Page = () => {
    const [activeTab, setActiveTab] = useState('home')
    const { isRegistered, checkingRegistration, user } = useProtectedRoute()
    const userEmail = user?.email || user?.given_name || user?.id

    // User data state
    const [userData, setUserData] = useState(null)
    const [loadingUserData, setLoadingUserData] = useState(true)
    const [error, setError] = useState(null)

    // Helper function to get verification status from user's verification_requests relation
    const getVerificationStatus = (verificationRequests) => {
        if (!verificationRequests || verificationRequests.length === 0) {
            return null
        }

        // Sort by createdAt to get the most recent request
        const sortedRequests = [...verificationRequests].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.submittedAt)
            const dateB = new Date(b.createdAt || b.submittedAt)
            return dateB - dateA // Most recent first
        })

        const latestRequest = sortedRequests[0]

        // Clean up the status string (remove extra spaces and convert to lowercase)
        const status = (latestRequest.statuss || latestRequest.status || '').trim().toLowerCase()

   
       

        // Return standardized status
        if (status === 'pending') return 'pending'
        if (status === 'approved') return 'approved'
        if (status === 'rejected') return 'rejected'

        return null
    }

    // Helper function to get rejection reason from verification requests
    const getRejectionReason = (verificationRequests) => {
        if (!verificationRequests || verificationRequests.length === 0) {
            return null
        }

        // Sort by createdAt to get the most recent request
        const sortedRequests = [...verificationRequests].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.submittedAt)
            const dateB = new Date(b.createdAt || b.submittedAt)
            return dateB - dateA // Most recent first
        })

        const latestRequest = sortedRequests[0]
        const status = (latestRequest.statuss || latestRequest.status || '').trim().toLowerCase()

        // Only return rejection reason if status is rejected
        if (status === 'rejected') {
            return latestRequest.rejectionReason || null
        }

        return null
    }

    // Fetch user data after registration is confirmed
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isRegistered || !userEmail) {
                setLoadingUserData(false)
                return
            }

            try {
               
                setLoadingUserData(true)
                setError(null)

                // ✅ USE SECURE API FUNCTION
                const data = await fetchFromStrapi(
                    `user-profiles?filters[email][$eq]=${encodeURIComponent(userEmail)}&populate=*`
                )
                

                if (data?.data && data.data.length > 0) {
                    const user = data.data[0]
                    

                    // Strapi 5 doesn't use attributes wrapper
                    const userData = user.attributes || user

                    // ✅ Get profile image URL - check both profileImage relation and profilePic field
                    let profileImageUrl = null;

                    // First, try to get from profileImage relation
                    if (userData.profileImage) {
                        const profileImage = userData.profileImage.data || userData.profileImage;
                        if (profileImage) {
                            const imageData = profileImage.attributes || profileImage;
                            profileImageUrl = imageData.url?.startsWith('http')
                                ? imageData.url
                                : `${STRAPI_URL}${imageData.url}`;
                        }
                    }

                    // If profileImage relation is null, use profilePic field
                    if (!profileImageUrl && userData.profilePic) {
                        profileImageUrl = userData.profilePic;
                    }

                   

                    // ✅ Get verification status from verification_requests relation
                    const verificationStatus = getVerificationStatus(userData.verification_requests)
                    

                    // ✅ Get rejection reason if status is rejected
                    const verificationRejectionReason = getRejectionReason(userData.verification_requests)
                    

                    // Format user data with profile image URL and verification status
                    const formattedUser = {
                        id: user.id,
                        documentId: user.documentId,
                        bio: userData.bio || "",
                        enrollmentYear: userData.enrollmentYear || new Date().getFullYear(),
                        graduationYear: userData.graduationYear,
                        name: userData.name || '',
                        username: userData.username || '',
                        isVerified: userData?.isVerified ?? false,
                        verificationStatus: verificationStatus,
                        verificationRejectionReason: verificationRejectionReason,
                        isMentor: userData?.isMentor ?? false,
                        superMentor: userData?.superMentor ?? false,
                        eliteMentor: userData?.eliteMentor ?? false,
                        activeParticipant: userData?.activeParticipant ?? false,
                        bannerUrl: userData?.bannerUrl,
                        email: userData.email || '',
                        college: userData.college || '',
                        course: userData.course || '',
                        branch: userData.branch || null,
                        year: userData.year || '',
                        interests: userData.interests || [],
                        profilePic: profileImageUrl || '/logo_192.png',
                        profileImageUrl: profileImageUrl || '/logo_192.png',
                        totalQueries: userData?.totalQueries ?? 0,
                        totalAnswersGiven: userData?.totalAnswersGiven ?? 0,
                        bestAnswers: userData?.bestAnswers ?? 0,
                        helpfulVotes: userData?.helpfulVotes ?? 0,
                        totalViews: userData?.totalViews ?? 0,
                    }

                    // ✅ Store in localStorage
                    localStorage.setItem('userDocumentId', user.documentId)
                    localStorage.setItem('userEmail', userData.email)
                    

                    // ✅ Calculate and update badges
                    try {
                      
                        await calculateAndUpdateBadges(formattedUser)
                       
                    } catch (badgeError) {
                        
                        // Don't throw - continue with user data even if badges fail
                    }

                   
                    setUserData(formattedUser)
                } else {
                    throw new Error('User profile not found')
                }
            } catch (err) {
              
                setError(err.message)
            } finally {
                setLoadingUserData(false)
            }
        }

        fetchUserData()
    }, [isRegistered, userEmail])
    // Function to refresh user data (for profile updates)
    const refreshUserData = async () => {
        if (!userEmail) return

        try {
          
            setLoadingUserData(true)

            // ✅ USE SECURE API FUNCTION
            const data = await fetchFromStrapi(
                `user-profiles?filters[email][$eq]=${encodeURIComponent(userEmail)}&populate=*`
            )

            if (data?.data && data.data.length > 0) {
                const user = data.data[0]

                // Strapi 5 doesn't use attributes wrapper
                const userData = user.attributes || user

                // ✅ Get profile image URL - check both profileImage relation and profilePic field
                let profileImageUrl = null;

                // First, try to get from profileImage relation
                if (userData.profileImage) {
                    const profileImage = userData.profileImage.data || userData.profileImage;
                    if (profileImage) {
                        const imageData = profileImage.attributes || profileImage;
                        profileImageUrl = imageData.url?.startsWith('http')
                            ? imageData.url
                            : `${STRAPI_URL}${imageData.url}`;
                    }
                }

                // If profileImage relation is null, use profilePic field
                if (!profileImageUrl && userData.profilePic) {
                    profileImageUrl = userData.profilePic;
                }

           

                // ✅ Get updated verification status from verification_requests relation
                const verificationStatus = getVerificationStatus(userData.verification_requests)
                

                // ✅ Get updated rejection reason if status is rejected
                const verificationRejectionReason = getRejectionReason(userData.verification_requests)
              

                const formattedUser = {
                    id: user.id,
                    documentId: user.documentId,
                    enrollmentYear: userData.enrollmentYear || new Date().getFullYear(),
                    graduationYear: userData.graduationYear,
                    bio: userData.bio || "",
                    name: userData.name || '',
                    username: userData.username || '',
                    isVerified: userData?.isVerified ?? false,
                    verificationStatus: verificationStatus, // ✅ Use calculated status
                    verificationRejectionReason: verificationRejectionReason, // ✅ Use extracted reason
                    isMentor: userData?.isMentor ?? false,
                    superMentor: userData?.superMentor ?? false,
                    eliteMentor: userData?.eliteMentor ?? false,
                    activeParticipant: userData?.activeParticipant ?? false,
                    email: userData.email || '',
                    college: userData.college || '',
                    course: userData.course || '',
                    branch: userData.branch || null,
                    year: userData.year || '',
                    interests: userData.interests || [],
                    bannerUrl: userData?.bannerUrl,
                    profilePic: profileImageUrl || '/logo_192.png',
                    profileImageUrl: profileImageUrl || '/logo_192.png',
                    totalAnswersGiven: userData?.totalAnswersGiven ?? 0,
                    bestAnswers: userData?.bestAnswers ?? 0,
                    helpfulVotes: userData?.helpfulVotes ?? 0,
                    totalViews: userData?.totalViews ?? 0,
                }

                // ✅ CORRECT LOCATION: Store in localStorage AFTER formatting user data
                localStorage.setItem('userDocumentId', user.documentId)
                localStorage.setItem('userEmail', userData.email)

          
                setUserData(formattedUser)
            }
        } catch (err) {
         
        } finally {
            setLoadingUserData(false)
        }
    }

    // Show loading screen while checking registration or fetching user data
    if (checkingRegistration || isRegistered === null || isRegistered === false) {
        return <LoadingScreen message="Verifying your access..." />
    }

    if (loadingUserData) {
        return <LoadingScreen message="Loading your profile..." />
    }

    // Show error if data fetch failed
    if (error || !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
                    <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
                        {error || 'Failed to load user profile'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        )
    }

    // User is registered and data is loaded, show the page
    return (
        <>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userData={userData}
            />

            <div className="lg:ml-64 min-h-screen pb-10 lg:pb-0">
                {activeTab === 'home' && <HomePagee userData={userData} />}
                {activeTab === 'ask-query' && <AskQueryPage userData={userData} />}
                {activeTab === 'trending-queries' && <TrendingQueries userData={userData} />}
                {activeTab === 'my-college-queries' && <MyCollegePage userData={userData} />}
                {activeTab === 'my-queries' && <UserQueries userData={userData} />}
                {activeTab === 'Profile' && (
                    <CompleteProfilePage
                        userData={userData}
                        onUpdate={refreshUserData}
                    />
                )}
            </div>
        </>
    )
}

export default Page