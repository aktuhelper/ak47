"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Eye, FileText, CheckCircle, Trash2, Lock } from "lucide-react";
import { MiniBadge } from "./_card/MiniBadge";
import { getUserBadges } from "./_card/getUserBadges";
import { FilePreviewModal } from "./_card/FilePreviewModal";
import { ViewAnswersModal } from "./_card/ViewAnswersModal";
import { AddAnswerModal } from "./_card/AddAnswerModal";
import { ViewPersonalAnswersModal } from "./_userquerycollection/ViewPersonalAnswersModal";
import { AddPersonalAnswerModal } from "./_userquerycollection/AddPersonalAnswerModal";
import { DeleteConfirmationModal } from "./_userquerycollection/DeleteConfirmationModal";
import { useFetchPersonalAnswers } from "./_userquerycollection/useFetchPersonalAnswers";
import { fetchFromStrapi, deleteFromStrapi } from '@/secure/strapi';

export default function QueryCardFull({ query, userData, onAnswerAdded, onStatsChange, onQueryClick }) {
    const [previewFile, setPreviewFile] = useState(null);
    const [openAnswers, setOpenAnswers] = useState(false);
    const [openAddAnswer, setOpenAddAnswer] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [answerCount, setAnswerCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // ⭐ Refs for IntersectionObserver view tracking
    const cardRef = useRef(null);
    const hasTrackedView = useRef(false);

    // ⭐ Detect if this is a personal query
    const isPersonalQuery = query.isPersonalQuery || query.isSentQuery || false;
    const isQueryAuthor = isPersonalQuery
        ? (query.isSentQuery || userData?.documentId === query.fromUser?.documentId)
        : userData?.documentId === query.user?.documentId;

    // ⭐ Use personal query answers hook if it's a personal query
    const {
        answers: personalAnswers,
        loading: personalLoading,
        refreshPersonalAnswers,
        checkUserAnswer,
        getAnswerCount: getPersonalAnswerCount
    } = useFetchPersonalAnswers(
        isPersonalQuery ? query.documentId : null,
        userData
    );

    // ⭐ Auto-increment view count when card becomes visible (backend handles duplicates)
    useEffect(() => {
        // Don't track views if:
        // - Personal query (no view tracking)
        // - Already tracked in this component instance
        // - No onQueryClick handler provided
        if (isPersonalQuery || hasTrackedView.current || !onQueryClick) {
            return;
        }

        // Create IntersectionObserver to watch when card enters viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Check if card is visible and hasn't been tracked yet in this instance
                if (entry.isIntersecting && !hasTrackedView.current) {
                    hasTrackedView.current = true; // Prevent multiple calls in same session
                    onQueryClick(); // Backend will handle all duplicate checking
                }
            },
            {
                threshold: 0.5, // Trigger when 50% of card is visible
                rootMargin: '0px'
            }
        );

        // Start observing the card element
        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        // Cleanup: Stop observing when component unmounts
        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [onQueryClick, isPersonalQuery, query.documentId]);

    // ⭐ Fetch answer count based on query type
    const fetchRealAnswerCount = async () => {
        try {
            if (isPersonalQuery) {
                // ⭐ PERSONAL QUERY - Use personal answers
                const count = await getPersonalAnswerCount();
                setAnswerCount(count);

                // Check if user answered
                if (userData?.documentId) {
                    const userPersonalAnswer = checkUserAnswer(userData.documentId);
                    setUserAnswer(userPersonalAnswer);
                }
            } else {
                // ⭐ REGULAR QUERY - Use regular answers
                const data = await fetchFromStrapi(
                    `answers?populate=user_profile&filters[query][documentId]=${query.documentId}`
                );

                const answers = data.data || [];
                const realCount = answers.length;

                setAnswerCount(realCount);

                // Check if user answered
                if (userData?.documentId) {
                    const found = answers.find(a => {
                        const answerUserId = a.user_profile?.documentId;
                        return answerUserId === userData.documentId;
                    });

                    setUserAnswer(found || null);
                } else {
                    setUserAnswer(null);
                }
            }

        } catch (err) {
            setAnswerCount(query.answerCount || 0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query.documentId) {
            fetchRealAnswerCount();
        }
    }, [query.documentId, userData?.documentId, isPersonalQuery]);

    // ⭐ Refresh personal answers when they change
    useEffect(() => {
        if (isPersonalQuery && personalAnswers.length > 0) {
            setAnswerCount(personalAnswers.length);
            if (userData?.documentId) {
                const userPersonalAnswer = checkUserAnswer(userData.documentId);
                setUserAnswer(userPersonalAnswer);
            }
        }
    }, [personalAnswers, isPersonalQuery, userData?.documentId]);

    const handleAnswerSubmitted = async (newCount) => {
        if (newCount !== undefined && newCount !== null) {
            setAnswerCount(newCount);
        }

        // ⭐ Refresh based on query type
        if (isPersonalQuery) {
            await refreshPersonalAnswers();
        }

        await fetchRealAnswerCount();

        if (onAnswerAdded) onAnswerAdded();
        if (onStatsChange) onStatsChange();
        setIsEditMode(false);
    };

    const handleViewAnswers = () => {
        // Note: View tracking now happens automatically via IntersectionObserver
        // Backend handles all duplicate prevention
        setOpenAnswers(true);
    };

    const handleCloseAnswersModal = async () => {
        setOpenAnswers(false);

        // ⭐ Refresh based on query type
        if (isPersonalQuery) {
            await refreshPersonalAnswers();
        }

        await fetchRealAnswerCount();

        if (onStatsChange) onStatsChange();
    };

    const handleEditAnswer = () => {
        setIsEditMode(true);
        setOpenAddAnswer(true);
    };

    // ⭐ Delete query handler with authorization check
    const handleDeleteQuery = async () => {
        // ⭐ SECURITY CHECK: Verify user is the query author
        if (!isQueryAuthor) {
            alert('You can only delete your own queries!');
            setOpenDeleteModal(false);
            return;
        }

        setIsDeleting(true);
        try {
            // ⭐ Delete based on query type
            const endpoint = isPersonalQuery
                ? `personal-queries/${query.documentId}`
                : `queries/${query.documentId}`;

            await deleteFromStrapi(endpoint);

            setOpenDeleteModal(false);

            // ⭐ Notify parent to update stats AND refresh queries
            if (onStatsChange) onStatsChange();
            if (onAnswerAdded) onAnswerAdded();

        } catch (err) {
            alert('Failed to delete query. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* CARD - ⭐ Added ref={cardRef} for IntersectionObserver */}
            <div
                ref={cardRef}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-lg transition-all relative"
            >

                {/* CATEGORY with Personal Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {isPersonalQuery && (
                        <div className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md border border-purple-200/50 dark:border-purple-700/50">
                            <Lock className="w-3 h-3" />
                            Private
                        </div>
                    )}
                    <span className="px-2.5 py-1 text-[10px] font-semibold bg-zinc-100/80 dark:bg-zinc-800/80 rounded-md border border-zinc-200/50 dark:border-zinc-700/50">
                        {query.category}
                    </span>
                </div>

                {/* USER */}
                <div className="flex items-center gap-3 pr-20">
                    <img
                        src={query.user.profileImageUrl || query.user.profilePic || '/default-avatar.png'}
                        className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                        alt={query.user.name}
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                                {query.user.name}
                            </span>
                            {query.user.isVerified && (
                                <CheckCircle className="w-4 h-4 text-zinc-500" />
                            )}
                            {getUserBadges(query.user).map((badge) => (
                                <MiniBadge badge={badge} key={badge.id} />
                            ))}
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                            {query.user.course} • {query.user.branch} • {query.user.year} • {query.user.college}
                        </p>
                    </div>
                </div>

                {/* TITLE */}
                <h3 className="mt-3 text-base font-bold">{query.title}</h3>

                {/* DESCRIPTION */}
                <p className="text-sm mt-1 line-clamp-2">{query.description}</p>

                {/* ATTACHMENTS */}
                {query.attachments?.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                        {query.attachments.map((file, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPreviewFile(file)}
                                className="w-16 h-16 rounded-lg overflow-hidden border dark:border-zinc-700"
                            >
                                {file.type === "image" ? (
                                    <img src={file.url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex justify-center items-center h-full bg-zinc-100 dark:bg-zinc-800">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div className="flex gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                        {/* ⭐ Hide views for personal queries (they don't have view tracking) */}
                        {!isPersonalQuery && (
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {query.views}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {loading ? "..." : answerCount}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {/* View Button - Always visible */}
                        <button
                            onClick={handleViewAnswers}
                            className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            View
                        </button>

                        {/* ⭐ SCENARIO 1: User is the QUERY AUTHOR */}
                        {isQueryAuthor && (
                            <button
                                onClick={() => setOpenDeleteModal(true)}
                                className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" />
                                Delete
                            </button>
                        )}

                        {/* ⭐ SCENARIO 2: User is NOT the query author */}
                        {!isQueryAuthor && (
                            <>
                                {/* If user has answered - show Edit + Delete Answer buttons */}
                                {userAnswer ? (
                                    <>
                                        <button
                                            onClick={handleEditAnswer}
                                            className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleViewAnswers}
                                            className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                                            title="View answers to delete your answer"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    /* If user hasn't answered - show Answer button */
                                        <button
                                            onClick={() => { setIsEditMode(false); setOpenAddAnswer(true); }}
                                            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            Answer
                                        </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <FilePreviewModal file={previewFile} isOpen={!!previewFile} onClose={() => setPreviewFile(null)} />

            {/* ⭐ CONDITIONAL MODALS - Show correct ones based on query type */}
            {isPersonalQuery ? (
                <>
                    <ViewPersonalAnswersModal
                        query={query}
                        isOpen={openAnswers}
                        onClose={handleCloseAnswersModal}
                        userData={userData}
                        onAnswerDeleted={async () => {
                            await refreshPersonalAnswers();
                            await fetchRealAnswerCount();
                            if (onStatsChange) onStatsChange();
                        }}
                    />

                    <AddPersonalAnswerModal
                        query={query}
                        isOpen={openAddAnswer}
                        onClose={() => setOpenAddAnswer(false)}
                        userData={userData}
                        onAnswerSubmitted={handleAnswerSubmitted}
                        isEdit={isEditMode}
                        existingAnswer={userAnswer}
                    />
                </>
            ) : (
                <>
                    <ViewAnswersModal
                        query={query}
                        isOpen={openAnswers}
                        onClose={handleCloseAnswersModal}
                        userData={userData}
                        onAnswerDeleted={() => {
                            fetchRealAnswerCount();
                            if (onStatsChange) onStatsChange();
                        }}
                    />

                    <AddAnswerModal
                        query={query}
                        isOpen={openAddAnswer}
                        onClose={() => setOpenAddAnswer(false)}
                        userData={userData}
                        onAnswerSubmitted={handleAnswerSubmitted}
                        isEdit={isEditMode}
                        existingAnswer={userAnswer}
                    />
                </>
            )}

            {/* ⭐ DELETE QUERY CONFIRMATION MODAL */}
            <DeleteConfirmationModal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDeleteQuery}
                title={isPersonalQuery ? "Delete Personal Query" : "Delete Query"}
                message={
                    isPersonalQuery
                        ? "Are you sure you want to delete this personal query? All answers will also be removed."
                        : "Are you sure you want to delete this query? All answers associated with it will also be removed."
                }
                isDeleting={isDeleting}
            />
        </>
    );
}