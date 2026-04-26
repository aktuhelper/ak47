"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle, Loader2, Trash2, ThumbsUp, Award } from "lucide-react";
import { MiniBadge } from "./MiniBadge";
import { getUserBadges } from "./getUserBadges";
import { useAnswers } from "../_userquerycollection/useAnswers";
import { DeleteConfirmationModal } from "../_userquerycollection/DeleteConfirmationModal";
import { useQueryViews } from "../_userquerycollection/useQueryViews";
import { deleteFromStrapi } from "@/secure/strapi";

export const ViewAnswersModal = ({ query, isOpen, onClose, userData, onAnswerDeleted }) => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchAnswersForQuery, toggleUpvote, markBestAnswer } = useAnswers();
    const { trackQueryView } = useQueryViews();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [answerToDelete, setAnswerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [votingAnswerId, setVotingAnswerId] = useState(null);
    const [markingBestAnswerId, setMarkingBestAnswerId] = useState(null);

    useEffect(() => {
        if (isOpen && query?.documentId) {
            loadAnswers();
            if (userData?.documentId) {
                trackQueryView(query.documentId, userData.documentId).then((result) => {
                    if (result?.counted && onAnswerDeleted) {
                        onAnswerDeleted();
                    }
                });
            }
        }
    }, [isOpen, query]);

    const loadAnswers = async () => {
        setLoading(true);
        try {
            const fetchedAnswers = await fetchAnswersForQuery(query.documentId, userData?.documentId);
            setAnswers(fetchedAnswers);
        } catch (err) {
            console.error("Failed to load answers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (answer) => {
        if (!userData?.documentId) {
            alert("Please log in to vote!");
            return;
        }
        setVotingAnswerId(answer.documentId);
        try {
            const result = await toggleUpvote(answer.documentId, userData.documentId);
            setAnswers((prev) =>
                prev.map((a) =>
                    a.documentId === answer.documentId
                        ? { ...a, helpfulCount: result.newCount, userHasVoted: result.voted }
                        : a
                )
            );
        } catch (error) {
            alert("Failed to update vote. Please try again.");
        } finally {
            setVotingAnswerId(null);
        }
    };

    const handleMarkBestAnswer = async (answer) => {
        const isQueryAuthor = userData?.documentId === query.user?.documentId;
        if (!isQueryAuthor) {
            alert("Only the query author can mark the best answer!");
            return;
        }
        setMarkingBestAnswerId(answer.documentId);
        try {
            await markBestAnswer(answer.documentId, query.documentId);
            setAnswers((prev) =>
                prev.map((a) => ({ ...a, isBestAnswer: a.documentId === answer.documentId }))
            );
            if (onAnswerDeleted) onAnswerDeleted();
        } catch (error) {
            alert("Failed to mark best answer. Please try again.");
        } finally {
            setMarkingBestAnswerId(null);
        }
    };

    const handleDeleteAnswer = async () => {
        if (!answerToDelete) return;
        const isAnswerAuthor = userData?.documentId === answerToDelete.user?.documentId;
        if (!isAnswerAuthor) {
            alert("You can only delete your own answers!");
            setDeleteModalOpen(false);
            setAnswerToDelete(null);
            return;
        }
        setIsDeleting(true);
        try {
            await deleteFromStrapi(`answers/${answerToDelete.documentId}`);
            setAnswers((prev) => prev.filter((a) => a.documentId !== answerToDelete.documentId));
            if (onAnswerDeleted) onAnswerDeleted();
            setDeleteModalOpen(false);
            setAnswerToDelete(null);
        } catch (err) {
            alert("Failed to delete answer. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteConfirmation = (answer) => {
        setAnswerToDelete(answer);
        setDeleteModalOpen(true);
    };

    if (!isOpen || !query) return null;

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    const isQueryAuthor = userData?.documentId === query.user?.documentId;
    const bestAnswer = answers.find((a) => a.isBestAnswer);

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-stretch bg-white dark:bg-zinc-950"
                style={{ animation: "modalFadeIn 0.2s ease-out" }}
            >
                <style>{`
                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: translateY(8px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(12px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .va-answer-card {
                        animation: slideUp 0.25s ease-out both;
                    }
                    .va-scrollbar::-webkit-scrollbar { width: 4px; }
                    .va-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .va-scrollbar::-webkit-scrollbar-thumb { background: rgba(113,113,122,0.3); border-radius: 999px; }
                    .va-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(113,113,122,0.5); }
                `}</style>

                <div className="flex flex-col w-full h-full">

                    {/* Top bar */}
                    <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                                Answers
                            </span>
                            {!loading && (
                                <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                    {answers.length}
                                </span>
                            )}
                            {bestAnswer && (
                                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-full">
                                    <Award className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Solved</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors duration-150"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main layout */}
                    <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

                        {/* Left panel — Query info */}
                        <div className="lg:w-[260px] xl:w-[280px] flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800/80 overflow-y-auto va-scrollbar bg-zinc-50/40 dark:bg-zinc-900/30">
                            <div className="px-5 py-6 flex-1 flex flex-col gap-6">

                                {/* Query author profile */}
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={query.user?.profileImageUrl || query.user?.avatar || "/default-avatar.png"}
                                            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 object-cover shadow-sm"
                                            alt={query.user?.name || "User"}
                                            onError={(e) => { e.target.src = "/default-avatar.png"; }}
                                        />
                                        {query.user?.isVerified && (
                                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5">
                                                <CheckCircle className="w-3 h-3 text-blue-500" fill="currentColor" strokeWidth={0} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                                                {query.user?.name || "Unknown User"}
                                            </span>
                                            {getUserBadges(query.user || {}).map((badge) => (
                                                <MiniBadge badge={badge} key={badge.id} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                                            {[query.user?.branch, query.user?.college].filter(Boolean).join(" · ") || "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
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

                                {/* Divider */}
                                <div className="h-px bg-zinc-100 dark:bg-zinc-800/70" />

                                {/* Stats */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl">
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Answers</span>
                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                            {loading ? "—" : answers.length}
                                        </span>
                                    </div>
                                    {bestAnswer && (
                                        <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                                            <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                                            <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Solved</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right panel — Answers feed */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-zinc-950">
                            <div className="flex-1 overflow-y-auto va-scrollbar px-5 sm:px-7 py-5">

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                                        <Loader2 className="w-7 h-7 animate-spin text-zinc-400 dark:text-zinc-600" />
                                        <span className="text-sm text-zinc-400 dark:text-zinc-600">Loading answers…</span>
                                    </div>
                                ) : answers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                            <ThumbsUp className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No answers yet</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600">Be the first to answer!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-w-3xl">
                                        {answers.map((answer, index) => {
                                            const isUserAnswer = userData?.documentId === answer.user?.documentId;
                                            const isVoting = votingAnswerId === answer.documentId;
                                            const isMarkingBest = markingBestAnswerId === answer.documentId;

                                            return (
                                                <div
                                                    key={answer.id}
                                                    className={`va-answer-card rounded-2xl border transition-all duration-200 ${answer.isBestAnswer
                                                            ? "border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-900/10"
                                                            : "border-zinc-200 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700"
                                                        }`}
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <div className="p-4 sm:p-5">

                                                        {/* Best answer badge */}
                                                        {answer.isBestAnswer && (
                                                            <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 rounded-full w-fit">
                                                                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                                                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wide uppercase">Best Answer</span>
                                                            </div>
                                                        )}

                                                        {/* Accepted answer badge */}
                                                        {answer.isAccepted && !answer.isBestAnswer && (
                                                            <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-full w-fit">
                                                                <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                                                <span className="text-xs font-bold text-green-700 dark:text-green-400 tracking-wide uppercase">Accepted</span>
                                                            </div>
                                                        )}

                                                        {/* Answer author row */}
                                                        <div className="flex items-start justify-between gap-3 mb-4">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <img
                                                                    src={answer.user?.profileImageUrl || "/default-avatar.png"}
                                                                    className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-700 object-cover flex-shrink-0"
                                                                    alt={answer.user?.name || "User"}
                                                                    onError={(e) => { e.target.src = "/default-avatar.png"; }}
                                                                />
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                                                            {answer.user?.name || "Unknown User"}
                                                                        </span>
                                                                        {answer.user?.isVerified && (
                                                                            <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" strokeWidth={0} />
                                                                        )}
                                                                        {getUserBadges(answer.user || {}).map((badge) => (
                                                                            <MiniBadge badge={badge} key={badge.id} />
                                                                        ))}
                                                                    </div>
                                                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                                                        {[answer.user?.course, answer.user?.branch, answer.user?.year]
                                                                            .filter(Boolean)
                                                                            .join(" · ") || "—"}{" "}
                                                                        <span className="text-zinc-300 dark:text-zinc-700">·</span>{" "}
                                                                        {formatTimeAgo(answer.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {isUserAnswer && (
                                                                <button
                                                                    onClick={() => openDeleteConfirmation(answer)}
                                                                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150"
                                                                    title="Delete answer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Answer body */}
                                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap mb-5">
                                                            {answer.answerText}
                                                        </p>

                                                        {/* Action row */}
                                                        <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-zinc-100 dark:border-zinc-800/60">

                                                            {/* Upvote button */}
                                                            <button
                                                                onClick={() => handleUpvote(answer)}
                                                                disabled={isVoting}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 ${answer.userHasVoted
                                                                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                                                        : "bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700/60"
                                                                    } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                                                            >
                                                                {isVoting ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : (
                                                                    <ThumbsUp
                                                                        className="w-3.5 h-3.5"
                                                                        fill={answer.userHasVoted ? "currentColor" : "none"}
                                                                    />
                                                                )}
                                                                Helpful{" "}
                                                                <span className={`ml-0.5 ${answer.userHasVoted ? "text-blue-600 dark:text-blue-300" : ""}`}>
                                                                    ({answer.helpfulCount || 0})
                                                                </span>
                                                            </button>

                                                            {/* Mark as best */}
                                                            {isQueryAuthor && !answer.isBestAnswer && (
                                                                <button
                                                                    onClick={() => handleMarkBestAnswer(answer)}
                                                                    disabled={isMarkingBest}
                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 ${isMarkingBest
                                                                            ? "opacity-50 cursor-not-allowed bg-amber-50 dark:bg-amber-900/20 text-amber-500"
                                                                            : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                                                                        }`}
                                                                >
                                                                    {isMarkingBest ? (
                                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                    ) : (
                                                                        <Award className="w-3.5 h-3.5" />
                                                                    )}
                                                                    Mark as Best
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setAnswerToDelete(null);
                }}
                onConfirm={handleDeleteAnswer}
                title="Delete Answer"
                message="Are you sure you want to delete this answer?"
                isDeleting={isDeleting}
            />
        </>
    );
};
