"use client";
import React, { useState, useEffect, useRef } from 'react';
import { DARK, LIGHT } from './_askmodal/theme';
import { getStyles } from './_askmodal/styles';
import Sidebar from './_askmodal/Sidebar';
import Topbar from './_askmodal/Topbar';
import FormArea from './_askmodal/FormArea';
import Footer from './_askmodal/Footer';
import toast from 'react-hot-toast';
import { uploadImageToStrapi } from '../utility/api.js';
import { postToStrapi } from '@/secure/strapi';

export default function AskQueryModal({
    isOpen,
    onClose,
    receiverData,
    currentUserId,
    onQuerySent,
    userData,
}) {
    const [theme, setTheme] = useState('dark');
    const [category, setCategory] = useState('');
    const [queryTitle, setQueryTitle] = useState('');
    const [queryText, setQueryText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [paymentAgreed, setPaymentAgreed] = useState(false);
    const [deadline, setDeadline] = useState(null); // { label, hours, pricePaise, urgent }

    // A query is paid when the user has selected a deadline tier
    const isPaidQuery = deadline !== null;

    const isDark = theme === 'dark';
    const T = isDark ? DARK : LIGHT;

    useEffect(() => {
        if (isOpen) setTimeout(() => setMounted(true), 10);
        else setMounted(false);
    }, [isOpen]);

    const isFormValid =
        deadline !== null &&
        category &&
        queryTitle.trim().length > 0 && queryTitle.trim().length <= 100 &&
        queryText.trim().length > 0 && queryText.trim().length <= 1000 &&
        (!isPaidQuery || paymentAgreed);

    const validateForm = () => {
        const e = {};
        const tt = queryTitle.trim();
        const qt = queryText.trim();
        if (!deadline) e.deadline = 'Please select a response deadline';
        if (!category) e.category = 'Select a category';
        if (!tt) e.queryTitle = 'Title is required';
        if (tt.length > 100) e.queryTitle = 'Max 100 characters';
        if (!qt) e.queryText = 'Query is required';
        if (qt.length > 1000) e.queryText = 'Max 1000 characters';
        if (isPaidQuery && !paymentAgreed) e.paymentAgreed = 'Please agree to the payment terms to continue';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const resetForm = () => {
        setCategory('');
        setQueryTitle('');
        setQueryText('');
        setAttachment(null);
        setAttachmentPreview(null);
        setErrors({});
        setPaymentAgreed(false);
        setDeadline(null);
    };

    const handleClose = () => {
        if (!isSubmitting) { resetForm(); onClose(); }
    };

    const handleSubmit = async (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        if (!currentUserId) {
            toast.error('User session not found. Please refresh the page.');
            return;
        }

        if (!receiverData?.documentId && !receiverData?.id) {
            toast.error('Receiver information is missing. Please try again.');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading('Sending your query...');

        try {
            // Step 1: Upload attachment if present
            let uploadedFileId = null;
            if (attachment) {
                try {
                    const uploadedFile = await uploadImageToStrapi(attachment, 'attachment', currentUserId);
                    if (uploadedFile?.id) uploadedFileId = uploadedFile.id;
                } catch (uploadError) {
                    console.error('Attachment upload failed:', uploadError);
                    toast.error('Failed to upload attachment. Continuing without it...', { id: loadingToast });
                }
            }

            // Step 2: Build and post query
            const queryData = {
                fromUser: String(currentUserId),
                toUser: String(receiverData.documentId || receiverData.id),
                category: category,
                title: queryTitle.trim(),
                description: queryText.trim(),
                amount_paise: deadline?.pricePaise ?? 0,
                deadline_hours: deadline?.hours ?? null,
                deadline_label: deadline?.label ?? null,
                ...(uploadedFileId && { attachment: uploadedFileId }),
            };

            await postToStrapi('personal-queries', queryData);

            // Step 3: Send email notification (non-blocking — failure does not abort)

            // Step 3: Send email notification (non-blocking — failure does not abort)
            if (receiverData.email) {
                try {
                    const emailRes = await fetch('/api/send-query-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            receiverEmail: receiverData.email,
                            receiverName: receiverData.name || receiverData.username,
                            senderName: userData?.name || userData?.username,
                            queryTitle: queryTitle.trim(),
                            queryDescription: queryText.trim(),
                            deadlineLabel: deadline?.label ?? 'Free',
                            deadlineHours: deadline?.hours ?? null,
                            amountPaise: deadline?.pricePaise ?? 0,
                        }),
                    });

                    // fetch never throws on 4xx/5xx — must check manually
                    if (!emailRes.ok) {
                        const errBody = await emailRes.json().catch(() => ({}));
                        console.error('Email route error:', emailRes.status, errBody);
                    }
                } catch (emailError) {
                    console.error('Email notification failed (network):', emailError);
                }
            }
            toast.success('Your query has been sent successfully!', { id: loadingToast });

            setTimeout(() => {
                resetForm();
                onClose();
                if (onQuerySent) onQuerySent();
            }, 1000);

        } catch (error) {
            console.error('Error sending query:', error);
            toast.error(`Failed to send query: ${error.message || 'Unknown error occurred'}`, { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !receiverData) return null;

    return (
        <>
            <style>{getStyles()}</style>

            {/* Backdrop */}
            <div
                className={`aqm aqm-overlay ${mounted ? 'open' : ''}`}
                style={{ background: T.overlayBg }}
                onClick={handleClose}
            />

            {/* Shell */}
            <div className="aqm aqm-shell">
                <div className={`aqm-panel ${mounted ? 'open' : ''}`} style={{ background: T.bg }}>

                    {/* Left sidebar */}
                    <Sidebar
                        T={T}
                        receiverData={receiverData}
                    />

                    {/* Right panel */}
                    <div className="aqm-right" style={{ background: T.bg }}>

                        <Topbar
                            T={T}
                            isDark={isDark}
                            onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')}
                            onClose={handleClose}
                            isSubmitting={isSubmitting}
                        />

                        <FormArea
                            T={T}
                            category={category} setCategory={setCategory}
                            queryTitle={queryTitle} setQueryTitle={setQueryTitle}
                            queryText={queryText} setQueryText={setQueryText}
                            attachment={attachment} setAttachment={setAttachment}
                            attachmentPreview={attachmentPreview} setAttachmentPreview={setAttachmentPreview}
                            errors={errors} setErrors={setErrors}
                            deadline={deadline} setDeadline={setDeadline}
                            paymentAgreed={paymentAgreed} setPaymentAgreed={setPaymentAgreed}
                        />

                        <Footer
                            T={T}
                            isFormValid={isFormValid}
                            isSubmitting={isSubmitting}
                            onCancel={handleClose}
                            onSubmit={handleSubmit}
                        />

                    </div>
                </div>
            </div>
        </>
    );
}