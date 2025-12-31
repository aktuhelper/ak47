import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function ProfileReview({
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
    isEngineeringCourse
}) {
    return (
        <div className="space-y-4">
            <div className="text-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Review Your Profile
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                    Make sure everything looks good
                </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-900/20 dark:to-black rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3 mb-4">
                    <img
                        src={profilePreview}
                        className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
                        alt="profile"
                    />
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-base">
                            {name}
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            @{username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
                            {userEmail}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                            {selectedCourse} {isEngineeringCourse && `• ${selectedBranch}`} • {selectedYear}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
                            {selectedCollege === "Other" ? manualCollege : selectedCollege}
                        </p>
                    </div>
                </div>

                <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                        Interests & Skills
                    </p>
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
        </div>
    );
}