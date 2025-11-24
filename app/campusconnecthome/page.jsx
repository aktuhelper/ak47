
'use client'
import React, { useState } from 'react'
import Sidebar from '../_loggedinHome/sidebar'
import HomePagee from '../_loggedinHome/hero'
import AskQueryPage from '../_loggedinHome/AskQueryPage'
import TrendingQueries from '../_loggedinHome/trendingquery'
import UserQueries from '../_loggedinHome/userquery'
import MyCollegePage from '../_loggedinHome/mycollege'
import CompleteProfilePage from '../_loggedinHome/mycollege'
const Page = () => {
    const [activeTab, setActiveTab] = useState('home')

    return (
        <>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="lg:ml-64 min-h-screen pb-10 lg:pb-0">
                {activeTab === 'home' && <HomePagee />}
                {activeTab === 'ask-query' && <AskQueryPage />}
                {/* Add other tabs as needed */}
                {activeTab === 'trending-queries' && <TrendingQueries/>}
                {activeTab === 'my-college-queries' && <MyCollegePage/>}
                {activeTab === 'my-queries' && <UserQueries/>}
                {activeTab === 'Profile' && <CompleteProfilePage />}
            </div>
        </>
    )
}

export default Page