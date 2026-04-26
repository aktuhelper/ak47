import React from "react";
import {  ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

export const AnswerActionButtons = ({
    answer,
    isAccepting,
    isRejecting,
    onAccept,
    onReject,
}) => {
    const isAnyLoading =  isAccepting || isRejecting;

    return (
        <div className="flex items-center gap-2.5 flex-wrap pt-4 border-t border-zinc-100 dark:border-zinc-800/60">

            {/* Accept */}
            <button
                onClick={() => onAccept(answer)}
                disabled={isAnyLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${isAccepting
                        ? "opacity-60 cursor-not-allowed bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400"
                        : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm"
                    }`}
                title="Accept this answer"
            >
                {isAccepting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <ThumbsUp className="w-3.5 h-3.5" />
                )}
                Accept
            </button>

            {/* Reject */}
            <button
                onClick={() => onReject(answer)}
                disabled={isAnyLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${isRejecting
                        ? "opacity-60 cursor-not-allowed bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40 text-red-500 dark:text-red-400"
                        : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-400 dark:hover:border-red-600 shadow-sm"
                    }`}
                title="Reject this answer"
            >
                {isRejecting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <ThumbsDown className="w-3.5 h-3.5" />
                )}
                Reject
            </button>

        </div>
    );
};