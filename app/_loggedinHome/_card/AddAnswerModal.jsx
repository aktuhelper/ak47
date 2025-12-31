"use client";
import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle, Loader2 } from "lucide-react";
import { MiniBadge } from "./MiniBadge";
import { getUserBadges } from "./getUserBadges";
import { useAnswers } from "../_userquerycollection/useAnswers";
import { useQueryViews } from "../_userquerycollection/useQueryViews"; // ⭐ NEW IMPORT

export const AddAnswerModal = ({
    query,
    isOpen,
    onClose,
    userData,
    onAnswerSubmitted,
    isEdit = false,
    existingAnswer = null
}) => {

    const [answerText, setAnswerText] = useState("");

    const {
        submitAnswer,
        updateAnswer,
        submitting,
        error
    } = useAnswers();

    const { trackQueryView } = useQueryViews(); // ⭐ NEW HOOK

    // ⭐ Prefill text when editing
    useEffect(() => {
        if (isEdit && existingAnswer) {
            setAnswerText(existingAnswer.answerText || "");
        } else {
            setAnswerText("");
        }
    }, [isEdit, existingAnswer]);

    // ⭐ NEW: Track view when modal opens
    useEffect(() => {
        if (isOpen && query?.documentId && userData?.documentId) {
        

            // Track the view
            trackQueryView(query.documentId, userData.documentId).then((result) => {
                // If view was counted, refresh the parent
                if (result?.counted && onAnswerSubmitted) {
              
                    onAnswerSubmitted(); // This triggers parent to refresh
                }
            });
        }
    }, [isOpen, query?.documentId, userData?.documentId]);

    if (!isOpen || !query) return null;

    const handleSubmit = async () => {
        if (!answerText.trim() || !userData?.documentId) return;

        try {
            let result;

            if (isEdit && existingAnswer) {
                // ⭐ EDIT MODE → Update existing answer
                result = await updateAnswer(existingAnswer.documentId, answerText);
            } else {
                // ⭐ NORMAL MODE → Post new answer
                result = await submitAnswer(query.documentId, answerText, userData.documentId);
            }

            if (onAnswerSubmitted && result?.newCount !== undefined) {
                onAnswerSubmitted(result.newCount);
            }

            onClose();

        } catch (err) {
            console.error("❌ Failed to submit answer:", err);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-900 max-w-lg w-full rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {isEdit ? "Edit Answer" : "Write an Answer"}
                    </h3>
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
                    <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={query.user.profileImageUrl || query.user.avatar}
                                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                                alt={query.user.name}
                            />
                            <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                                        {query.user.name}
                                    </span>
                                    {query.user.isVerified && (
                                        <CheckCircle className="w-3.5 h-3.5 text-zinc-500" fill="white" strokeWidth={2.5} />
                                    )}
                                    {getUserBadges(query.user).map((badge) => (
                                        <MiniBadge badge={badge} key={badge.id} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-md font-extrabold text-zinc-900 dark:text-zinc-100">
                            {query.title}
                        </p>
                        {query.description && (
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {query.description}
                            </p>
                        )}
                    </div>

                    {/* TEXTAREA */}
                    <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full h-32 p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your answer..."
                        disabled={submitting}
                    />

                    {error && (
                        <p className="text-xs text-red-500 mt-2">
                            Failed to submit answer. Please try again.
                        </p>
                    )}

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
                            disabled={!answerText.trim() || submitting}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white text-sm rounded-lg flex items-center gap-1"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Send className="w-3 h-3" />
                                    {isEdit ? "Save Changes" : "Post"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};