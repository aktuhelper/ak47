"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AskQueryModal from '../_loggedinHome/AskQueryModal'; // Import the modal component

export default function SeniorCard({ senior, currentUserId }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewProfile = () => {
        router.push(`/seniormycollege/${senior.id}`);
    };

    const handleAskQuery = () => {
        // Open the modal instead of navigating
        setIsModalOpen(true);
    };

    // Badge configuration
    const getBadgeStyles = (yearBadge) => {
        switch (yearBadge) {
            case '2nd-year':
                return 'bg-blue-500 text-white dark:bg-blue-600';
            case '3rd-year':
                return 'bg-violet-600 text-white dark:bg-violet-700';
            case '4th-year':
                return 'bg-orange-600 text-white dark:bg-orange-700';
            case 'mentor':
                return 'bg-red-500 text-white dark:bg-red-600';
            default:
                return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    const getBadgeContent = (yearBadge) => {
        switch (yearBadge) {
            case 'mentor':
                return (
                    <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Mentor
                    </>
                );
            case '2nd-year':
                return (
                    <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        2nd Year
                    </>
                );
            case '3rd-year':
                return (
                    <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        3rd Year
                    </>
                );
            case '4th-year':
                return (
                    <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        4th Year
                    </>
                );
            default:
                return 'Student';
        }
    };

    return (
        <>
            <div className="group bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 dark:hover:shadow-red-500/20 hover:-translate-y-2 hover:border-red-500/30 flex flex-col h-full">
                <div className="flex gap-4 p-5 flex-1">
                    <div className="flex-shrink-0 relative">
                        <img
                            src={senior.avatar}
                            alt={senior.name}
                            className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-zinc-800 shadow-lg shadow-red-500/20 ring-2 ring-red-500/10 group-hover:ring-red-500/30 transition-all duration-300"
                        />
                        {senior.isActive && (
                            <span
                                className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full animate-pulse"
                                title="Active Now"
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-gray-900 dark:text-white font-bold text-base truncate">
                                    {senior.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{senior.role}</p>

                                <div className="text-xs mt-1 space-y-0.5">
                                    <p className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        {senior.college}
                                    </p>
                                    {senior.course && (
                                        <p className="text-gray-500 dark:text-gray-500 text-[11px]">
                                            {senior.course}
                                            {senior.branch && (senior.course.toLowerCase().includes('btech') || senior.course.toLowerCase().includes('mtech')) &&
                                                ` - ${senior.branch}`
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {senior.yearBadge && (
                                <span className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap flex items-center gap-1 shadow-sm ${getBadgeStyles(senior.yearBadge)}`}>
                                    {getBadgeContent(senior.yearBadge)}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {senior.skills?.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-zinc-950/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-800 transition-colors duration-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 pb-5 flex gap-3 mt-auto">
                    <button
                        onClick={handleViewProfile}
                        className="group/view relative flex-1 py-2.5 bg-transparent border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 cursor-pointer"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-500 dark:to-rose-400 transform scale-x-0 group-hover/view:scale-x-100 transition-transform duration-300 origin-left" />

                        <span className="relative flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            View Profile
                        </span>
                    </button>

                    <button
                        onClick={handleAskQuery}
                        className="group/connect relative flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 cursor-pointer"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/connect:translate-x-[100%] transition-transform duration-700" />

                        <span className="relative flex items-center gap-2">
                            <svg
                                className="w-4 h-4 group-hover/connect:rotate-12 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            Ask Query
                        </span>
                    </button>
                </div>
            </div>

            {/* Ask Query Modal */}
            <AskQueryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                receiverName={senior.name}
                receiverRole={senior.yearBadge || 'junior'}
                receiverId={senior.id}
                currentUserId={currentUserId}
            />
        </>
    );
}