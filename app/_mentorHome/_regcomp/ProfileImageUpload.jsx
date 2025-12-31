import React from "react";
import { User, Upload } from "lucide-react";

const randomAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
];

export default function ProfileImageUpload({
    profilePreview,
    showRandomAvatars,
    onFileChange,
    onAvatarSelect,
    onToggleAvatars
}) {
    return (
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
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={onFileChange}
                            />
                        </label>
                    </div>
                ) : (
                    <label className="cursor-pointer block">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform">
                            <User className="w-9 h-9 text-white" />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onFileChange}
                        />
                    </label>
                )}
            </div>

            <div className="flex gap-2 mt-3">
                <label className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer transition-colors">
                    Upload Photo
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={onFileChange}
                    />
                </label>
                <button
                    onClick={onToggleAvatars}
                    className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                >
                    Random Avatar
                </button>
            </div>

            {showRandomAvatars && (
                <div className="grid grid-cols-6 gap-2 mt-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg animate-slideIn">
                    {randomAvatars.map((avatar, idx) => (
                        <img
                            key={idx}
                            src={avatar}
                            className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                            onClick={() => onAvatarSelect(avatar)}
                            alt={`avatar-${idx}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}