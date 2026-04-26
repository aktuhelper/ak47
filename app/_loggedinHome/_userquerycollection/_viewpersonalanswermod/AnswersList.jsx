import React from "react";
import { Loader2, Lock } from "lucide-react";
import { AnswerCard } from "./AnswerCard";

export const AnswersList = ({
    answers,
    loading,
    userData,
    query,
    isQuerySender,
    acceptingAnswerId,
    rejectingAnswerId,
    onAccept,
    onReject,
}) => {

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-zinc-950">
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 sm:px-7 py-5">

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-zinc-400 dark:text-zinc-600" />
                        <span className="text-sm text-zinc-400 dark:text-zinc-600">
                            Loading answers…
                        </span>
                    </div>

                ) : answers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            No answers yet
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">
                            Be the first to respond!
                        </p>
                    </div>

                ) : (
                    <div className="space-y-3 max-w-3xl">
                        {answers.map((answer, index) => (
                            <AnswerCard
                                key={answer.documentId}
                                answer={answer}
                                index={index}
                                userData={userData}
                                query={query}
                                isQuerySender={isQuerySender}
                                acceptingAnswerId={acceptingAnswerId}
                                rejectingAnswerId={rejectingAnswerId}
                                onAccept={onAccept}
                                onReject={onReject}
                                formatTimeAgo={formatTimeAgo}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};