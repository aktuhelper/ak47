"use client";
import React, { useState, useEffect } from "react";
import { X, Lock } from "lucide-react";
import { useFetchPersonalAnswers } from "../_userquerycollection/useFetchPersonalAnswers";
import { QueryInfoPanel } from "../_userquerycollection/_viewpersonalanswermod/QueryInfoPanel";
import { AnswersList } from "../_userquerycollection/_viewpersonalanswermod/AnswersList";
import { modalStyles } from "../_userquerycollection/_viewpersonalanswermod/ViewPersonalAnswersModal.styles";

export const ViewPersonalAnswersModal = ({
    query,
    isOpen,
    onClose,
    userData,
    onAnswerDeleted,
}) => {
    const [freshQuery, setFreshQuery] = useState(query);
    const [acceptingAnswerId, setAcceptingAnswerId] = useState(null);
    const [rejectingAnswerId, setRejectingAnswerId] = useState(null);

    const {
        answers,
        loading,
        refreshPersonalAnswers,
        updateAnswerStatus,
    } = useFetchPersonalAnswers(query?.documentId, userData);

    // ✅ All hooks before early return
    useEffect(() => {
        if (query) setFreshQuery(query);
    }, [query]);

    useEffect(() => {
        if (!isOpen || !query?.documentId) return;
        refreshPersonalAnswers();
        fetch(`/api/personal-queries/${query.documentId}`)
            .then(r => r.json())
            .then(data => setFreshQuery(data?.data || query))
            .catch(() => setFreshQuery(query));
    }, [isOpen, query?.documentId]);

    // ✅ Early return after all hooks
    if (!isOpen || !query) return null;

    const isQuerySender = userData?.documentId === freshQuery?.fromUser?.documentId;

    // ── Handlers ──────────────────────────────────────────────

    const sendAnswerStatusEmail = (answer, status) => {
        const answererEmail = answer.user_profile?.email;
        if (!answererEmail) return;
        fetch("/api/notify-answer-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status,
                answererEmail,
                answererName: answer.user_profile?.name,
                askerName: freshQuery.fromUser?.name || userData?.name,
                queryTitle: freshQuery.title,
                amountPaise: freshQuery.amount_paise || 0,
            }),
        }).catch((err) => console.error("❌ Failed to send status email:", err));
    };

    const handleAcceptAnswer = async (answer) => {
        if (!isQuerySender)
            return alert("Only the person who sent this query can accept an answer!");
        if (answer.user_profile?.documentId === freshQuery.fromUser?.documentId)
            return alert("You cannot accept your own answer!");

        updateAnswerStatus(answer.documentId, "accepted");
        setAcceptingAnswerId(answer.documentId);

        try {
            const settleRes = await fetch('/api/queries/settle-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryDocumentId: freshQuery.documentId,
                    answerDocumentId: answer.documentId,
                    action: 'accept',
                }),
            });

            const settleData = await settleRes.json();
            if (!settleRes.ok) {
                updateAnswerStatus(answer.documentId, "pending");
                throw new Error(settleData.error || 'Payment settlement failed');
            }

            sendAnswerStatusEmail(answer, "accepted");
            refreshPersonalAnswers();
            if (onAnswerDeleted) onAnswerDeleted();

        } catch (error) {
            console.error("Accept error:", error);
            alert(error.message || "Failed to accept answer. Please try again.");
        } finally {
            setAcceptingAnswerId(null);
        }
    };

    const handleRejectAnswer = async (answer) => {
        if (!isQuerySender)
            return alert("Only the person who sent this query can reject an answer!");
        if (answer.user_profile?.documentId === freshQuery.fromUser?.documentId)
            return alert("You cannot reject your own answer!");

        updateAnswerStatus(answer.documentId, "rejected");
        setRejectingAnswerId(answer.documentId);

        try {
            const settleRes = await fetch('/api/queries/settle-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryDocumentId: freshQuery.documentId,
                    answerDocumentId: answer.documentId,
                    action: 'reject',
                }),
            });

            const settleData = await settleRes.json();
            if (!settleRes.ok) {
                updateAnswerStatus(answer.documentId, "pending");
                throw new Error(settleData.error || 'Payment settlement failed');
            }

            sendAnswerStatusEmail(answer, "rejected");
            refreshPersonalAnswers();
            if (onAnswerDeleted) onAnswerDeleted();

        } catch (error) {
            alert(error.message || "Failed to reject answer. Please try again.");
        } finally {
            setRejectingAnswerId(null);
        }
    };

    // ── Render ─────────────────────────────────────────────────

    return (
        <div
            className="fixed inset-0 z-50 flex items-stretch bg-white dark:bg-zinc-950"
            style={{ animation: "modalFadeIn 0.2s ease-out" }}
        >
            <style>{modalStyles}</style>

            <div className="flex flex-col w-full h-full">

                {/* Top bar */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-full">
                            <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 tracking-wide uppercase">
                                Private
                            </span>
                        </div>
                        <span className="text-xs text-zinc-400 dark:text-zinc-600 hidden sm:inline">
                            Personal Query
                        </span>
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
                    <QueryInfoPanel
                        query={freshQuery}
                        userData={userData}
                        answers={answers}
                        loading={loading}
                    />
                    <AnswersList
                        answers={answers}
                        loading={loading}
                        userData={userData}
                        query={freshQuery}
                        isQuerySender={isQuerySender}
                        acceptingAnswerId={acceptingAnswerId}
                        rejectingAnswerId={rejectingAnswerId}
                        onAccept={handleAcceptAnswer}
                        onReject={handleRejectAnswer}
                    />
                </div>

            </div>
        </div>
    );
};