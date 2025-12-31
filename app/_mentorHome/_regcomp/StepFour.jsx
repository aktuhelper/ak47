import React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import ProfileReview from "./ProfileReview";

export default function StepFour({
    profilePreview,
    name,
    username,
    userEmail,
    selectedCourse,
    selectedBranch,
    selectedYear,
    selectedCollege,
    manualCollege,
    selectedInterests,
    loading,
    alreadyRegistered,
    onBack,
    onSubmit
}) {
    const isEngineeringCourse = selectedCourse === "B.Tech" || selectedCourse === "M.Tech";

    return (
        <div className="animate-slideIn">
            <ProfileReview
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
                isEngineeringCourse={isEngineeringCourse}
            />

            <div className="flex gap-2 mt-4">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading || alreadyRegistered}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            Complete Registration
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}