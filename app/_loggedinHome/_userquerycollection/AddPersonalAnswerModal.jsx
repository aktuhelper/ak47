"use client";
import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle, Loader2, Lock } from "lucide-react";
import { MiniBadge } from "../_card/MiniBadge";
import { getUserBadges } from "../_card/getUserBadges";
import { usePersonalQueryAnswers } from "../_userquerycollection/usePersonalQueryAnswers";
import { useDeadlineCountdown } from '../_userquerycollection/useDeadlineCountdown';

export const AddPersonalAnswerModal = ({
    query,
    isOpen,
    onClose,
    userData,
    onAnswerSubmitted,
    isEdit = false,
    existingAnswer = null
}) => {

    const [answerText, setAnswerText] = useState("");
    const { timeLeft, isExpired } = useDeadlineCountdown(
        query.createdAt,
        query.deadline_hours
    );

    const {
        submitPersonalAnswer,
        updatePersonalAnswer,
        submitting,
        error
    } = usePersonalQueryAnswers();

    useEffect(() => {
        if (isEdit && existingAnswer) {
            setAnswerText(existingAnswer.answerText || "");
        } else {
            setAnswerText("");
        }
    }, [isEdit, existingAnswer, isOpen]);

    if (!isOpen || !query) return null;

    const handleSubmit = async () => {
        if (!answerText.trim() || !userData?.documentId) return;

        const querySenderDocId = query.fromUser?.documentId || query.user_profile?.documentId || query.user?.documentId;

        try {
            let result;

            if (isEdit && existingAnswer) {
                result = await updatePersonalAnswer(
                    existingAnswer.documentId,
                    answerText,
                    userData.documentId,
                    existingAnswer.user_profile?.documentId
                );
            } else {
                result = await submitPersonalAnswer(
                    query.documentId,
                    answerText,
                    userData.documentId,
                    querySenderDocId
                );
            }

            // ⭐ Send email to query sender — only on NEW answer, not edit
            if (!isEdit) {
                try {
                    const senderEmail = query.fromUser?.email || query.user?.email || null;
                    const senderName = query.fromUser?.name || query.user?.name || 'User';
                    const receiverName = userData?.name || userData?.username || 'Someone';

                    if (senderEmail) {
                        const emailRes = await fetch('/api/send-answer-notification', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                senderEmail,       // query asker's email
                                senderName,        // query asker's name
                                receiverName,      // answerer's name (current user)
                                queryTitle: query.title,
                                queryDescription: query.description,
                                amountPaise: query.amount_paise ?? 0,
                            }),
                        });

                        if (!emailRes.ok) {
                            const errBody = await emailRes.json().catch(() => ({}));
                            console.error('Answer notification email error:', emailRes.status, errBody);
                        }
                    } else {
                        console.warn('⚠️ No sender email found, skipping notification');
                    }
                } catch (emailErr) {
                    // Non-blocking — answer still saved even if email fails
                    console.error('Answer notification email failed (network):', emailErr);
                }
            }

            if (onAnswerSubmitted && result?.newCount !== undefined) {
                onAnswerSubmitted(result.newCount);
            }

            setAnswerText("");
            onClose();

        } catch (err) {
            console.error("❌ Failed to submit personal answer:", err);
            alert(err.message || 'Failed to submit answer. Please try again.');
        }
    };

    const querySender = query.fromUser || query.user;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 w-full h-full md:h-auto md:max-w-2xl md:rounded-xl md:max-h-[90vh] overflow-y-auto shadow-lg border-0 md:border border-zinc-200 dark:border-zinc-800 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                            {isEdit ? "Edit Personal Answer" : "Answer Personal Query"}
                        </h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            Private
                        </div>
                        {(() => {
                            const paise = query.amount_paise ?? 0;
                            const isPaid = paise > 0;
                            return (
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${isPaid
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-700/50'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-700/50'
                                    }`}>
                                    {isPaid ? `₹${(paise / 100).toFixed(0)}` : 'Free'}
                                    {isPaid && timeLeft && (
                                        <>
                                            <span className="opacity-40 mx-0.5">•</span>
                                            <span className={isExpired ? 'text-red-500' : ''}>
                                                {timeLeft}
                                            </span>
                                        </>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-4">

                    {/* QUESTION PREVIEW */}
                    <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-purple-200 dark:border-purple-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={querySender?.profileImageUrl || querySender?.profilePic || '/default-avatar.png'}
                                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                                alt={querySender?.name || 'User'}
                            />
                            <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                                        {querySender?.name || 'Unknown User'}
                                    </span>
                                    {querySender?.isVerified && (
                                        <CheckCircle className="w-3.5 h-3.5 text-zinc-500" fill="white" strokeWidth={2.5} />
                                    )}
                                    {getUserBadges(querySender || {}).map((badge) => (
                                        <MiniBadge badge={badge} key={badge.id} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-md font-extrabold text-zinc-900 dark:text-zinc-100">
                            {query.title}
                        </p>

                        {query.description && (
                            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mt-1">
                                {query.description}
                            </p>
                        )}
                    </div>

                    {/* ⭐ EXPIRED WARNING */}
                    {isExpired && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                ⏰ This query's deadline has passed and can no longer be answered.
                            </p>
                        </div>
                    )}

                    {/* TEXTAREA */}
                    <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full h-48 md:h-40 p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={isExpired ? "This query has expired and cannot be answered." : "Type your answer to this personal query..."}
                        disabled={submitting || isExpired}
                    />

                    {error && (
                        <p className="text-xs text-red-500 mt-2">
                            {error || 'Failed to submit answer. Please try again.'}
                        </p>
                    )}

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        This answer is only visible to you and the person who sent this query.
                    </p>

                    {/* BUTTONS */}
                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={onClose}
                            disabled={submitting}
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!answerText.trim() || submitting || isExpired}
                            className={`px-4 py-1.5 text-white text-sm rounded-lg flex items-center gap-1 transition-all
                                ${!answerText.trim() || submitting || isExpired
                                    ? 'bg-zinc-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Send className="w-3 h-3" />
                                    {isEdit ? "Save Changes" : "Post Answer"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};