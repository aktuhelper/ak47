"use client";
import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const CATEGORIES = [
    'DSA',
    'Web Development',
    'Career Guidance',
    'Internships',
    'College/Branch Doubts',
    'Projects',
    'Exam/Placement',
    'General Query'
];

const RECEIVER_BADGES = {
    'mentor': { label: 'Super Mentor', color: 'bg-red-500 dark:bg-red-600' },
    '2nd-year': { label: '2nd Year', color: 'bg-blue-500 dark:bg-blue-600' },
    '3rd-year': { label: '3rd Year', color: 'bg-violet-600 dark:bg-violet-700' },
    '4th-year': { label: '4th Year', color: 'bg-orange-600 dark:bg-orange-700' },
    'junior': { label: 'Junior', color: 'bg-green-500 dark:bg-green-600' }
};

export default function AskQueryModal({
    isOpen,
    onClose,
    receiverName = "Rohit Sharma",
    receiverRole = "mentor",
    receiverId = "123",
    currentUserId = "456"
}) {
    const [category, setCategory] = useState('');
    const [queryTitle, setQueryTitle] = useState('');
    const [queryText, setQueryText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    const charCount = queryText.length;
    const titleCharCount = queryTitle.length;
    const isFormValid = category && queryTitle.length >= 5 && queryTitle.length <= 100 && queryText.length >= 20 && queryText.length <= 1000;

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
        ];

        if (!allowedTypes.includes(file.type)) {
            setErrors({ ...errors, attachment: 'Only JPG, PNG, PDF, and DOCX files are allowed' });
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setErrors({ ...errors, attachment: 'File size must be less than 2MB' });
            return;
        }

        setAttachment(file);
        setErrors({ ...errors, attachment: null });

        // Create preview only for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachmentPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setAttachmentPreview(null);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        setAttachmentPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!category) {
            newErrors.category = 'Please select a category';
        }

        if (queryTitle.length < 5) {
            newErrors.queryTitle = 'Title must be at least 5 characters';
        }

        if (queryTitle.length > 100) {
            newErrors.queryTitle = 'Title must not exceed 100 characters';
        }

        if (queryText.length < 20) {
            newErrors.queryText = 'Query must be at least 20 characters';
        }

        if (queryText.length > 1000) {
            newErrors.queryText = 'Query must not exceed 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate file upload if attachment exists
            let attachmentUrl = null;
            if (attachment) {
                // In production, upload to your storage service
                // const formData = new FormData();
                // formData.append('file', attachment);
                // const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
                // attachmentUrl = (await uploadRes.json()).url;

                // Simulated URL for demo
                attachmentUrl = attachmentPreview;
            }

            // API call
            const response = await fetch('/api/personal-queries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fromUser: currentUserId,
                    toUser: receiverId,
                    category: category,
                    queryTitle: queryTitle,
                    queryText: queryText,
                    attachmentUrl: attachmentUrl
                })
            });

            if (!response.ok) throw new Error('Failed to send query');

            // Success
            showToast('success', 'Your query has been sent successfully!');

            setTimeout(() => {
                resetForm();
                onClose();
            }, 1500);

        } catch (error) {
            showToast('error', 'Failed to send query. Try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        setCategory('');
        setQueryTitle('');
        setQueryText('');
        setAttachment(null);
        setAttachmentPreview(null);
        setErrors({});
    };

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    const badge = RECEIVER_BADGES[receiverRole] || RECEIVER_BADGES['junior'];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden pointer-events-auto border border-gray-200 dark:border-zinc-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 px-5 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Ask {receiverName}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                Private query
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-4 overflow-y-auto max-h-[calc(85vh-140px)] space-y-4">
                        {/* Receiver Info */}
                        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 flex items-center justify-between border border-gray-100 dark:border-zinc-800">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{receiverName}</p>
                            </div>
                            <span className={`${badge.color} text-white px-2.5 py-1 rounded-md text-xs font-semibold`}>
                                {badge.label}
                            </span>
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1.5">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setErrors({ ...errors, category: null });
                                }}
                                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.category
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-zinc-700'
                                    } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all`}
                            >
                                <option value="">Select category...</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Query Title */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1.5">
                                Query Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={queryTitle}
                                onChange={(e) => {
                                    setQueryTitle(e.target.value);
                                    setErrors({ ...errors, queryTitle: null });
                                }}
                                placeholder="Brief title for your query..."
                                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.queryTitle
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-zinc-700'
                                    } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all`}
                            />
                            <div className="mt-1.5 flex items-center justify-between">
                                <div>
                                    {errors.queryTitle && (
                                        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.queryTitle}
                                        </p>
                                    )}
                                </div>
                                <p className={`text-xs ${titleCharCount < 5
                                    ? 'text-red-500 dark:text-red-400'
                                    : titleCharCount > 100
                                        ? 'text-red-500 dark:text-red-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {titleCharCount}/100
                                </p>
                            </div>
                        </div>

                        {/* Query Text */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1.5">
                                Your Query <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={queryText}
                                onChange={(e) => {
                                    setQueryText(e.target.value);
                                    setErrors({ ...errors, queryText: null });
                                }}
                                placeholder="Write your question clearly..."
                                rows={5}
                                className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.queryText
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-zinc-700'
                                    } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none`}
                            />
                            <div className="mt-1.5 flex items-center justify-between">
                                <div>
                                    {errors.queryText && (
                                        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.queryText}
                                        </p>
                                    )}
                                </div>
                                <p className={`text-xs ${charCount < 20
                                    ? 'text-red-500 dark:text-red-400'
                                    : charCount > 1000
                                        ? 'text-red-500 dark:text-red-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {charCount}/1000
                                </p>
                            </div>
                        </div>

                        {/* Attachment */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-1.5">
                                Attachment (optional)
                            </label>

                            {!attachment ? (
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <Upload className="w-6 h-6 text-gray-400 dark:text-zinc-500 mb-1" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Click to upload
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            JPG, PNG, PDF, DOCX (Max 2MB)
                                        </p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                                    {attachmentPreview ? (
                                        <img
                                            src={attachmentPreview}
                                            alt="Attachment preview"
                                            className="w-full h-32 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-32 flex flex-col items-center justify-center">
                                            <div className="text-gray-400 dark:text-zinc-500 mb-2">
                                                {attachment.type === 'application/pdf' ? '📄' : '📝'}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white px-4 text-center truncate max-w-full">
                                                {attachment.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {(attachment.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    )}
                                    <button
                                        onClick={removeAttachment}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md shadow-lg transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {errors.attachment && (
                                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.attachment}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white dark:bg-zinc-900 px-5 py-3 border-t border-gray-200 dark:border-zinc-800 flex gap-2">
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isSubmitting}
                            className="flex-1 px-4 py-2 text-sm rounded-lg bg-blue-600 dark:bg-blue-600 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Query'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-4 right-4 z-[60] animate-in slide-in-from-bottom-4">
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-xl ${toast.type === 'success'
                        ? 'bg-green-500 dark:bg-green-600'
                        : 'bg-red-500 dark:bg-red-600'
                        } text-white`}>
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <p className="font-medium text-sm">{toast.message}</p>
                    </div>
                </div>
            )}
        </>
    );
}