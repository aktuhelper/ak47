"use client";
import React, { useState } from 'react';
import { Send, Globe, Building2, FlaskConical, GraduationCap, Paperclip, X, Eye, EyeOff, AlertCircle, MessageSquare, User } from 'lucide-react';

const AskQueryPage = () => {
    const [title, setTitle] = useState('');
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('academics');
    const [visibility, setVisibility] = useState('public');
    const [files, setFiles] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const maxWords = 100;
    const wordCount = query.trim() ? query.trim().split(/\s+/).length : 0;

    const categoryOptions = [
        { id: 'academics', label: 'Academics', icon: '📚' },
        { id: 'career', label: 'Career', icon: '💼' },
        { id: 'college-life', label: 'College Life', icon: '🎓' },
        { id: 'general', label: 'General', icon: '💬' }
    ];

    const visibilityOptions = [
        { id: 'public', label: 'Public', icon: Globe, desc: 'All colleges' },
        { id: 'college', label: 'My College', icon: Building2, desc: 'Your institution' },
        { id: 'branch', label: 'My Branch', icon: FlaskConical, desc: 'Same branch' },
        { id: 'seniors', label: 'Seniors', icon: GraduationCap, desc: 'Mentors only' }
    ];

    const handleFileUpload = (e) => {
        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(file => {
            const maxSize = 2 * 1024 * 1024;
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!validTypes.includes(file.type)) {
                alert(`${file.name} is not allowed. Only images (JPG, PNG, GIF, WebP), PDF, and DOCX files are accepted.`);
                return false;
            }
            if (file.size > maxSize) {
                alert(`${file.name} is too large. Maximum file size is 2MB.`);
                return false;
            }
            return true;
        });
        setFiles([...files, ...validFiles.slice(0, 5 - files.length)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(e.dataTransfer.files);
        const validFiles = newFiles.filter(file => {
            const maxSize = 2 * 1024 * 1024;
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!validTypes.includes(file.type)) {
                alert(`${file.name} is not allowed. Only images (JPG, PNG, GIF, WebP), PDF, and DOCX files are accepted.`);
                return false;
            }
            if (file.size > maxSize) {
                alert(`${file.name} is too large. Maximum file size is 2MB.`);
                return false;
            }
            return true;
        });
        setFiles([...files, ...validFiles.slice(0, 5 - files.length)]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (title.trim() && query.trim() && wordCount <= maxWords) {
            setShowReviewModal(true);
        }
    };

    const confirmPost = () => {
        console.log({ title, query, category, visibility, files, isAnonymous });
        alert('Query posted successfully!');
        setShowReviewModal(false);
        setTitle('');
        setQuery('');
        setCategory('academics');
        setFiles([]);
        setIsAnonymous(false);
        setVisibility('public');
    };

    const visibilityLabels = {
        public: 'Public - All colleges',
        college: 'My College - Your institution',
        branch: 'My Branch - Same branch',
        seniors: 'Seniors - Mentors only'
    };

    const categoryLabels = {
        academics: 'Academics',
        career: 'Career',
        'college-life': 'College Life',
        general: 'General'
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Ask a Question</h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">Get help from your campus community</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3">

                {/* Question Title */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
                    <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">Question Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a clear, descriptive title..."
                        className="w-full px-2.5 sm:px-3 py-2 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Query Input */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Question Details</label>
                        <span className={`text-xs ${wordCount > maxWords ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {wordCount}/{maxWords}
                        </span>
                    </div>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Provide more details about your question..."
                        className="w-full h-20 sm:h-24 px-2.5 sm:px-3 py-2 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Category */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
                    <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {categoryOptions.map((option) => {
                            const isSelected = category === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setCategory(option.id)}
                                    className={`p-2.5 rounded border transition-colors ${isSelected
                                        ? 'border-gray-400 bg-gray-100 dark:bg-zinc-800 dark:border-zinc-600'
                                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-lg mb-1">{option.icon}</div>
                                        <div className={`text-xs font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                                            {option.label}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Visibility */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
                    <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">Visibility</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {visibilityOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = visibility === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setVisibility(option.id)}
                                    className={`p-2 rounded border text-left transition-colors ${isSelected
                                        ? 'border-gray-400 bg-gray-100 dark:bg-zinc-800 dark:border-zinc-600'
                                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                                    <div className={`text-xs font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>{option.label}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Files */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
                    <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">Attachments ({files.length}/5)</label>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`relative border-2 border-dashed rounded p-3 sm:p-4 transition-colors ${isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600'
                            }`}
                    >
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf,.docx"
                        />
                        <div className="text-center">
                            <Paperclip className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">Drop files or click</p>
                        </div>
                    </div>
                    {files.length > 0 && (
                        <div className="space-y-1 mt-2 max-h-24 overflow-y-auto">
                            {files.map((file, index) => {
                                const isImage = file.type.startsWith('image/');
                                const fileURL = isImage ? URL.createObjectURL(file) : null;

                                return (
                                    <div key={index} className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-zinc-950 rounded text-xs">
                                        {isImage ? (
                                            <img src={fileURL} alt={file.name} className="w-8 h-8 object-cover rounded" />
                                        ) : (
                                            <Paperclip className="w-3 h-3 text-gray-500" />
                                        )}
                                        <span className="flex-1 truncate text-gray-900 dark:text-white">{file.name}</span>
                                        <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-600">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Anonymous & Submit */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Post Anonymously</span>
                        </div>
                        <button
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isAnonymous ? 'transform translate-x-5' : ''}`} />
                        </button>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() || !query.trim() || wordCount > maxWords}
                        className={`w-full py-2.5 rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors ${title.trim() && query.trim() && wordCount <= maxWords
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-4 h-4" />
                        Post Query
                    </button>
                </div>

                {/* Review Modal */}
                {showReviewModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-zinc-800">
                            {/* Header */}
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-zinc-800">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Review Your Query</h2>
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                                {/* Preview Card - Using QueryCard structure */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 relative">
                                    {/* Category Badge - Top Right */}
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2.5 py-1 text-[10px] font-semibold bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200/50 dark:border-zinc-700/50">
                                            {categoryLabels[category]}
                                        </span>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex items-center gap-3 pr-20 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                                            {isAnonymous ? (
                                                <User className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <User className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {isAnonymous ? 'Anonymous User' : 'Your Name'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Your Branch • Your College</p>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{title}</h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap">{query}</p>

                                    {/* Attachments */}
                                    {files.length > 0 && (
                                        <div className="flex gap-2 mb-3 overflow-x-auto">
                                            {files.map((file, index) => {
                                                const isImage = file.type.startsWith('image/');
                                                const fileURL = isImage ? URL.createObjectURL(file) : null;

                                                return (
                                                    <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 flex-shrink-0">
                                                        {isImage ? (
                                                            <img src={fileURL} alt={file.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-zinc-800">
                                                                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-zinc-700">
                                        <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" /> 0
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" /> 0
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-[10px] sm:text-xs">
                                                {visibilityLabels[visibility]}
                                            </span>
                                            {isAnonymous && (
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-[10px] sm:text-xs">
                                                    Anonymous
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 mt-3">
                                    <div className="flex gap-2">
                                        <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1">Before you post</p>
                                            <ul className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                                <li>• Ensure your question is clear and specific</li>
                                                <li>• Visible to {visibilityLabels[visibility].split(' - ')[1]}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-2 p-3 sm:p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 py-2 px-3 sm:px-4 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded font-medium text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={confirmPost}
                                    className="flex-1 py-2 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AskQueryPage;