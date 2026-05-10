'use client'
import React, { useState, useEffect } from 'react'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import PageSkeleton from './Pageskeleton'        // ← replaces LoadingScreen for profile loading
import LoadingScreen from '../_loggedinHome/LoadingScreen'  // ← kept only for auth check
import Sidebar from '../_loggedinHome/sidebar'
import HomePagee from '../_loggedinHome/hero'
import AskQueryPage from '../_loggedinHome/AskQueryPage'
import TrendingQueries from '../_loggedinHome/trendingquery'
import UserQueries from '../_loggedinHome/userquery'
import MyCollegePage from '../_loggedinHome/mycollege'
import CompleteProfilePage from '../_loggedinHome/profile'
import { fetchFromStrapi } from '@/secure/strapi'
import { calculateAndUpdateBadges } from '../_loggedinHome/badges/page'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const CACHE_KEY = 'userData_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const USER_PROFILE_POPULATE = 'populate=*'

const getVerificationStatus = (verificationRequests) => {
    if (!verificationRequests || verificationRequests.length === 0) return null

    const sorted = [...verificationRequests].sort((a, b) => {
        return new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt)
    })

    const status = (sorted[0].statuss || sorted[0].status || '').trim().toLowerCase()

    if (status === 'pending') return 'pending'
    if (status === 'approved') return 'approved'
    if (status === 'rejected') return 'rejected'
    return null
}

const getRejectionReason = (verificationRequests) => {
    if (!verificationRequests || verificationRequests.length === 0) return null

    const sorted = [...verificationRequests].sort((a, b) => {
        return new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt)
    })

    const latest = sorted[0]
    const status = (latest.statuss || latest.status || '').trim().toLowerCase()
    return status === 'rejected' ? (latest.rejectionReason || null) : null
}

const buildProfileImageUrl = (userData) => {
    if (userData.profileImage) {
        const profileImage = userData.profileImage.data || userData.profileImage
        if (profileImage) {
            const imageData = profileImage.attributes || profileImage
            if (imageData.url) {
                return imageData.url.startsWith('http')
                    ? imageData.url
                    : `${STRAPI_URL}${imageData.url}`
            }
        }
    }
    return userData.profilePic || null
}

const formatUser = (raw) => {
    const userData = raw.attributes || raw
    const profileImageUrl = buildProfileImageUrl(userData)

    return {
        id: raw.id,
        documentId: raw.documentId,
        bio: userData.bio || '',
        enrollmentYear: userData.enrollmentYear || new Date().getFullYear(),
        graduationYear: userData.graduationYear,
        name: userData.name || '',
        username: userData.username || '',
        isVerified: userData?.isVerified ?? false,
        verificationStatus: getVerificationStatus(userData.verification_requests),
        verificationRejectionReason: getRejectionReason(userData.verification_requests),
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
}

const Page = () => {
    const [activeTab, setActiveTab] = useState('home')
    const { isRegistered, checkingRegistration, user } = useProtectedRoute()
    const userEmail = user ? (user.email || user.given_name || user.id) : null

    const [userData, setUserData] = useState(null)
    const [loadingUserData, setLoadingUserData] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isRegistered || !userEmail) return

            setError(null)

            // Step 1 — check cache first
            let hasCache = false
            try {
                const raw = localStorage.getItem(CACHE_KEY)
                if (raw) {
                    const { data, ts, email } = JSON.parse(raw)
                    const isRecent = Date.now() - ts < CACHE_TTL
                    const isSameUser = email === userEmail

                    if (isRecent && isSameUser && data) {
                        setUserData(data)
                        setLoadingUserData(false)
                        hasCache = true
                    }
                }
            } catch {
                localStorage.removeItem(CACHE_KEY)
            }

            if (!hasCache) setLoadingUserData(true)

            try {
                const data = await fetchFromStrapi(
                    `user-profiles?filters[email][$eq]=${encodeURIComponent(userEmail)}&${USER_PROFILE_POPULATE}`
                )

                if (data?.data && data.data.length > 0) {
                    const raw = data.data[0]
                    const formattedUser = formatUser(raw)

                    localStorage.setItem('userDocumentId', raw.documentId)
                    localStorage.setItem('userEmail', formattedUser.email)

                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: formattedUser,
                        ts: Date.now(),
                        email: userEmail
                    }))

                    calculateAndUpdateBadges(formattedUser).catch(() => { })
                    setUserData(formattedUser)
                } else {
                    throw new Error('User profile not found')
                }
            } catch (err) {
                if (!hasCache) setError(err.message)
            } finally {
                setLoadingUserData(false)
            }
        }

        fetchUserData()
    }, [isRegistered, userEmail])

    const refreshUserData = async () => {
        if (!userEmail) return

        try {
            setRefreshing(true)

            const data = await fetchFromStrapi(
                `user-profiles?filters[email][$eq]=${encodeURIComponent(userEmail)}&${USER_PROFILE_POPULATE}`
            )

            if (data?.data && data.data.length > 0) {
                const raw = data.data[0]
                const formattedUser = formatUser(raw)

                localStorage.setItem('userDocumentId', raw.documentId)
                localStorage.setItem('userEmail', formattedUser.email)

                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: formattedUser,
                    ts: Date.now(),
                    email: userEmail
                }))

                setUserData(formattedUser)
            }
        } catch {
            // Silently fail — user still has their current data
        } finally {
            setRefreshing(false)
        }
    }

    // Only block on Kinde auth — show LoadingScreen for this unavoidable wait
    if (checkingRegistration || isRegistered === null || isRegistered === false) {
        return <LoadingScreen message="Verifying your access..." />
    }

    // Show skeleton instead of blank screen or spinner — LCP fires on skeleton content
    if (loadingUserData || !userData) {
        return <PageSkeleton />
    }

    if (error && !userData) {
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