"use client";
import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2, Send, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImageToStrapi } from '../utility/api.js';
import { postToStrapi } from '@/secure/strapi';

const CATEGORIES = [
    'academics',
    'career',
    'college-life',
    'General Query'
];

export default function AskQueryModal({
    isOpen,
    onClose,
    receiverData,
    currentUserId,
    onQuerySent
}) {
    const [category, setCategory] = useState('');
    const [queryTitle, setQueryTitle] = useState('');
    const [queryText, setQueryText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const charCount = queryText.length;
    const titleCharCount = queryTitle.length;
    const isFormValid = category && queryTitle.trim().length > 0 && queryTitle.trim().length <= 100 && queryText.trim().length > 0 && queryText.trim().length <= 1000;

    const getPrimaryBadge = () => {
        if (!receiverData) return null;
        if (receiverData.eliteMentor) {
            return { name: 'Elite', color: 'from-violet-500 via-purple-500 to-fuchsia-500', dot: 'bg-violet-400' };
        }
        if (receiverData.superMentor) {
            return { name: 'Super', color: 'from-amber-500 via-orange-500 to-red-500', dot: 'bg-amber-400' };
        }
        if (receiverData.isMentor) {
            return { name: 'Mentor', color: 'from-emerald-500 via-green-500 to-teal-500', dot: 'bg-emerald-400' };
        }
        if (receiverData.yearBadge) {
            const yearColors = {
                '1st-year': { name: '1st Yr', color: 'from-blue-500 via-cyan-500 to-blue-600', dot: 'bg-blue-400' },
                '2nd-year': { name: '2nd Yr', color: 'from-violet-500 via-purple-500 to-indigo-600', dot: 'bg-violet-400' },
                '3rd-year': { name: '3rd Yr', color: 'from-pink-500 via-rose-500 to-red-600', dot: 'bg-pink-400' },
                '4th-year': { name: '4th Yr', color: 'from-red-500 via-orange-500 to-amber-600', dot: 'bg-red-400' }
            };
            return yearColors[receiverData.yearBadge] || { name: 'Student', color: 'from-gray-500 to-gray-600', dot: 'bg-gray-400' };
        }
        return null;
    };

    const primaryBadge = getPrimaryBadge();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!allowedTypes.includes(file.type)) {
            setErrors({ ...errors, attachment: 'Only JPG, PNG, PDF, and DOCX files are allowed' });
            toast.error('Only JPG, PNG, PDF, and DOCX files are allowed');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setErrors({ ...errors, attachment: 'File size must be less than 2MB' });
            toast.error('File size must be less than 2MB');
            return;
        }

        setAttachment(file);
        setErrors({ ...errors, attachment: null });

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setAttachmentPreview(reader.result);
            reader.onerror = () => {
                toast.error('Error reading file');
            };
            reader.readAsDataURL(file);
        } else {
            setAttachmentPreview(null);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        setAttachmentPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const validateForm = () => {
        const newErrors = {};
        if (!category) newErrors.category = 'Please select a category';

        const trimmedTitle = queryTitle.trim();
        const trimmedQuery = queryText.trim();

        if (trimmedTitle.length === 0) newErrors.queryTitle = 'Title is required';
        if (trimmedTitle.length > 100) newErrors.queryTitle = 'Title must not exceed 100 characters';
        if (trimmedQuery.length === 0) newErrors.queryText = 'Query is required';
        if (trimmedQuery.length > 1000) newErrors.queryText = 'Query must not exceed 1000 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

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
            let uploadedFileId = null;

            // Step 1: Upload file first if there's an attachment
            if (attachment) {
                try {
                    const uploadedFile = await uploadImageToStrapi(attachment, 'attachment', currentUserId);
                    if (uploadedFile?.id) {
                        uploadedFileId = uploadedFile.id;
                    }
                } catch (uploadError) {
                    console.error('Attachment upload failed:', uploadError);
                    toast.error('Failed to upload attachment. Continuing without it...', {
                        id: loadingToast,
                    });
                }
            }

            // Step 2: Create query data object
            const queryData = {
                fromUser: String(currentUserId),
                toUser: String(receiverData.documentId || receiverData.id),
                category: category,
                title: queryTitle.trim(),
                description: queryText.trim(),
            };

            // Add attachment ID if it exists
            if (uploadedFileId) {
                queryData.attachment = uploadedFileId;
            }

            // Use secure wrapper
            await postToStrapi('personal-queries', queryData);

            toast.success('Your query has been sent successfully!', {
                id: loadingToast,
            });

            setTimeout(() => {
                resetForm();
                onClose();
                if (onQuerySent) onQuerySent();
            }, 1000);

        } catch (error) {
            console.error('Error sending query:', error);
            toast.error(`Failed to send query: ${error.message || 'Unknown error occurred'}`, {
                id: loadingToast,
            });
        } finally {
            setIsSubmitting(false);
        }
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

    if (!isOpen || !receiverData) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-xl z-50" onClick={handleClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-white dark:bg-zinc-950 rounded-3xl w-full max-w-lg max-h-[95vh] overflow-hidden border border-gray-200/50 dark:border-zinc-800/50 shadow-2xl dark:shadow-black/50 relative" onClick={(e) => e.stopPropagation()}>

                    {/* Compact Header */}
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-900 opacity-90" />
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '32px 32px'
                        }} />

                        <div className="relative px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="relative flex-shrink-0">
                                    {receiverData.avatar ? (
                                        <img
                                            src={receiverData.avatar}
                                            alt={receiverData.name || receiverData.username}
                                            className="w-11 h-11 rounded-2xl border-2 border-white/30 shadow-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-2xl bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-lg">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/50 dark:border-zinc-900/50" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-base truncate">
                                        {receiverData.name || receiverData.username}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {primaryBadge && (
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-gradient-to-r ${primaryBadge.color} shadow-md`}>
                                                <span className={`w-1 h-1 rounded-full ${primaryBadge.dot} animate-pulse`} />
                                                {primaryBadge.name}
                                            </span>
                                        )}
                                        <span className="text-white/70 text-xs">Private Query</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleClose} disabled={isSubmitting} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-sm text-white transition-all flex items-center justify-center disabled:opacity-50 flex-shrink-0 ml-2">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 py-4 overflow-y-auto max-h-[calc(95vh-180px)] space-y-4 bg-gray-50/50 dark:bg-black/50">

                        {/* Category */}
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white mb-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select value={category} onChange={(e) => { setCategory(e.target.value); setErrors({ ...errors, category: null }); }} className={`w-full px-3 py-2.5 text-sm rounded-xl border-2 ${errors.category ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-zinc-800'} bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all`}>
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1.5 text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-gray-900 dark:text-white">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <span className={`text-[10px] font-mono ${titleCharCount > 100 ? 'text-red-500' : 'text-gray-400 dark:text-zinc-500'}`}>
                                    {titleCharCount}/100
                                </span>
                            </div>
                            <input type="text" value={queryTitle} onChange={(e) => { setQueryTitle(e.target.value); setErrors({ ...errors, queryTitle: null }); }} placeholder="Brief title for your query" className={`w-full px-3 py-2.5 text-sm rounded-xl border-2 ${errors.queryTitle ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-zinc-800'} bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all`} />
                            {errors.queryTitle && (
                                <p className="mt-1.5 text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.queryTitle}
                                </p>
                            )}
                        </div>

                        {/* Query Text */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-gray-900 dark:text-white">
                                    Query <span className="text-red-500">*</span>
                                </label>
                                <span className={`text-[10px] font-mono ${charCount > 1000 ? 'text-red-500' : 'text-gray-400 dark:text-zinc-500'}`}>
                                    {charCount}/1000
                                </span>
                            </div>
                            <textarea value={queryText} onChange={(e) => { setQueryText(e.target.value); setErrors({ ...errors, queryText: null }); }} placeholder="Describe your question in detail..." rows={4} className={`w-full px-3 py-2.5 text-sm rounded-xl border-2 ${errors.queryText ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-zinc-800'} bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none`} />
                            {errors.queryText && (
                                <p className="mt-1.5 text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.queryText}
                                </p>
                            )}
                        </div>

                        {/* Attachment */}
                        <div>
                            <label className="text-xs font-bold text-gray-900 dark:text-white mb-1.5 block">
                                Attachment <span className="text-gray-400 dark:text-zinc-500 font-normal">(optional)</span>
                            </label>

                            {!attachment ? (
                                <div>
                                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} className="hidden" id="file-upload" />
                                    <label htmlFor="file-upload" className="group flex items-center justify-center gap-2 w-full h-20 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl cursor-pointer bg-white dark:bg-zinc-900/50 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white">Upload file</p>
                                            <p className="text-[10px] text-gray-500 dark:text-zinc-400">JPG, PNG, PDF, DOCX · Max 2MB</p>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                    {attachmentPreview ? (
                                        <img src={attachmentPreview} alt="Preview" className="w-full h-24 object-cover" />
                                    ) : (
                                        <div className="w-full h-24 flex items-center justify-center gap-3 px-3">
                                            <div className="text-3xl">{attachment.type === 'application/pdf' ? '📄' : '📝'}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{attachment.name}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-zinc-400">{(attachment.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                    )}
                                    <button type="button" onClick={removeAttachment} className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-all flex items-center justify-center shadow-lg hover:scale-110">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {errors.attachment && (
                                <p className="mt-1.5 text-[11px] text-red-500 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.attachment}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex gap-2.5">
                        <button type="button" onClick={handleClose} disabled={isSubmitting} className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl border-2 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 active:scale-[0.98] transition-all disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="button" onClick={handleSubmit} disabled={!isFormValid || isSubmitting} className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Query
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}