import React from "react";
import { AnswerStatusBadges } from "./AnswerStatusBadges";
import { AnswerAuthorRow } from "./AnswerAuthorRow";
import { AnswerActionButtons } from "./AnswerActionButtons";

export const AnswerCard = ({
    answer,
    index,
    userData,
    query,
    isQuerySender,
    acceptingAnswerId,
    rejectingAnswerId,
    onAccept,
    onReject,
    formatTimeAgo,
}) => {
    const isOwnAnswer = answer.user_profile?.documentId === query.fromUser?.documentId;
    const isAccepting = acceptingAnswerId === answer.documentId;
    const isRejecting = rejectingAnswerId === answer.documentId;

    const showSenderActions =
        isQuerySender &&
        !isOwnAnswer &&
        !answer.isAccepted &&
        !answer.isRejected;

    const cardBg = answer.isAccepted
        ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-900/10"
        : answer.isRejected
            ? "border-red-200 dark:border-red-800/40 bg-red-50/30 dark:bg-red-900/10"
            : "border-zinc-200 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700";

    return (
        <div
            className={`answer-card rounded-2xl border transition-all duration-200 ${cardBg}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="p-4 sm:p-5">

                <AnswerStatusBadges
                    isAccepted={answer.isAccepted}
                    isRejected={answer.isRejected}
                />

                <AnswerAuthorRow
                    answer={answer}
                    userData={userData}
                    formatTimeAgo={formatTimeAgo}
                />

                {/* Answer body */}
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap mb-5">
                    {answer.answerText}
                </p>

                {showSenderActions && (
                    <AnswerActionButtons
                        answer={answer}
                        isAccepting={isAccepting}
                        isRejecting={isRejecting}
                        onAccept={onAccept}
                        onReject={onReject}
                    />
                )}

            </div>
        </div>
    );
};