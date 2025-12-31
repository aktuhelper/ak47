"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import aktuColleges from "./aktuColleges.js";
import { useUsernameValidation, useExistingUserCheck } from "../_mentorHome/_regcomp/useRegistration.js";
import { uploadProfileImage, createUserProfile, buildProfilePayload } from "../_mentorHome/_regcomp/registrationApi";
import LoadingScreen from "../_mentorHome/_regcomp/LoadingScreen";
import ModalHeader from "../_mentorHome/_regcomp/ModalHeader";
import { ErrorAlert, SuccessAlert } from "../_mentorHome/_regcomp/AlertMessages";
import StepOne from "../_mentorHome/_regcomp/StepOne";
import StepTwo from "../_mentorHome/_regcomp/StepTwo";
import StepThree from "../_mentorHome/_regcomp/StepThree";
import StepFour from "../_mentorHome/_regcomp/StepFour.jsx";

export default function RegistrationModal({ userEmail, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Custom hooks for validation
    const { checkingUser, alreadyRegistered } = useExistingUserCheck(userEmail);
    const [username, setUsername] = useState("");
    const { usernameAvailable, checkingUsername } = useUsernameValidation(username);

    // Form States
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [isProfilePicFile, setIsProfilePicFile] = useState(false);
    const [showRandomAvatars, setShowRandomAvatars] = useState(false);
    const [collegeSearch, setCollegeSearch] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");
    const [manualCollege, setManualCollege] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

    useEffect(() => {
        if (userEmail) {
            setIsOpen(true);
        }
    }, [userEmail]);

    useEffect(() => {
        if (alreadyRegistered) {
            setError("You're already registered! Redirecting to dashboard...");
            setTimeout(() => {
                router.push('/campusconnecthome');
            }, 3000);
        }
    }, [alreadyRegistered, router]);

    // Fixed filtering logic - remove duplicates from source and then filter
    const uniqueColleges = [...new Set(aktuColleges)];
    const filteredColleges = uniqueColleges.filter((c) =>
        c.toLowerCase().includes(collegeSearch.toLowerCase())
    );

    // Profile picture handlers
    const handleProfilePic = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setProfilePreview(URL.createObjectURL(file));
            setIsProfilePicFile(true);
            setShowRandomAvatars(false);
        }
    };

    const handleRandomAvatar = (avatar) => {
        setProfilePreview(avatar);
        setProfilePic(avatar);
        setIsProfilePicFile(false);
        setShowRandomAvatars(false);
    };

    // Interest toggle handler
    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    // Fixed college handlers
    const handleCollegeSearchChange = (value) => {
        setCollegeSearch(value);
        setSelectedCollege(""); // Clear selection when typing
        setShowCollegeDropdown(true);
    };

    const handleCollegeFocus = () => {
        setShowCollegeDropdown(true);
        // Don't reset the search when focusing if a college is already selected
    };

    const handleCollegeSelect = (college) => {
        setSelectedCollege(college);
        setCollegeSearch(""); // Clear search after selection
        setShowCollegeDropdown(false);
    };

    // Normalize college name to title case for consistency
    const normalizeCollegeName = (name) => {
        if (!name) return "";
        return name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Course change handler
    const handleCourseChange = (newCourse) => {
        setSelectedCourse(newCourse);
        if (newCourse !== "B.Tech" && newCourse !== "M.Tech") {
            setSelectedBranch("");
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const handleSubmit = async () => {
        if (alreadyRegistered) {
            setError("You're already registered!");
            return;
        }

        if (usernameAvailable === false) {
            setError("Username is already taken. Please choose another one.");
            return;
        }

        const isEngineering = selectedCourse === "B.Tech" || selectedCourse === "M.Tech";

        if (isEngineering && (!selectedBranch || selectedBranch.trim() === "")) {
            setError("Please select a branch for engineering courses.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            let uploadedImageId = null;

            // Upload image if it's a file
            if (profilePic && isProfilePicFile) {
                uploadedImageId = await uploadProfileImage(profilePic);
            }

            // Build profile payload
            const profileData = buildProfilePayload({
                name,
                username,
                email: userEmail,
                college: selectedCollege,
                manualCollege: normalizeCollegeName(manualCollege), // Normalize manual college name
                selectedCollege,
                course: selectedCourse,
                branch: selectedBranch,
                year: selectedYear,
                interests: selectedInterests,
                uploadedImageId,
                profilePicUrl: profilePic,
                isProfilePicFile
            });

            // Create user profile
            await createUserProfile(profileData);

            setSuccess(true);
            setError("");

            setTimeout(() => {
                handleClose();
                sessionStorage.removeItem("openMeetSeniorModal");
                router.push('/campusconnecthome');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingUser && userEmail) {
        return <LoadingScreen message="Checking your registration status..." />;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-sm relative animate-scaleIn overflow-hidden">

                <ModalHeader step={step} onClose={handleClose} />

                <ErrorAlert message={error} />
                {success && <SuccessAlert message="Profile created successfully! 🎉" />}

                <div className="p-5">
                    {step === 1 && (
                        <StepOne
                            profilePic={profilePic}
                            profilePreview={profilePreview}
                            showRandomAvatars={showRandomAvatars}
                            name={name}
                            username={username}
                            usernameAvailable={usernameAvailable}
                            checkingUsername={checkingUsername}
                            onProfilePicChange={handleProfilePic}
                            onAvatarSelect={handleRandomAvatar}
                            onToggleAvatars={() => setShowRandomAvatars(!showRandomAvatars)}
                            onNameChange={setName}
                            onUsernameChange={setUsername}
                            onNext={() => setStep(2)}
                        />
                    )}

                    {step === 2 && (
                        <StepTwo
                            collegeSearch={collegeSearch}
                            selectedCollege={selectedCollege}
                            manualCollege={manualCollege}
                            selectedCourse={selectedCourse}
                            selectedBranch={selectedBranch}
                            selectedYear={selectedYear}
                            showCollegeDropdown={showCollegeDropdown}
                            filteredColleges={filteredColleges}
                            onCollegeSearchChange={handleCollegeSearchChange}
                            onCollegeSelect={handleCollegeSelect}
                            onManualCollegeChange={setManualCollege}
                            onCollegeFocus={handleCollegeFocus}
                            onDropdownToggle={setShowCollegeDropdown}
                            onCourseChange={handleCourseChange}
                            onBranchChange={setSelectedBranch}
                            onYearChange={setSelectedYear}
                            onBack={() => setStep(1)}
                            onNext={() => setStep(3)}
                        />
                    )}

                    {step === 3 && (
                        <StepThree
                            selectedInterests={selectedInterests}
                            onToggleInterest={toggleInterest}
                            onBack={() => setStep(2)}
                            onNext={() => setStep(4)}
                        />
                    )}

                    {step === 4 && (
                        <StepFour
                            profilePreview={profilePreview}
                            name={name}
                            username={username}
                            userEmail={userEmail}
                            selectedCourse={selectedCourse}
                            selectedBranch={selectedBranch}
                            selectedYear={selectedYear}
                            selectedCollege={selectedCollege}
                            manualCollege={manualCollege}
                            selectedInterests={selectedInterests}
                            loading={loading}
                            alreadyRegistered={alreadyRegistered}
                            onBack={() => setStep(3)}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>

                <div className="px-5 pb-3 pt-2 border-t border-gray-200 dark:border-zinc-800">
                    <p className="text-xs text-center text-gray-500 dark:text-zinc-400">
                        By continuing, you agree to our Terms & Privacy Policy
                    </p>
                </div>
            </div>

            <style jsx>{`
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #3b82f6;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}