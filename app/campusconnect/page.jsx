"use client";

import React, { useState } from "react";
import HeroSection from "../_mentorHome/hero";
import RandomProfiles from "../_mentorHome/randomProfile";
import TrendingQueries from "../_mentorHome/TrendingQueries";
import CTAComponent from "../_mentorHome/cta";
import RegistrationModal from "../_mentorHome/RegistrationModal";
 // your modal

const Page = () => {
  // modal state
  const [isMeetSeniorModalOpen, setIsMeetSeniorModalOpen] = useState(false);

  const openMeetSeniorModal = () => setIsMeetSeniorModalOpen(true);
  const closeMeetSeniorModal = () => setIsMeetSeniorModalOpen(false);

  return (
    <div>
      <HeroSection openMeetSeniorModal={openMeetSeniorModal} />

      <RandomProfiles />
      <TrendingQueries />
      <CTAComponent />

      {/* MODAL COMPONENT */}
      <RegistrationModal
        isOpen={isMeetSeniorModalOpen}
        onClose={closeMeetSeniorModal}
      />
    </div>
  );
};

export default Page;
