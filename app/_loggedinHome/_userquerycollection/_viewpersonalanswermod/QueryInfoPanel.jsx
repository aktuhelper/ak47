import React from "react";
import { CheckCircle } from "lucide-react";
import { MiniBadge } from "@/app/_loggedinHome/_card/MiniBadge";
import { getUserBadges } from "@/app/_loggedinHome/_card/getUserBadges";

export const QueryInfoPanel = ({ query, userData, answers, loading }) => {
    const querySender = query.fromUser || query.user;

    let senderProfileImageUrl = "/default-avatar.png";
    if (querySender?.profileImage?.url) {
        senderProfileImageUrl = querySender.profileImage.url;
    } else if (querySender?.profileImageUrl) {
        senderProfileImageUrl = querySender.profileImageUrl;
    } else if (querySender?.profilePic?.url) {
        senderProfileImageUrl = querySender.profilePic.url;
    } else if (typeof querySender?.profilePic === "string" && querySender.profilePic) {
        senderProfileImageUrl = querySender.profilePic;
    } else if (querySender?.documentId === userData?.documentId) {
        senderProfileImageUrl =
            userData?.profileImage?.url ||
            userData?.profileImageUrl ||
            userData?.profilePic ||
            "/default-avatar.png";
    }

    return (
        <div className="lg:w-[260px] xl:w-[280px] flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800/80 overflow-y-auto scrollbar-thin bg-zinc-50/40 dark:bg-zinc-900/30">
            <div className="px-5 py-6 flex-1 flex flex-col gap-6">

                {/* Sender profile */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <img
                            src={senderProfileImageUrl}
                            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 object-cover shadow-sm"
                            alt={querySender?.name || "User"}
                            onError={(e) => { e.target.src = "/default-avatar.png"; }}
                        />
                        {querySender?.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5">
                                <CheckCircle className="w-3 h-3 text-blue-500" fill="currentColor" strokeWidth={0} />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                                {querySender?.name || "Unknown User"}
                            </span>
                            {getUserBadges(querySender || {}).map((badge) => (
                                <MiniBadge badge={badge} key={badge.id} />
                            ))}
                        </div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                            {[querySender?.branch, querySender?.college].filter(Boolean).join(" · ") || "—"}
                        </p>
                    </div>
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800/70" />

                {/* Query title & description */}
                <div>
                    <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-snug mb-2 tracking-tight">
                        {query.title}
                    </h1>
                    {query.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-5">
                            {query.description}
                        </p>
                    )}
                </div>

                <div className="h-px bg-zinc-100 dark:bg-zinc-800/70" />

                {/* Stats */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Answers</span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {loading ? "—" : answers.length}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};