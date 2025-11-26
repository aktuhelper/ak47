"use client";
import React, { useState } from "react";
import {
    MessageSquare,
    Eye,
    FileText,
    Image,
    Download,
    X,
    GraduationCap,
    BookOpen,
    Shield,
    Send,
    User
} from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(' ');

// -----------------------------------------------
// BADGE COMPONENT
// -----------------------------------------------
export const Badge = ({ type, className }) => {
    const configs = {
        fresher: {
            label: "1st Year",
            icon: GraduationCap,
            className: "bg-emerald-500 text-white border-transparent dark:bg-emerald-600"
        },
        "2nd-year": {
            label: "2nd Year",
            icon: BookOpen,
            className: "bg-blue-500 text-white border-transparent dark:bg-blue-600"
        },
        "3rd-year": {
            label: "3rd Year",
            icon: BookOpen,
            className: "bg-violet-600 text-white border-transparent dark:bg-violet-700"
        },
        "4th-year": {
            label: "4th Year",
            icon: BookOpen,
            className: "bg-orange-600 text-white border-transparent dark:bg-orange-700"
        },
        mentor: {
            label: "Mentor",
            icon: Shield,
            className: "bg-red-500 text-white border-transparent dark:bg-red-600"
        },
        default: {
            label: "Student",
            icon: GraduationCap,
            className: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
        }
    };

    const config = configs[type] || configs.default;
    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide",
                config.className,
                className
            )}
        >
            <Icon className="w-3 h-3" /> {config.label}
        </span>
    );
};

// -----------------------------------------------
// FILE PREVIEW MODAL
// -----------------------------------------------
export const FilePreviewModal = ({ file, isOpen, onClose }) => {
    if (!isOpen || !file) return null;

    const isImage = file.type === "image";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {isImage ? <Image className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-orange-500" />}
                        {file.name}
                    </h3>

                    <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/30 min-h-[300px]">
                    {isImage ? (
                        <img src={file.url} alt={file.name} className="max-h-[70vh] w-auto object-contain rounded-lg" />
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
                                <FileText className="w-10 h-10 text-orange-500" />
                            </div>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg inline-flex items-center gap-2 transition-colors">
                                <Download className="w-4 h-4" /> Download File
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------
// HELPER FUNCTION - NOW EXPORTED
// -----------------------------------------------
export const getBadges = (user) => {
    const arr = [];
    if (!user) return arr;

    // Year-based badges
    if (user.year === 1) arr.push("fresher");
    else if (user.year === 2) arr.push("2nd-year");
    else if (user.year === 3) arr.push("3rd-year");
    else if (user.year === 4) arr.push("4th-year");

    // Mentor badge (for any year if they are a mentor)
    if (user.isMentor) arr.push("mentor");

    return arr;
};

// -----------------------------------------------
// VIEW ANSWERS MODAL
// -----------------------------------------------
export const ViewAnswersModal = ({ query, isOpen, onClose }) => {
    if (!isOpen || !query) return null;

    const answers = query.answers || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Answers</h3>
                    <button onClick={onClose} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    {/* Question Header with User Info and Badges */}
                    <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={query.user.avatar}
                                className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                                alt={query.user.name}
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                        {query.user.name}
                                    </span>
                                    {getBadges(query.user).map((b) => (
                                        <Badge type={b} key={b} />
                                    ))}
                                </div>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                    {query.user.branch} • {query.user.college}
                                </p>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">{query.title}</h2>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{query.description}</p>
                    </div>

                    {/* Answers Section */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                        </h3>

                        {answers.length === 0 ? (
                            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No answers yet. Be the first to answer!</p>
                        ) : (
                            answers.map((answer) => (
                                <div key={answer.id} className="border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0">
                                    <div className="flex gap-2 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                                            <User className="w-5 h-5 text-zinc-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{answer.user}</p>
                                                {answer.badges?.map((badge) => (
                                                    <Badge type={badge} key={badge} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{answer.details}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed mb-2 ml-12">
                                        {answer.text}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------
// ADD ANSWER MODAL
// -----------------------------------------------
export const AddAnswerModal = ({ query, isOpen, onClose }) => {
    const [answerText, setAnswerText] = useState('');

    if (!isOpen || !query) return null;

    const handleSubmit = () => {
        if (answerText.trim()) {
            // Handle answer submission here
            console.log('Submitting answer:', answerText);
            setAnswerText('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-zinc-900 max-w-lg w-full rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">Write an Answer</h3>
                    <button onClick={onClose} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Question Preview with Badges */}
                    <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={query.user.avatar}
                                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                                alt={query.user.name}
                            />
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                                        {query.user.name}
                                    </span>
                                    {getBadges(query.user).map((b) => (
                                        <Badge type={b} key={b} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{query.title}</p>
                    </div>

                    <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full h-32 p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your answer..."
                    />

                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={onClose}
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!answerText.trim()}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white text-sm rounded-lg flex items-center gap-1 transition-colors"
                        >
                            <Send className="w-3 h-3" /> Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------
// MAIN FULL CARD COMPONENT - DEFAULT EXPORT
// -----------------------------------------------
export default function QueryCardFull({ query }) {
    const [previewFile, setPreviewFile] = useState(null);
    const [openAnswers, setOpenAnswers] = useState(false);
    const [openAddAnswer, setOpenAddAnswer] = useState(false);

    return (
        <>
            {/* CARD */}
            <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-lg transition-all relative">

                {/* CATEGORY BADGE - Top Right */}
                <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[10px] font-semibold bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200/50 dark:border-zinc-700/50">
                        {query.category}
                    </span>
                </div>

                {/* USER */}
                <div className="flex items-center gap-3 pr-20">
                    <img
                        src={query.user.avatar}
                        className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700"
                        alt={query.user.name}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{query.user.name}</span>
                            {getBadges(query.user).map((b) => (
                                <Badge type={b} key={b} />
                            ))}
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                            {query.user.branch} • {query.user.college}
                        </p>
                    </div>
                </div>

                {/* TITLE */}
                <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">{query.title}</h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                    {query.description}
                </p>

                {/* ATTACHMENTS */}
                {query.attachments?.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                        {query.attachments.map((file, idx) => (
                            <button
                                key={idx}
                                className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors flex-shrink-0"
                                onClick={() => setPreviewFile(file)}
                            >
                                {file.type === "image" ? (
                                    <img src={file.url} className="w-full h-full object-cover" alt={file.name} />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-zinc-100 dark:bg-zinc-800">
                                        <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                    <div className="flex gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {query.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {query.answers?.length || 0}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setOpenAnswers(true)}
                            className="px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            View
                        </button>

                        <button
                            onClick={() => setOpenAddAnswer(true)}
                            className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Answer
                        </button>
                    </div>
                </div>
            </div>

            {/* ALL MODALS */}
            <FilePreviewModal file={previewFile} isOpen={!!previewFile} onClose={() => setPreviewFile(null)} />
            <ViewAnswersModal query={query} isOpen={openAnswers} onClose={() => setOpenAnswers(false)} />
            <AddAnswerModal query={query} isOpen={openAddAnswer} onClose={() => setOpenAddAnswer(false)} />
        </>
    );
}