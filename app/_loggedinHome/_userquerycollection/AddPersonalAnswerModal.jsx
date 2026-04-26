"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Send, CheckCircle, Loader2, Lock, AlertTriangle } from "lucide-react";
import { MiniBadge } from "../_card/MiniBadge";
import { getUserBadges } from "../_card/getUserBadges";
import { usePersonalQueryAnswers } from "../_userquerycollection/usePersonalQueryAnswers";
import { useDeadlineCountdown } from '../_userquerycollection/useDeadlineCountdown';
import toast from 'react-hot-toast';
import { checkAnswerRelevance } from "./checkAnswerRelevance";

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
    const [relevanceCheck, setRelevanceCheck] = useState(null);
    const [checkingRelevance, setCheckingRelevance] = useState(false);
    const [isPartner, setIsPartner] = useState(true);
    const [isPartnerChecked, setIsPartnerChecked] = useState(false);
    // Add this with your other useState declarations
    const openedAt = useRef(null);
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
        setRelevanceCheck(null);
        setCheckingRelevance(false);
        openedAt.current = Date.now(); // ✅ add this line
        const isPaidQuery = (query?.amount_paise ?? 0) > 0;
        if (isOpen && isPaidQuery && userData?.documentId && !isEdit) {
            fetch('/api/strapi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: `user-profiles/${userData.documentId}`,
                    method: 'GET',
                }),
            })
                .then(r => r.json())
                .then(data => {
                    setIsPartner(data?.data?.isPartner ?? false);
                    setIsPartnerChecked(true);
                })
                .catch(() => {
                    setIsPartner(false);
                    setIsPartnerChecked(true);
                });
        } else {
            setIsPartner(true);
            setIsPartnerChecked(true);
        }
    }, [isEdit, existingAnswer, isOpen]);

    if (!isOpen || !query) return null;

    const wordCount = answerText.trim() === "" ? 0 : answerText.trim().split(/\s+/).filter(Boolean).length;

    const isSubmitDisabled =
        !answerText.trim() ||
        wordCount < 15 ||
        submitting ||
        isExpired ||
        !isPartner ||
        checkingRelevance ||
        (relevanceCheck !== null && !relevanceCheck.isRelevant);

    const handleSubmit = async () => {
        if (!answerText.trim() || !userData?.documentId) return;

        const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 15) {
            toast.error(`Answer is too short. Please write at least 15 words. (${wordCount}/15)`);
            return;
        }

        setCheckingRelevance(true);
        setRelevanceCheck(null);
        try {
            const result = await checkAnswerRelevance(
                query.title,
                query.description,
                answerText
            );
            setRelevanceCheck(result);
            if (!result.isRelevant) {
                setCheckingRelevance(false);
                return;
            }
        } catch (err) {
            console.error("Relevance check failed:", err);
            toast.error("Could not verify answer relevance. Please try again.");
            setCheckingRelevance(false);
            return;
        }
        setCheckingRelevance(false);
        const timeSpent = Date.now() - openedAt.current;
        if (timeSpent < 30000) {
            toast.error("Please take more time to write a thoughtful answer.");
            return;
        }
        const querySenderDocId =
            query.fromUser?.documentId ||
            query.user_profile?.documentId ||
            query.user?.documentId;

        const submitAction = async () => {
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
                                senderEmail,
                                senderName,
                                receiverName,
                                queryTitle: query.title,
                                queryDescription: query.description,
                                amountPaise: query.amount_paise ?? 0,
                            }),
                        });
                        if (!emailRes.ok) {
                            const errBody = await emailRes.json().catch(() => ({}));
                            console.error('Answer notification email error:', emailRes.status, errBody);
                        }
                    }
                } catch (emailErr) {
                    console.error('Answer notification email failed:', emailErr);
                }
            }

            return result;
        };

        try {
            const result = await toast.promise(submitAction(), {
                loading: isEdit ? 'Saving changes...' : 'Posting answer...',
                success: isEdit ? 'Answer updated successfully!' : 'Answer posted successfully!',
                error: (err) => err.message || 'Failed to submit answer. Please try again.',
            });

            if (onAnswerSubmitted && result?.newCount !== undefined) {
                onAnswerSubmitted(result.newCount);
            }

            setAnswerText("");
            setRelevanceCheck(null);
            onClose();

        } catch (err) {
            console.error("❌ Failed to submit personal answer:", err);
        }
    };

    const querySender = query.fromUser || query.user;

    return (
        // FIX 1: was `<` — missing `div` tag name
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

                    {/* PARTNER REQUIRED BANNER */}
                    {!isPartner && isPartnerChecked && (query?.amount_paise ?? 0) > 0 && (
                        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                        Partner registration required
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                                        This is a paid query (₹{((query?.amount_paise ?? 0) / 100).toFixed(0)}).
                                        You need to register as a partner and add your UPI ID to answer
                                        paid queries and receive payments.
                                    </p>
                                    {/* FIX 2: was a bare `href=` attribute — restored the opening `<a` tag */}
                                    <a
                                        href="#"
                                        className="inline-block mt-2 text-xs font-semibold text-amber-800 dark:text-amber-300 underline underline-offset-2 hover:opacity-80"
                                    >
                                        Go to profile → Become a Partner
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EXPIRED WARNING */}
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
                        onChange={(e) => {
                            setAnswerText(e.target.value);
                            if (relevanceCheck !== null) setRelevanceCheck(null);
                        }}
                        onPaste={(e) => e.preventDefault()}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onDrop={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                        
                        className={`w-full h-48 md:h-40 p-3 bg-zinc-100 dark:bg-zinc-800 border rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${relevanceCheck && !relevanceCheck.isRelevant
                            ? 'border-red-400 dark:border-red-600 focus:ring-red-400'
                            : relevanceCheck?.isRelevant
                                ? 'border-green-400 dark:border-green-600 focus:ring-green-400'
                                : 'border-zinc-200 dark:border-zinc-700'
                            }`}
                        placeholder={
                            isExpired
                                ? "This query has expired and cannot be answered."
                                : !isPartner && (query?.amount_paise ?? 0) > 0
                                    ? "Register as a partner to answer paid queries."
                                    : "Type your answer to this personal query..."
                        }
                        disabled={submitting || isExpired || (!isPartner && (query?.amount_paise ?? 0) > 0)}
                    />

                    {/* WORD COUNT */}
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 text-right">
                        {wordCount} / min 15 words
                    </p>

                    {/* AI RELEVANCE FEEDBACK */}
                    {checkingRelevance && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                            Checking answer quality and relevance...
                        </div>
                    )}

                    {/* SAFETY BLOCK */}
                    {relevanceCheck && relevanceCheck.safetyBlock && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                                        Unsafe content detected
                                    </p>
                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                        {relevanceCheck.reason}
                                    </p>
                                    {relevanceCheck.guidance && (
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                                            {relevanceCheck.guidance}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QUALITY BLOCK (score ≤ 6, not a safety issue) */}
                    {relevanceCheck && relevanceCheck.qualityBlock && !relevanceCheck.safetyBlock && (
                        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                            Answer quality too low to submit
                                        </p>
                                        {/* Quality score badge */}
                                        {typeof relevanceCheck.qualityScore === "number" && (
                                            <span className="text-xs font-bold px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full">
                                                {relevanceCheck.qualityScore}/10
                                            </span>
                                        )}
                                    </div>
                                    {relevanceCheck.reason && (
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                            {relevanceCheck.reason}
                                        </p>
                                    )}
                                    {relevanceCheck.guidance && (
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                                            {relevanceCheck.guidance}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GENERIC IRRELEVANT (no qualityBlock, no safetyBlock) */}
                    {relevanceCheck && !relevanceCheck.isRelevant && !relevanceCheck.qualityBlock && !relevanceCheck.safetyBlock && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                                        Your answer doesn't seem relevant to the question.
                                    </p>
                                    {relevanceCheck.reason && (
                                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                            {relevanceCheck.reason}
                                        </p>
                                    )}
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                                        Please revise your answer to directly address what was asked.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PASS — relevant and quality score > 6 */}
                    {relevanceCheck?.isRelevant && (
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                Answer looks great — submitting now...
                            </div>
                            {typeof relevanceCheck.qualityScore === "number" && (
                                <span className="text-xs font-bold px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                    {relevanceCheck.qualityScore}/10
                                </span>
                            )}
                        </div>
                    )}
                    {/* PRIVACY NOTE */}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        This answer is only visible to you and the person who sent this query.
                    </p>

                    {/* BUTTONS */}
                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={onClose}
                            disabled={submitting || checkingRelevance}
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                            className={`px-4 py-1.5 text-white text-sm rounded-lg flex items-center gap-1 transition-all ${isSubmitDisabled
                                ? 'bg-zinc-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                        >
                            {checkingRelevance ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Checking...
                                </>
                            ) : submitting ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Send className="w-3 h-3" />
                                    {isEdit ? "Save Changes" : "Post Answer"}
                                </>
                            )}
                        </button>
                    </div>
                </div>{/* END BODY */}
            </div>
        </div>
    );
};