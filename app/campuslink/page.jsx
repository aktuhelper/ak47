import React from 'react'
import HeroSection from '../_mentorHome/hero'
import RandomProfiles from '../_mentorHome/randomProfile'
import TrendingQueries from '../_mentorHome/TrendingQueries'
import CTAComponent from '../_mentorHome/cta'

const page = () => {
  return (
    <div>
      <HeroSection />
      <RandomProfiles />
      <TrendingQueries />
      <CTAComponent/>
    </div>
  )
}

export default page
