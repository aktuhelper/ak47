import React from "react";
import { CheckCircle } from "lucide-react"; // ← remove Trash2 import
import { MiniBadge } from "@/app/_loggedinHome/_card/MiniBadge";
import { getUserBadges } from "@/app/_loggedinHome/_card/getUserBadges";

export const AnswerAuthorRow = ({ answer, userData, formatTimeAgo }) => {
    const isUserAnswer = userData?.documentId === answer.user_profile?.documentId;

    const profileImageUrl =
        answer.user_profile?.profileImageUrl ||
        answer.user_profile?.profilePic ||
        answer.user_profile?.profileImage?.url ||
        "/default-avatar.png";

    const meta = [
        answer.user_profile?.course,
        answer.user_profile?.branch,
        answer.user_profile?.year,
    ]
        .filter(Boolean)
        .join(" · ") || "—";

    return (
        <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={profileImageUrl}
                    className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 object-cover flex-shrink-0"
                    alt={answer.user_profile?.name || "User"}
                    onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                            {answer.user_profile?.name || "Unknown User"}
                        </span>
                        {answer.user_profile?.isVerified && (
                            <CheckCircle
                                className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                                fill="currentColor"
                                strokeWidth={0}
                            />
                        )}
                        {getUserBadges(answer.user_profile || {}).map((badge) => (
                            <MiniBadge badge={badge} key={badge.id} />
                        ))}
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        {meta}{" "}
                        <span className="text-zinc-300 dark:text-zinc-700">·</span>{" "}
                        {formatTimeAgo(answer.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
};