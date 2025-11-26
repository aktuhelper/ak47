"use client";

import React, { useState } from "react";
import { X, ArrowRight, User, GraduationCap, CheckCircle2, Upload } from "lucide-react";
import aktuColleges from "./aktuColleges";

const branches = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "ME",
    "CE",
    "AI & ML",
    "Data Science",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const courses = ["B.Tech", "M.Tech", "BCA", "MCA", "MBA", "B.Sc", "M.Sc"];

const randomAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
];

const interestOptions = [
    "Web Development", "App Development", "AI/ML", "Data Science",
    "Cyber Security", "Cloud Computing", "Blockchain", "IoT",
    "Game Development", "UI/UX Design", "DevOps", "Competitive Programming",
    "Robotics", "Photography", "Video Editing", "Content Writing",
    "Public Speaking", "Music", "Sports", "Art & Design"
];

export default function RegistrationModal({ isOpen, onClose, onSubmit }) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [showRandomAvatars, setShowRandomAvatars] = useState(false);
    const [collegeSearch, setCollegeSearch] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");
    const [manualCollege, setManualCollege] = useState(""); // FIXED: Added missing state
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

    const filteredColleges = aktuColleges.filter((c) =>
        c.toLowerCase().includes(collegeSearch.toLowerCase())
    );

    const handleProfilePic = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setProfilePreview(URL.createObjectURL(file));
            setShowRandomAvatars(false);
        }
    };

    const handleRandomAvatar = (avatar) => {
        setProfilePreview(avatar);
        setProfilePic(avatar);
        setShowRandomAvatars(false);
    };

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleSubmit = () => {
        onSubmit({
            name,
            username,
            profilePic,
            college: selectedCollege === "Other" ? manualCollege : selectedCollege, // FIXED: Use manualCollege when "Other" is selected
            course: selectedCourse,
            branch: selectedBranch,
            year: selectedYear,
            interests: selectedInterests
        });
    };

    const isEngineeringCourse = selectedCourse === "B.Tech" || selectedCourse === "M.Tech";

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-sm relative animate-scaleIn overflow-hidden">

                {/* Header Bar */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3.5 relative">
                    <button
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                    <h2 className="text-lg font-bold text-white">Join Campus Connect</h2>
                    <p className="text-blue-100 text-xs mt-0.5">Step {step} of 4</p>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-zinc-800">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* STEP 1 - Profile & Username */}
                    {step === 1 && (
                        <div className="space-y-4 animate-slideIn">
                            {/* Profile Upload */}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    {profilePreview ? (
                                        <div className="relative group">
                                            <img
                                                src={profilePreview}
                                                className="w-20 h-20 rounded-full border-3 border-blue-500 object-cover"
                                                alt="profile"
                                            />
                                            <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <Upload className="w-5 h-5 text-white" />
                                                <input type="file" accept="image/*" hidden onChange={handleProfilePic} />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform">
                                                <User className="w-9 h-9 text-white" />
                                            </div>
                                            <input type="file" accept="image/*" hidden onChange={handleProfilePic} />
                                        </label>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <label className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer transition-colors">
                                        Upload Photo
                                        <input type="file" accept="image/*" hidden onChange={handleProfilePic} />
                                    </label>
                                    <button
                                        onClick={() => setShowRandomAvatars(!showRandomAvatars)}
                                        className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                                    >
                                        Random Avatar
                                    </button>
                                </div>

                                {/* Random Avatars Grid */}
                                {showRandomAvatars && (
                                    <div className="grid grid-cols-6 gap-2 mt-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg animate-slideIn">
                                        {randomAvatars.map((avatar, idx) => (
                                            <img
                                                key={idx}
                                                src={avatar}
                                                className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                                                onClick={() => handleRandomAvatar(avatar)}
                                                alt={`avatar-${idx}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* Username Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400 text-sm">@</span>
                                    <input
                                        type="text"
                                        placeholder="johndoe"
                                        className="w-full pl-7 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">This will be your unique identifier</p>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!name || !profilePic || !username}
                                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2 mt-4"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-3.5 animate-slideIn">
                            {/* College Input with Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                                    College
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search college..."
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm"
                                    value={selectedCollege || collegeSearch}
                                    onChange={(e) => {
                                        setCollegeSearch(e.target.value);
                                        setSelectedCollege("");
                                        setShowCollegeDropdown(true);
                                    }}
                                    onFocus={() => setShowCollegeDropdown(true)}
                                />

                                {showCollegeDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-40 overflow-y-auto z-10 custom-scrollbar">
                                        {/* Other Option at Top */}
                                        <div
                                            className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer text-xs font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-zinc-700 transition-colors sticky top-0 bg-white dark:bg-zinc-900"
                                            onClick={() => {
                                                setSelectedCollege("Other");
                                                setShowCollegeDropdown(false);
                                            }}
                                        >
                                            ✏️ Other (Enter manually)
                                        </div>

                                        {filteredColleges.length > 0 ? (
                                            <>
                                                {filteredColleges.map((col) => (
                                                    <div
                                                        key={col}
                                                        className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer text-xs text-gray-700 dark:text-zinc-300 transition-colors"
                                                        onClick={() => {
                                                            setSelectedCollege(col);
                                                            setShowCollegeDropdown(false);
                                                        }}
                                                    >
                                                        {col}
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-zinc-500 text-center">
                                                No colleges found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Manual College Input (shown when "Other" is selected) */}
                            {selectedCollege === "Other" && (
                                <div className="animate-slideIn">
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                                        Enter Your College Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Type your college name..."
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm"
                                        value={manualCollege}
                                        onChange={(e) => setManualCollege(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            )}

                            {/* Course Dropdown */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                                    Course
                                </label>
                                <select
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-gray-900 dark:text-white text-sm"
                                    value={selectedCourse}
                                    onChange={(e) => {
                                        setSelectedCourse(e.target.value);
                                        setSelectedBranch("");
                                    }}
                                >
                                    <option value="">Select course</option>
                                    {courses.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Branch Dropdown - Only for Engineering */}
                            {isEngineeringCourse && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                                        Branch
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-gray-900 dark:text-white text-sm"
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                    >
                                        <option value="">Select branch</option>
                                        {branches.map((b) => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Year Dropdown */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                                    Current Year
                                </label>
                                <select
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-gray-900 dark:text-white text-sm"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <option value="">Select year</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Buttons - FIXED: Added validation for manualCollege */}
                            <div className="flex gap-2 pt-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={
                                        !selectedCourse ||
                                        !selectedYear ||
                                        (isEngineeringCourse && !selectedBranch) ||
                                        (!selectedCollege || (selectedCollege === "Other" && !manualCollege))
                                    }
                                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 - Interests & Skills */}
                    {step === 3 && (
                        <div className="space-y-3 animate-slideIn">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                                    Select Your Interests & Skills
                                </label>
                                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-3">Choose at least 3 tags</p>

                                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto custom-scrollbar p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg">
                                    {interestOptions.map((interest) => (
                                        <button
                                            key={interest}
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedInterests.includes(interest)
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>

                                {selectedInterests.length > 0 && (
                                    <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1.5">
                                            Selected ({selectedInterests.length})
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedInterests.map((interest) => (
                                                <span
                                                    key={interest}
                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    disabled={selectedInterests.length < 3}
                                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4 - Review & Submit */}
                    {step === 4 && (
                        <div className="space-y-4 animate-slideIn">
                            <div className="text-center mb-4">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Review Your Profile</h3>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">Make sure everything looks good</p>
                            </div>

                            {/* Profile Review Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-900/20 dark:to-black rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3 mb-4">
                                    <img
                                        src={profilePreview}
                                        className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
                                        alt="profile"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">{name}</h4>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">@{username}</p>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                                            {selectedCourse} {isEngineeringCourse && `• ${selectedBranch}`} • {selectedYear}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
                                            {selectedCollege === "Other" ? manualCollege : selectedCollege}
                                        </p>
                                    </div>
                                </div>

                                {/* Interests Preview */}
                                <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
                                    <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">Interests & Skills</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedInterests.slice(0, 6).map((interest) => (
                                            <span
                                                key={interest}
                                                className="px-2 py-1 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-full text-xs border border-blue-200 dark:border-zinc-700"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                        {selectedInterests.length > 6 && (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 rounded-full text-xs">
                                                +{selectedInterests.length - 6} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Complete Registration
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
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