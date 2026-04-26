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
    senderName
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
   
    // FIX Warning 5 — declare paymentCancelled state (was referenced but never declared)
    const [paymentCancelled, setPaymentCancelled] = useState(false);

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
        setPaymentCancelled(false); // also reset this on full form reset
    };

    const handleClose = () => {
        if (!isSubmitting) { resetForm(); onClose(); }
    };

    const buildQueryData = (uploadedFileId, queryStatus, paymentStatus) => ({
        fromUser: String(currentUserId),
        toUser: String(receiverData.documentId || receiverData.id),
        category,
        title: queryTitle.trim(),
        description: queryText.trim(),
        amount_paise: deadline?.pricePaise ?? 0,
        deadline_hours: deadline?.hours ?? null,
        deadline_label: deadline?.label ?? null,
        query_status: queryStatus,
        payment_status: paymentStatus,
        ...(uploadedFileId && { attachment: uploadedFileId }),
    });

    const sendEmailNotification = async (amountPaise) => {
        if (!receiverData.email) return;
        await fetch('/api/send-query-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                receiverEmail: receiverData.email,
                receiverName: receiverData.name || receiverData.username,
                senderName: userData?.name || userData?.username || senderName || '',
                queryTitle: queryTitle.trim(),
                queryDescription: queryText.trim(),
                deadlineLabel: deadline?.label ?? 'Free',
                deadlineHours: deadline?.hours ?? null,
                amountPaise,
            }),
        }).catch(err => console.error('Email failed:', err));
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
        const loadingToast = toast.loading('Saving your query...');

        try {
            // 1. Upload attachment if any
            let uploadedFileId = null;
            if (attachment) {
                try {
                    const uploadedFile = await uploadImageToStrapi(attachment, 'attachment', currentUserId);
                    if (uploadedFile?.id) uploadedFileId = uploadedFile.id;
                } catch (uploadError) {
                    console.error('Attachment upload failed:', uploadError);
                    toast.error('Failed to upload attachment. Continuing without it...');
                }
            }

            // 2. FREE QUERY — save to Strapi immediately, then send email
            if (!deadline?.pricePaise || deadline.pricePaise === 0) {
                const savedQuery = await postToStrapi('personal-queries', buildQueryData(uploadedFileId, 'open', 'free'));
                const queryDocumentId = savedQuery?.data?.documentId;
                if (!queryDocumentId) throw new Error('Failed to get query ID from Strapi');

                await sendEmailNotification(0);
                toast.success('Query sent successfully!', { id: loadingToast });
                setTimeout(() => { resetForm(); onClose(); if (onQuerySent) onQuerySent(); }, 1000);
                return;
            }

            // 3. PAID QUERY — create Razorpay order FIRST (no Strapi save yet)
            toast.loading('Opening payment...', { id: loadingToast });

            const orderRes = await fetch('/api/queries/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amountPaise: deadline.pricePaise,
                    deadlineHours: deadline.hours,
                }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok || !orderData.orderId) {
                throw new Error(orderData.error || 'Failed to create payment order');
            }

            toast.dismiss(loadingToast);

            // 4. Open Razorpay checkout
            const rzp = new window.Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: deadline.pricePaise,
                currency: 'INR',
                order_id: orderData.orderId,
                name: 'CampusConnect',
                description: queryTitle.trim(),
                prefill: {
                    name: userData?.name || '',
                    email: userData?.email || '',
                },

                handler: async function (response) {
                    try {
                        // 5. Verify payment on backend FIRST
                        const confirmRes = await fetch('/api/queries/confirm-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            }),
                        });

                        const confirmData = await confirmRes.json();
                        if (!confirmRes.ok) throw new Error(confirmData.error || 'Payment verification failed');

                        // 6. Payment verified — NOW save query to Strapi
                        const savedQuery = await postToStrapi('personal-queries', {
                            ...buildQueryData(uploadedFileId, 'open', 'paid'),
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                        });

                        const queryDocumentId = savedQuery?.data?.documentId;
                        if (!queryDocumentId) throw new Error('Failed to save query after payment');

                        // 7. Send email notification
                        await sendEmailNotification(deadline.pricePaise);

                        toast.success('Payment done! Query sent successfully!');
                        setTimeout(() => { resetForm(); onClose(); if (onQuerySent) onQuerySent(); }, 1000);

                    } catch (err) {
                        toast.error(`Payment verification failed: ${err.message}`);
                    } finally {
                        setIsSubmitting(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setPaymentCancelled(true);
                        setIsSubmitting(false); // ✅ re-enable form so user can retry
                        toast.error('Payment cancelled.');
                    },
                },
            });

            rzp.open();
            // ⚠️ Don't fall through to finally for paid — handler/ondismiss manage isSubmitting
            return;

        } catch (error) {
            console.error('Submit error:', error);
            toast.error(`Failed: ${error.message || 'Unknown error'}`, { id: loadingToast });
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
                            onDeadlineChange={(tier) => {
                                setDeadline(tier);
                                setPaymentCancelled(false);  // ✅ now works — state is declared above
                            }}
                        />

                        <Footer
                            T={T}
                            isFormValid={isFormValid}
                            isSubmitting={isSubmitting}
                            onCancel={handleClose}
                            onSubmit={handleSubmit}
                            deadline={deadline}
                        />

                    </div>
                </div>
            </div>
        </>
    );
}