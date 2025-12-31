import React from "react";
import { ArrowRight } from "lucide-react";
import ProfileImageUpload from "./ProfileImageUpload";
import UsernameInput from "./UsernameInput";

export default function StepOne({
    profilePic,
    profilePreview,
    showRandomAvatars,
    name,
    username,
    usernameAvailable,
    checkingUsername,
    onProfilePicChange,
    onAvatarSelect,
    onToggleAvatars,
    onNameChange,
    onUsernameChange,
    onNext
}) {
    const isValid = name && profilePic && username && usernameAvailable === true;

    return (
        <div className="space-y-4 animate-slideIn">
            <ProfileImageUpload
                profilePreview={profilePreview}
                showRandomAvatars={showRandomAvatars}
                onFileChange={onProfilePicChange}
                onAvatarSelect={onAvatarSelect}
                onToggleAvatars={onToggleAvatars}
            />

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
                    onChange={(e) => onNameChange(e.target.value)}
                />
            </div>

            <UsernameInput
                username={username}
                usernameAvailable={usernameAvailable}
                checkingUsername={checkingUsername}
                onChange={onUsernameChange}
            />

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2 mt-4"
            >
                Continue <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}