import React from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function UsernameInput({
    username,
    usernameAvailable,
    checkingUsername,
    onChange
}) {
    const getBorderColor = () => {
        if (usernameAvailable === false) {
            return 'border-red-500 focus:ring-red-500';
        }
        if (usernameAvailable === true) {
            return 'border-green-500 focus:ring-green-500';
        }
        return 'border-gray-300 dark:border-zinc-700 focus:ring-blue-500 dark:focus:ring-blue-400';
    };

    return (
        <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Username
            </label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400 text-sm">
                    @
                </span>
                <input
                    type="text"
                    placeholder="johndoe"
                    className={`w-full pl-7 pr-10 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm ${getBorderColor()}`}
                    value={username}
                    onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s/g, ''))}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checkingUsername && (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                    {!checkingUsername && usernameAvailable === true && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                </div>
            </div>

            {username.length > 0 && username.length < 3 && (
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    Username must be at least 3 characters
                </p>
            )}
            {usernameAvailable === true && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Username is available!
                </p>
            )}
            {usernameAvailable === false && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Username is already taken
                </p>
            )}
        </div>
    );
}