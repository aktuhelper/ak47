import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export const AnswerStatusBadges = ({ isAccepted, isRejected }) => {
    if (!isAccepted && !isRejected) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {isAccepted && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 rounded-full">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                        Accepted
                    </span>
                </div>
            )}
            {isRejected && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/40 rounded-full">
                    <ThumbsDown className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 tracking-wide uppercase">
                        Rejected
                    </span>
                </div>
            )}
        </div>
    );
};