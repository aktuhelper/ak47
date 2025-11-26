import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import AskQueryModal from './AskQueryModal';
import Link from 'next/link';

const SeniorCard = ({ senior, currentUserId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewProfile = () => {
        window.location.href = `/seniormycollege/${senior.id}`;
    };

    const handleAskQuery = () => {
        setIsModalOpen(true);
    };

    const getYearBadgeStyles = (yearBadge) => {
        switch (yearBadge) {
            case '1st-year':
                return 'bg-green-500 text-white dark:bg-green-600';
            case '2nd-year':
                return 'bg-blue-500 text-white dark:bg-blue-600';
            case '3rd-year':
                return 'bg-violet-600 text-white dark:bg-violet-700';
            case '4th-year':
                return 'bg-orange-600 text-white dark:bg-orange-700';
            default:
                return 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    const getYearBadgeContent = (yearBadge) => {
        const icon = (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
        );

        switch (yearBadge) {
            case '1st-year':
                return <>{icon} 1st Year</>;
            case '2nd-year':
                return <>{icon} 2nd Year</>;
            case '3rd-year':
                return <>{icon} 3rd Year</>;
            case '4th-year':
                return <>{icon} 4th Year</>;
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

                            <div className="flex flex-col gap-1.5 items-end">
                                {senior.isMentor && (
                                    <span className="flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap flex items-center gap-1 shadow-sm bg-red-500 text-white dark:bg-red-600">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Mentor
                                    </span>
                                )}
                                {senior.yearBadge && (
                                    <span className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap flex items-center gap-1 shadow-sm ${getYearBadgeStyles(senior.yearBadge)}`}>
                                        {getYearBadgeContent(senior.yearBadge)}
                                    </span>
                                )}
                            </div>
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

                <div className="px-5 pb-5 flex gap-3 mt-auto">
                    <button
                        onClick={handleViewProfile}
                        className="group/view relative flex-1 py-2.5 bg-transparent border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 cursor-pointer"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-500 dark:to-rose-400 transform scale-x-0 group-hover/view:scale-x-100 transition-transform duration-300 origin-left" />
                        <span className="relative flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

            <AskQueryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                receiverName={senior.name}
                receiverRole={senior.yearBadge || 'student'}
                receiverId={senior.id}
                currentUserId={currentUserId}
            />
        </>
    );
};

export default function HomePagee() {
    const userName = "Rahul Kumar";
    const userCollege = "IIT Delhi";
    const userBranch = "CSE";
    const year = "1st Year";
    const currentUserId = 1;

    const sameCollegeSeniors = [
        {
            id: 1,
            name: "Prashant Kumar Singh",
            role: "Mentor",
            college: "IIT Delhi",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: true,
            yearBadge: "4th-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor1",
            skills: ["React", "Node.js", "Python", "AI/ML", "System Design"],
            isActive: true
        },
        {
            id: 2,
            name: "Ananya Sharma",
            role: "Senior Student",
            college: "IIT Delhi",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "3rd-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor2",
            skills: ["JavaScript", "React", "MongoDB"],
            isActive: false
        },
        {
            id: 3,
            name: "Vikram Patel",
            role: "Senior Student & Mentor",
            college: "IIT Delhi",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: true,
            yearBadge: "4th-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor3",
            skills: ["C++", "DSA", "Competitive Programming"],
            isActive: true
        }
    ];

    // Updated junior data to match SeniorCard structure
    const sameCollegeJuniors = [
        {
            id: 101,
            name: "Amit Verma",
            role: "Junior Student",
            college: "IIT Delhi",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "1st-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior1",
            skills: ["Python", "C++", "Web Dev"],
            isActive: true
        },
        {
            id: 102,
            name: "Pooja Gupta",
            role: "Junior Student",
            college: "IIT Delhi",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "2nd-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior2",
            skills: ["Java", "React", "DSA"],
            isActive: false
        },
        {
            id: 103,
            name: "Rohit Singh",
            role: "Junior Student",
            college: "IIT Delhi",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "1st-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior3",
            skills: ["HTML", "CSS", "JavaScript"],
            isActive: true
        }
    ];

    const otherCollegeSeniors = [
        {
            id: 301,
            name: "Rajesh Kumar",
            role: "Senior Student & Mentor",
            college: "IIT Bombay",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: true,
            yearBadge: "4th-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor4",
            skills: ["Java", "Spring Boot", "Microservices"],
            isActive: true
        },
        {
            id: 302,
            name: "Neha Singh",
            role: "Senior Student",
            college: "NIT Trichy",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "3rd-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor5",
            skills: ["Flutter", "Dart", "Mobile Dev"],
            isActive: false
        },
        {
            id: 303,
            name: "Karan Mehta",
            role: "Senior Student",
            college: "BITS Pilani",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "4th-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor6",
            skills: ["DevOps", "Docker", "Kubernetes"],
            isActive: true
        }
    ];

    const otherCollegeJuniors = [
        {
            id: 201,
            name: "Sanya Agarwal",
            role: "Junior Student",
            college: "IIT Madras",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "2nd-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior4",
            skills: ["Python", "Django", "PostgreSQL"],
            isActive: false
        },
        {
            id: 202,
            name: "Arjun Reddy",
            role: "Junior Student",
            college: "NIT Warangal",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "1st-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior5",
            skills: ["C", "Data Structures", "Algorithms"],
            isActive: true
        },
        {
            id: 203,
            name: "Meera Nair",
            role: "Junior Student",
            college: "IIIT Hyderabad",
            course: "BTech",
            branch: "Computer Science Engineering",
            isMentor: false,
            yearBadge: "2nd-year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior6",
            skills: ["React", "TypeScript", "Next.js"],
            isActive: false
        }
    ];

    return (
        <div className="min-h-screen pb-10 lg:pb-0 bg-gray-50 dark:bg-black">
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-black dark:via-zinc-950 dark:to-slate-950 border-b border-gray-200 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            Hey <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{userName}</span>!
                        </h1>
                    </div>
                    <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed">
                        Ready to <span className="font-bold text-blue-600 dark:text-blue-400">connect</span>, <span className="font-bold text-purple-600 dark:text-purple-400">learn</span>, and <span className="font-bold text-pink-600 dark:text-pink-400">grow</span> with your campus connect by <span className="font-bold">AktuHelper</span>
                    </p>
                    <div className="flex flex-wrap gap-4 mt-6">
                        <div className="px-4 py-2 bg-white dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm">
                            <span className="text-sm text-gray-600 dark:text-gray-400">College: </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{userCollege}</span>
                        </div>
                        <div className="px-4 py-2 bg-white dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Branch: </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{userBranch}</span>
                        </div>
                        <div className="px-4 py-2 bg-white dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Year: </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{year}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                Your College Seniors
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Connect with seniors from {userCollege} • {userBranch}
                            </p>
                        </div>
                        <a href="/seniormycollege" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sameCollegeSeniors.map((senior) => (
                            <SeniorCard key={senior.id} senior={senior} currentUserId={currentUserId} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                Your College Juniors
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Guide and mentor juniors from {userCollege} • {userBranch}
                            </p>
                        </div>
                        <Link href="/juniormycollege" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sameCollegeJuniors.map((junior) => (
                            <SeniorCard key={junior.id} senior={junior} currentUserId={currentUserId} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                Seniors from Other Colleges
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Expand your network • {userBranch} students across India
                            </p>
                        </div>
                        <Link href="/seniorfromothercollege" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {otherCollegeSeniors.map((senior) => (
                            <SeniorCard key={senior.id} senior={senior} currentUserId={currentUserId} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                Juniors from Other Colleges
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Share your knowledge • {userBranch} students across India
                            </p>
                        </div>
                        <Link href="/juniorothercollege" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {otherCollegeJuniors.map((junior) => (
                            <SeniorCard key={junior.id} senior={junior} currentUserId={currentUserId} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}