"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle, Loader2, Trash2, Award, Lock } from "lucide-react";
import { MiniBadge } from "../_card/MiniBadge";
import { getUserBadges } from "../_card/getUserBadges";
import { useFetchPersonalAnswers } from "../_userquerycollection/useFetchPersonalAnswers";
import { usePersonalQueryAnswers } from "../_userquerycollection/usePersonalQueryAnswers";
import { DeleteConfirmationModal } from "../_userquerycollection/DeleteConfirmationModal";

export const ViewPersonalAnswersModal = ({ query, isOpen, onClose, userData, onAnswerDeleted }) => {
    const {
        answers,
        loading,
        refreshPersonalAnswers,
        hasUserVoted,
        getBestAnswer
    } = useFetchPersonalAnswers(query?.documentId, userData);

    const {
        deletePersonalAnswer,
        markAsBestAnswer,
        voteForAnswer
    } = usePersonalQueryAnswers();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [answerToDelete, setAnswerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [votingAnswerId, setVotingAnswerId] = useState(null);
    const [markingBestAnswerId, setMarkingBestAnswerId] = useState(null);

    const isQuerySender = userData?.documentId === query?.fromUser?.documentId;
    const isQueryReceiver = userData?.documentId === query?.toUser?.documentId;

    useEffect(() => {
        if (isOpen && query?.documentId) {
            refreshPersonalAnswers();
        }
    }, [isOpen, query?.documentId]);

    const handleUpvote = async (answer) => {
        if (!userData?.documentId) {
            alert("Please log in to vote!");
            return;
        }
        if (answer.user_profile?.documentId === userData.documentId) {
            alert("You cannot vote for your own answer!");
            return;
        }
        setVotingAnswerId(answer.documentId);
        try {
            await voteForAnswer(
                answer.documentId,
                userData.documentId,
                answer.user_profile?.documentId,
                answer.voters || []
            );
            await new Promise((resolve) => setTimeout(resolve, 300));
            await refreshPersonalAnswers();
        } catch (error) {
            alert(error.message || "Failed to update vote. Please try again.");
        } finally {
            setVotingAnswerId(null);
        }
    };

    const handleMarkBestAnswer = async (answer) => {
        if (!isQuerySender) {
            alert("Only the person who sent this query can mark the best answer!");
            return;
        }
        if (answer.user_profile?.documentId === query.fromUser?.documentId) {
            alert("You cannot mark your own answer as best!");
            return;
        }
        setMarkingBestAnswerId(answer.documentId);
        try {
            await markAsBestAnswer(
                answer.documentId,
                query.documentId,
                userData.documentId,
                query.fromUser?.documentId,
                answer.user_profile?.documentId
            );
            await new Promise((resolve) => setTimeout(resolve, 300));
            await refreshPersonalAnswers();
            if (onAnswerDeleted) onAnswerDeleted();
        } catch (error) {
            alert(error.message || "Failed to mark best answer. Please try again.");
        } finally {
            setMarkingBestAnswerId(null);
        }
    };

    const handleDeleteAnswer = async () => {
        if (!answerToDelete) return;
        const isAnswerAuthor = userData?.documentId === answerToDelete.user_profile?.documentId;
        if (!isAnswerAuthor) {
            alert("You can only delete your own answers!");
            setDeleteModalOpen(false);
            setAnswerToDelete(null);
            return;
        }
        setIsDeleting(true);
        try {
            await deletePersonalAnswer(
                answerToDelete.documentId,
                userData.documentId,
                answerToDelete.user_profile?.documentId,
                query.fromUser?.documentId
            );
            await new Promise((resolve) => setTimeout(resolve, 300));
            await refreshPersonalAnswers();
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
                    .answer-card {
                        animation: slideUp 0.25s ease-out both;
                    }
                    .answer-card:nth-child(1) { animation-delay: 0.05s; }
                    .answer-card:nth-child(2) { animation-delay: 0.1s; }
                    .answer-card:nth-child(3) { animation-delay: 0.15s; }
                    .answer-card:nth-child(4) { animation-delay: 0.2s; }
                    .answer-card:nth-child(5) { animation-delay: 0.25s; }
                    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(113,113,122,0.3); border-radius: 999px; }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(113,113,122,0.5); }
                `}</style>

                <div className="flex flex-col w-full h-full">

                    {/* Top bar */}
                    <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex items-center gap-2 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-full">
                                <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 tracking-wide uppercase">Private</span>
                            </div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600 hidden sm:inline">Personal Query</span>
                        </div>

                        <button
                            onClick={onClose}
                            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors duration-150"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main layout */}
                    <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

                        {/* Left panel — Query info */}
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

                        {/* Right panel — Answers */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-zinc-950">
                            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 sm:px-7 py-5">

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                                        <Loader2 className="w-7 h-7 animate-spin text-zinc-400 dark:text-zinc-600" />
                                        <span className="text-sm text-zinc-400 dark:text-zinc-600">Loading answers…</span>
                                    </div>
                                ) : answers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No answers yet</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-600">Be the first to respond!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-w-3xl">
                                        {answers.map((answer, index) => {
                                            const isUserAnswer = userData?.documentId === answer.user_profile?.documentId;
                                            const isOwnAnswer = answer.user_profile?.documentId === query.fromUser?.documentId;
                                            const isVoting = votingAnswerId === answer.documentId;
                                            const isMarkingBest = markingBestAnswerId === answer.documentId;

                                            return (
                                                <div
                                                    key={answer.documentId}
                                                    className={`answer-card rounded-2xl border transition-all duration-200 ${answer.isBestAnswer
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

                                                        {/* Answer author row */}
                                                        <div className="flex items-start justify-between gap-3 mb-4">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <img
                                                                    src={
                                                                        answer.user_profile?.profileImageUrl ||
                                                                        answer.user_profile?.profilePic ||
                                                                        answer.user_profile?.profileImage?.url ||
                                                                        "/default-avatar.png"
                                                                    }
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
                                                                            <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" strokeWidth={0} />
                                                                        )}
                                                                        {getUserBadges(answer.user_profile || {}).map((badge) => (
                                                                            <MiniBadge badge={badge} key={badge.id} />
                                                                        ))}
                                                                    </div>
                                                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                                                        {[answer.user_profile?.course, answer.user_profile?.branch, answer.user_profile?.year]
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
                                                                    title="Delete your answer"
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
                                                            {!answer.isBestAnswer && isQuerySender && !isOwnAnswer && (
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
                title="Delete Personal Answer"
                message="Are you sure you want to delete this answer from the personal query?"
                isDeleting={isDeleting}
            />
        </>
    );
};
