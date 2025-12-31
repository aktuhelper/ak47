"use client";
import React, { useState, useEffect } from "react";
import { X, User, CheckCircle, Loader2, Trash2, ThumbsUp, Award, Lock } from "lucide-react";
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
            alert('Please log in to vote!');
            return;
        }

        if (answer.user_profile?.documentId === userData.documentId) {
            alert('You cannot vote for your own answer!');
            return;
        }

        const alreadyVoted = hasUserVoted(answer, userData.documentId);

        setVotingAnswerId(answer.documentId);
        try {
            await voteForAnswer(
                answer.documentId,
                userData.documentId,
                answer.user_profile?.documentId,
                answer.voters || []
            );

            await new Promise(resolve => setTimeout(resolve, 300));
            await refreshPersonalAnswers();
        } catch (error) {
            alert(error.message || 'Failed to update vote. Please try again.');
        } finally {
            setVotingAnswerId(null);
        }
    };

    const handleMarkBestAnswer = async (answer) => {
        if (!isQuerySender) {
            alert('Only the person who sent this query can mark the best answer!');
            return;
        }

        if (answer.user_profile?.documentId === query.fromUser?.documentId) {
            alert('You cannot mark your own answer as best!');
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

            await new Promise(resolve => setTimeout(resolve, 300));
            await refreshPersonalAnswers();

            if (onAnswerDeleted) {
                onAnswerDeleted();
            }
        } catch (error) {
            alert(error.message || 'Failed to mark best answer. Please try again.');
        } finally {
            setMarkingBestAnswerId(null);
        }
    };

    const handleDeleteAnswer = async () => {
        if (!answerToDelete) return;

        const isAnswerAuthor = userData?.documentId === answerToDelete.user_profile?.documentId;

        if (!isAnswerAuthor) {
            alert('You can only delete your own answers!');
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

            await new Promise(resolve => setTimeout(resolve, 300));
            await refreshPersonalAnswers();

            if (onAnswerDeleted) {
                onAnswerDeleted();
            }

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

    const querySender = query.fromUser || query.user;

    let senderProfileImageUrl = '/default-avatar.png';

    if (querySender?.profileImage?.url) {
        senderProfileImageUrl = querySender.profileImage.url;
    } else if (querySender?.profileImageUrl) {
        senderProfileImageUrl = querySender.profileImageUrl;
    } else if (querySender?.profilePic?.url) {
        senderProfileImageUrl = querySender.profilePic.url;
    } else if (typeof querySender?.profilePic === 'string' && querySender.profilePic) {
        senderProfileImageUrl = querySender.profilePic;
    } else if (querySender?.documentId === userData?.documentId) {
        senderProfileImageUrl = userData?.profileImage?.url ||
            userData?.profileImageUrl ||
            userData?.profilePic ||
            '/default-avatar.png';
    }

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
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Personal Query Answers</h3>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                                <Lock className="w-3 h-3" />
                                Private
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-6">
                        <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={senderProfileImageUrl}
                                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                                    alt={querySender?.name || 'User'}
                                    onError={(e) => {
                                        e.target.src = '/default-avatar.png';
                                    }}
                                />
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                            {querySender?.name || 'Unknown User'}
                                        </span>
                                        {querySender?.isVerified && (
                                            <div className="relative w-4 h-4">
                                                <CheckCircle
                                                    className="w-4 h-4 text-zinc-500 dark:text-zinc-600"
                                                    fill="white"
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                        )}
                                        {getUserBadges(querySender || {}).map((badge) => (
                                            <MiniBadge badge={badge} key={badge.id} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                        {querySender?.branch || 'N/A'} • {querySender?.college || 'N/A'}
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

                        <div className="space-y-6">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                                {loading ? '...' : `${answers.length} ${answers.length === 1 ? 'Answer' : 'Answers'}`}
                            </h3>

                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                                    <span className="ml-2 text-sm text-zinc-500">Loading answers...</span>
                                </div>
                            ) : answers.length === 0 ? (
                                <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                                    No answers yet. Be the first to answer!
                                </p>
                            ) : (
                                answers.map((answer) => {
                                    const isUserAnswer = userData?.documentId === answer.user_profile?.documentId;

                                    return (
                                        <div
                                            key={answer.documentId}
                                            className={`border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0 ${answer.isBestAnswer ? 'bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-lg -mx-4' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3 mb-3">
                                                <img
                                                    src={
                                                        answer.user_profile?.profileImageUrl ||
                                                        answer.user_profile?.profilePic ||
                                                        answer.user_profile?.profileImage?.url ||
                                                        '/default-avatar.png'
                                                    }
                                                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                                                    alt={answer.user_profile?.name || 'User'}
                                                    onError={(e) => e.target.src = '/default-avatar.png'}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                                                    {answer.user_profile?.name || 'Unknown User'}
                                                                </p>
                                                                {answer.user_profile?.isVerified && (
                                                                    <div className="relative w-3.5 h-3.5">
                                                                        <CheckCircle
                                                                            className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-600"
                                                                            fill="white"
                                                                            strokeWidth={2.5}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {getUserBadges(answer.user_profile || {}).map((badge) => (
                                                                    <MiniBadge badge={badge} key={badge.id} />
                                                                ))}
                                                            </div>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                {answer.user_profile?.course || 'N/A'} • {answer.user_profile?.branch || 'N/A'} • {answer.user_profile?.year || 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                                                                {formatTimeAgo(answer.createdAt)}
                                                            </p>
                                                        </div>

                                                        {isUserAnswer && (
                                                            <button
                                                                onClick={() => openDeleteConfirmation(answer)}
                                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                                                title="Delete your answer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {answer.isBestAnswer && (
                                                <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold">
                                                    <Award className="w-4 h-4" />
                                                    Best Answer
                                                </div>
                                            )}

                                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap mb-3">
                                                {answer.answerText}
                                            </p>

                                            <div className="flex items-center gap-3 flex-wrap">
                                                {!answer.isBestAnswer && isQuerySender && (
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
                                        </div>
                                    );
                                })
                            )}
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