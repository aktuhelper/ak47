import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HomePagee() {
    const userName = "Rahul Kumar";
    const userCollege = "IIT Delhi";
    const userBranch = "CSE";
    const year = "1st Year";

    // Sample data - Same college & branch seniors
    const sameCollegeSeniors = [
        {
            id: 1,
            name: "Prashant Kumar Singh",
            role: "Mentor • CSE",
            college: "IIT Delhi",
            year: "4th Year",
            badge: "Super Mentor",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor1",
            skills: ["React", "Node.js", "Python", "AI/ML", "System Design"],
        },
        {
            id: 2,
            name: "Ananya Sharma",
            role: "Senior • CSE",
            college: "IIT Delhi",
            year: "3rd Year",
            badge: "Mentor",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor2",
            skills: ["JavaScript", "React", "MongoDB"],
        },
        {
            id: 3,
            name: "Vikram Patel",
            role: "Senior • CSE",
            college: "IIT Delhi",
            year: "4th Year",
            badge: null,
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor3",
            skills: ["C++", "DSA", "Competitive Programming"],
        }
    ];

    // Sample data - Same college & branch juniors
    const sameCollegeJuniors = [
        {
            id: 1,
            name: "Amit Verma",
            role: "Junior • CSE",
            college: "IIT Delhi",
            year: "1st Year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior1",
            skills: ["Python", "C++", "Web Dev"],
        },
        {
            id: 2,
            name: "Pooja Gupta",
            role: "Junior • CSE",
            college: "IIT Delhi",
            year: "2nd Year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior2",
            skills: ["Java", "React", "DSA"],
        },
        {
            id: 3,
            name: "Rohit Singh",
            role: "Junior • CSE",
            college: "IIT Delhi",
            year: "1st Year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior3",
            skills: ["HTML", "CSS", "JavaScript"],
        }
    ];

    // Sample data - Other college seniors (same branch)
    const otherCollegeSeniors = [
        {
            id: 1,
            name: "Rajesh Kumar",
            role: "Mentor • CSE",
            college: "IIT Bombay",
            year: "4th Year",
            badge: "Super Mentor",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor4",
            skills: ["Java", "Spring Boot", "Microservices"],
        },
        {
            id: 2,
            name: "Neha Singh",
            role: "Senior • CSE",
            college: "NIT Trichy",
            year: "3rd Year",
            badge: "Mentor",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor5",
            skills: ["Flutter", "Dart", "Mobile Dev"],
        },
        {
            id: 3,
            name: "Karan Mehta",
            role: "Senior • CSE",
            college: "BITS Pilani",
            year: "4th Year",
            badge: null,
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=mentor6",
            skills: ["DevOps", "Docker", "Kubernetes"],
        }
    ];

    // Sample data - Other college juniors (same branch)
    const otherCollegeJuniors = [
        {
            id: 1,
            name: "Sanya Agarwal",
            role: "Junior • CSE",
            college: "IIT Madras",
            year: "2nd Year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior4",
            skills: ["Python", "Django", "PostgreSQL"],
        },
        {
            id: 2,
            name: "Arjun Reddy",
            role: "Junior • CSE",
            college: "NIT Warangal",
            year: "1st Year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior5",
            skills: ["C", "Data Structures", "Algorithms"],
        },
        {
            id: 3,
            name: "Meera Nair",
            role: "Junior • CSE",
            college: "IIIT Hyderabad",
            year: "2nd Year",
            avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=junior6",
            skills: ["React", "TypeScript", "Next.js"],
        }
    ];

    const ProfileCard = ({ profile, type = "mentor" }) => (
        <div className="group bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-500/30 flex flex-col">
            <div className="flex gap-4 p-5 flex-1">
                <div className="flex-shrink-0">
                    <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-zinc-800 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/10 group-hover:ring-blue-500/30 transition-all duration-300"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-gray-900 dark:text-white font-bold text-base truncate">
                                {profile.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{profile.role}</p>
                            <p className="text-blue-600 dark:text-blue-400 text-xs mt-1 flex items-center gap-1 font-bold">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {profile.college}
                            </p>
                        </div>
                        {profile.badge && (
                            <span className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${profile.badge === "Super Mentor"
                                ? "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 shadow-sm shadow-red-500/20"
                                : "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800 shadow-sm shadow-orange-500/20"
                                }`}>
                                ⭐ {profile.badge}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {profile.skills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-zinc-950/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-800 transition-colors duration-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-5 pb-5 flex gap-3">
                <button className="group/view relative flex-1 py-2.5 bg-transparent border-2 border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40">
                    <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-500 dark:to-red-400 transform scale-x-0 group-hover/view:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span className="relative flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                    </span>
                </button>

                <button className="group/connect relative flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/connect:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative flex items-center gap-2">
                        <svg className="w-4 h-4 group-hover/connect:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Connect
                    </span>
                </button>
            </div>
        </div>
    );

    return (
       <div className="min-h-screen pb-10 lg:pb-0">
            {/* Hero Section */}
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
                {/* Same College & Branch Seniors */}
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
                        <a href="/seniors" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sameCollegeSeniors.map((senior) => (
                            <ProfileCard key={senior.id} profile={senior} type="mentor" />
                        ))}
                    </div>
                </section>

                {/* Same College & Branch Juniors */}
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
                        <a href="/juniors" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sameCollegeJuniors.map((junior) => (
                            <ProfileCard key={junior.id} profile={junior} type="junior" />
                        ))}
                    </div>
                </section>

                {/* Other College Seniors (Same Branch) */}
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
                        <a href="/seniors" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {otherCollegeSeniors.map((senior) => (
                            <ProfileCard key={senior.id} profile={senior} type="mentor" />
                        ))}
                    </div>
                </section>

                {/* Other College Juniors (Same Branch) */}
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
                        <a href="/juniors" className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {otherCollegeJuniors.map((junior) => (
                            <ProfileCard key={junior.id} profile={junior} type="junior" />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}