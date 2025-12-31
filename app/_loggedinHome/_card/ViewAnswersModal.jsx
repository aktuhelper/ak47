"use client";
import React, { useState, useEffect } from "react";
import { X, User, CheckCircle, Loader2, Trash2, ThumbsUp, Award } from "lucide-react";
import { MiniBadge } from "./MiniBadge";
import { getUserBadges } from "./getUserBadges";
import { useAnswers } from "../_userquerycollection/useAnswers";
import { DeleteConfirmationModal } from "../_userquerycollection/DeleteConfirmationModal";
import { useQueryViews } from "../_userquerycollection/useQueryViews";
import { deleteFromStrapi } from '@/secure/strapi'; // ✅ Import secure wrapper

export const ViewAnswersModal = ({ query, isOpen, onClose, userData, onAnswerDeleted }) => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchAnswersForQuery, toggleUpvote, markBestAnswer } = useAnswers();
    const { trackQueryView } = useQueryViews();

    // ⭐ Delete state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [answerToDelete, setAnswerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ⭐ Loading states for upvote/best answer actions
    const [votingAnswerId, setVotingAnswerId] = useState(null);
    const [markingBestAnswerId, setMarkingBestAnswerId] = useState(null);

    useEffect(() => {
        if (isOpen && query?.documentId) {
            loadAnswers();

            // ⭐ Track view when modal opens
            if (userData?.documentId) {
                trackQueryView(query.documentId, userData.documentId).then((result) => {
                    // If view was counted, refresh stats
                    if (result?.counted && onAnswerDeleted) {
                    
                        onAnswerDeleted(); // Reuse this callback to refresh
                    }
                });
            }
        }
    }, [isOpen, query]);

    const loadAnswers = async () => {
        setLoading(true);
        try {
          
            // ⭐ Pass userData.documentId to check vote status
            const fetchedAnswers = await fetchAnswersForQuery(query.documentId, userData?.documentId);
           
            setAnswers(fetchedAnswers);
        } catch (err) {
       
        } finally {
            setLoading(false);
        }
    };

    // ⭐ Handle upvote
    const handleUpvote = async (answer) => {
        if (!userData?.documentId) {
            alert('Please log in to vote!');
            return;
        }

        setVotingAnswerId(answer.documentId);
        try {
     
            const result = await toggleUpvote(answer.documentId, userData.documentId);

            // Update local state
            setAnswers(prev => prev.map(a =>
                a.documentId === answer.documentId
                    ? {
                        ...a,
                        helpfulCount: result.newCount,
                        userHasVoted: result.voted
                    }
                    : a
            ));

            
        } catch (error) {
           
            alert('Failed to update vote. Please try again.');
        } finally {
            setVotingAnswerId(null);
        }
    };

    // ⭐ Handle mark as best answer
    const handleMarkBestAnswer = async (answer) => {
        // ⭐ SECURITY CHECK: Only query author can mark best answer
        const isQueryAuthor = userData?.documentId === query.user?.documentId;

        if (!isQueryAuthor) {
            alert('Only the query author can mark the best answer!');
            return;
        }

        setMarkingBestAnswerId(answer.documentId);
        try {
           
            await markBestAnswer(answer.documentId, query.documentId);

            // Update local state - remove best answer from all, set only this one
            setAnswers(prev => prev.map(a => ({
                ...a,
                isBestAnswer: a.documentId === answer.documentId
            })));

 
            // ⭐ Notify parent to refresh stats
            if (onAnswerDeleted) {
                onAnswerDeleted();
            }
        } catch (error) {
          
            alert('Failed to mark best answer. Please try again.');
        } finally {
            setMarkingBestAnswerId(null);
        }
    };

    // ⭐ Delete answer handler with authorization check
    const handleDeleteAnswer = async () => {
        if (!answerToDelete) return;

        // ⭐ SECURITY CHECK: Verify user is the answer author
        const isAnswerAuthor = userData?.documentId === answerToDelete.user?.documentId;


        if (!isAnswerAuthor) {
        
            alert('You can only delete your own answers!');
            setDeleteModalOpen(false);
            setAnswerToDelete(null);
            return;
        }

        setIsDeleting(true);
        try {
            // ✅ Use secure wrapper
            await deleteFromStrapi(`answers/${answerToDelete.documentId}`);

        

            // Remove from local state
            setAnswers(prev => prev.filter(a => a.documentId !== answerToDelete.documentId));

            // ⭐ Notify parent that answer was deleted
            if (onAnswerDeleted) {
                onAnswerDeleted();
            }

            // Close delete modal
            setDeleteModalOpen(false);
            setAnswerToDelete(null);

        } catch (err) {
    
            alert('Failed to delete answer. Please try again.');
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

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return `${Math.floor(diffInHours / 24)} days ago`;
    };

    // ⭐ Check if current user is the query author
    const isQueryAuthor = userData?.documentId === query.user?.documentId;

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <div
                    className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Answers</h3>
                        <button
                            onClick={onClose}
                            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-6">
                        {/* Question Header with User Info and Badges */}
                        <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={query.user.profileImageUrl || query.user.avatar}
                                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                                    alt={query.user.name}
                                />
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                            {query.user.name}
                                        </span>
                                        {query.user.isVerified && (
                                            <div className="relative w-4 h-4">
                                                <CheckCircle
                                                    className="w-4 h-4 text-zinc-500 dark:text-zinc-600"
                                                    fill="white"
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        )}
                                        {getUserBadges(query.user).map((badge) => (
                                            <MiniBadge badge={badge} key={badge.id} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                        {query.user.branch} • {query.user.college}
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                                {query.title}
                            </h2>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {query.description}
                            </p>
                        </div>

                        {/* Answers Section */}
                        <div className="space-y-6">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                                {loading ? '...' : `${answers.length} ${answers.length === 1 ? 'Answer' : 'Answers'}`}
                            </h3>

                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                                </div>
                            ) : answers.length === 0 ? (
                                <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                                    No answers yet. Be the first to answer!
                                </p>
                            ) : (
                                answers.map((answer) => {
                                    // ⭐ Check if this answer belongs to the current user
                                    const isUserAnswer = userData?.documentId === answer.user?.documentId;

                                    return (
                                        <div
                                            key={answer.id}
                                            className={`border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0 ${answer.isBestAnswer ? 'bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-lg -mx-4' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3 mb-3">
                                                <img
                                                    src={answer.user.profileImageUrl || '/default-avatar.png'}
                                                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                                                    alt={answer.user.name}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                                                    {answer.user.name}
                                                                </p>
                                                                {answer.user.isVerified && (
                                                                    <div className="relative w-3.5 h-3.5">
                                                                        <CheckCircle
                                                                            className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-600"
                                                                            fill="white"
                                                                            strokeWidth={2.5}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {getUserBadges(answer.user).map((badge) => (
                                                                    <MiniBadge badge={badge} key={badge.id} />
                                                                ))}
                                                            </div>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                {answer.user.course} • {answer.user.branch} • {answer.user.year}
                                                            </p>
                                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                                                                {formatTimeAgo(answer.createdAt)}
                                                            </p>
                                                        </div>

                                                        {/* ⭐ Delete button - only for answer author */}
                                                        {isUserAnswer && (
                                                            <button
                                                                onClick={() => openDeleteConfirmation(answer)}
                                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                                                title="Delete answer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ⭐ Best Answer Badge - Show at top if marked */}
                                            {answer.isBestAnswer && (
                                                <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold">
                                                    <Award className="w-4 h-4" />
                                                    Best Answer
                                                </div>
                                            )}

                                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap mb-3">
                                                {answer.answerText}
                                            </p>

                                            {/* ⭐ Action Buttons: Upvote & Mark as Best */}
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {/* ⭐ Upvote Button - Available to all users */}
                                                {/* ⭐ Upvote Button - Available to all users */}
                                                <button
                                                    onClick={() => handleUpvote(answer)}
                                                    disabled={votingAnswerId === answer.documentId}
                                                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${answer.userHasVoted
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                            : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500'
                                                        } ${votingAnswerId === answer.documentId ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {votingAnswerId === answer.documentId ? (
                                                        <div className="relative">
                                                            <ThumbsUp
                                                                className="w-4 h-4 animate-bounce"
                                                                fill={answer.userHasVoted ? "currentColor" : "none"}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <ThumbsUp
                                                            className="w-4 h-4"
                                                            fill={answer.userHasVoted ? "currentColor" : "none"}
                                                        />
                                                    )}
                                                    <span className="font-semibold">{answer.helpfulCount || 0}</span>
                                                </button>
                                                {/* ⭐ Mark as Best Answer - Only for query author, hide if already marked */}
                                                {isQueryAuthor && !answer.isBestAnswer && (
                                                    <button
                                                        onClick={() => handleMarkBestAnswer(answer)}
                                                        disabled={markingBestAnswerId === answer.documentId}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors ${markingBestAnswerId === answer.documentId ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        {markingBestAnswerId === answer.documentId ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Award className="w-3.5 h-3.5" />
                                                        )}
                                                        Mark as Best
                                                    </button>
                                                )}
                                            </div>

                                            {/* Old accepted answer badge - can be removed if not needed */}
                                            {answer.isAccepted && (
                                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Accepted Answer
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ⭐ Delete Confirmation Modal */}
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