// app/pyq/cse/1st-year/page.jsx

import Link from "next/link";
import { FileText, Download, BookOpen, Calendar, ChevronRight, Star, Users, Clock, ArrowRight, GraduationCap, Search } from "lucide-react";

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata = {
    title: "AKTU CSE 1st Year PYQ | Previous Year Question Papers 2024 | AKTU Helper",
    description:
        "Download AKTU BTech CSE 1st Year Previous Year Question Papers (PYQ) for all subjects — Engineering Mathematics, Physics, Chemistry, Programming, and more. Free PDF download for 2024, 2023, 2022 exams.",
    keywords:
        "AKTU CSE 1st Year PYQ, AKTU BTech Previous Year Papers, Computer Science Engineering question papers, AKTU 2024 PYQ, AKTU first year question papers, Engineering Mathematics PYQ, AKTU exam papers free download",
    openGraph: {
        title: "AKTU CSE 1st Year PYQ | Free Previous Year Question Papers",
        description:
            "Get all AKTU BTech CSE 1st Year Previous Year Question Papers. Boost your exam prep with chapter-wise PYQs from 2019 to 2024.",
        url: "https://aktuhelper.com/cse_1styr_pyq",
        siteName: "AKTU Helper",
        type: "website",
    },
    alternates: {
        canonical: "https://aktuhelper.com/cse_1styr_pyq",
    },
};

// ── Static Data ───────────────────────────────────────────────────────────────





const subjects = [
    { code: "KAS101", name: "Engineering Mathematics – I PYQ", shortName: "Math I PYQ", color: "blue", href: "/computer_Science/1/engineering-mathematics-i-BAS103/pyq" },
    { code: "KAS201", name: "Engineering Mathematics – II PYQ", shortName: "Math II PYQ", color: "indigo", href: "#" },
    { code: "KAS101B", name: "Engineering Physics PYQ", shortName: "Physics PYQ", color: "violet", href: "#" },
    { code: "KCS101", name: "Programming for Problem Solving PYQ", shortName: "PPS / C Lang PYQ", color: "cyan", href: "#" },
    { code: "KAS101A", name: "Engineering Chemistry PYQ", shortName: "Chemistry PYQ", color: "emerald", href: "#" },
    { code: "KNC101", name: "Communication Skills PYQ", shortName: "Comm. Skills PYQ", color: "amber", href: "#" },
    { code: "KNC102", name: "Engineering Graphics & Design PYQ", shortName: "Engg. Graphics PYQ", color: "rose", href: "#" },
];

const colorMap = {
    blue: { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500", ring: "ring-blue-200 dark:ring-blue-800", icon: "text-blue-500 dark:text-blue-400", hover: "hover:border-blue-300 dark:hover:border-blue-700" },
    indigo: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500", ring: "ring-indigo-200 dark:ring-indigo-800", icon: "text-indigo-500 dark:text-indigo-400", hover: "hover:border-indigo-300 dark:hover:border-indigo-700" },
    violet: { badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300", dot: "bg-violet-500", ring: "ring-violet-200 dark:ring-violet-800", icon: "text-violet-500 dark:text-violet-400", hover: "hover:border-violet-300 dark:hover:border-violet-700" },
    cyan: { badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300", dot: "bg-cyan-500", ring: "ring-cyan-200 dark:ring-cyan-800", icon: "text-cyan-500 dark:text-cyan-400", hover: "hover:border-cyan-300 dark:hover:border-cyan-700" },
    emerald: { badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500", ring: "ring-emerald-200 dark:ring-emerald-800", icon: "text-emerald-500 dark:text-emerald-400", hover: "hover:border-emerald-300 dark:hover:border-emerald-700" },
    amber: { badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-500", ring: "ring-amber-200 dark:ring-amber-800", icon: "text-amber-500 dark:text-amber-400", hover: "hover:border-amber-300 dark:hover:border-amber-700" },
    rose: { badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300", dot: "bg-rose-500", ring: "ring-rose-200 dark:ring-rose-800", icon: "text-rose-500 dark:text-rose-400", hover: "hover:border-rose-300 dark:hover:border-rose-700" },
};

// ── Page Component ─────────────────────────────────────────────────────────────
export default function CSE1stYearPYQ() {
    return (
        <main className="min-h-screen bg-theme-primary">

            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-black dark:to-indigo-950">
                {/* Decorative grid */}
                <div
                    className="absolute inset-0 opacity-10 dark:opacity-20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Glow orbs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                    <div className="max-w-3xl">
                        {/* Label pill */}
                        <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
                            <GraduationCap className="w-4 h-4 text-blue-200" />
                            <span className="text-sm font-medium text-blue-100">AKTU · BTech CSE · 1st Year</span>
                        </div>

                        {/* H1 — SEO primary heading */}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                            AKTU CSE 1st Year<br />
                            <span className="text-blue-200 dark:text-blue-300">Previous Year Question Papers</span>
                        </h1>

                        {/* Meta description – shown on page for SEO context */}
                        <p className="text-lg text-blue-100 dark:text-blue-200 leading-relaxed mb-8 max-w-2xl">
                            Download free AKTU BTech Computer Science & Engineering 1st Year PYQ PDFs for all subjects — from Engineering Mathematics to C Programming. Papers from <strong className="text-white">2019–2024</strong> with solutions.
                        </p>

                        {/* CTA row */}
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#papers"
                                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-black/20"
                            >
                                <Download className="w-4 h-4" />
                                Browse All Papers
                            </a>
                            <a
                                href="#subjects"
                                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                <BookOpen className="w-4 h-4" />
                                View Subjects
                            </a>
                        </div>
                    </div>
                </div>

            </section>



            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* SEO Intro Block */}
                <div className="card-theme p-6 sm:p-8 rounded-2xl mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                    <div className="relative">
                        <h2 className="text-xl font-bold text-theme-primary mb-3">
                            About AKTU BTech CSE 1st Year PYQ
                        </h2>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            AKTU (Dr. A.P.J. Abdul Kalam Technical University) BTech 1st Year forms the backbone of your engineering journey. The first year is common for most branches under AKTU, covering core subjects like Engineering Mathematics I & II, Physics or Chemistry, Programming for Problem Solving (C Language), Communication Skills, and Engineering Graphics.
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base">
                            Practising <strong className="text-theme-primary">AKTU Previous Year Question Papers (PYQ)</strong> is one of the most effective exam preparation strategies. These papers reveal the pattern, marking scheme, and frequently repeated topics for each subject. All papers below are <strong className="text-theme-primary">free to download as PDF</strong>.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {["AKTU 2024 PYQ", "1st Year Question Papers", "CSE Branch", "Free PDF", "AKTU Exam Prep", "Semester Papers"].map((tag) => (
                                <span key={tag} className="badge-theme text-xs">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Subject Cards ── */}
                <div id="subjects" className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-theme-primary">
                        Subjects & Question Papers
                    </h2>
                    <span className="text-sm text-theme-muted">{subjects.length} subjects · 2019–2024</span>
                </div>

                <div id="papers" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject, si) => {
                        const colors = colorMap[subject.color];
                        return (
                            <Link
                                key={si}
                                href={subject.href}
                                className={`group card-theme card-theme-hover rounded-2xl p-5 flex items-center gap-4 border-2 border-transparent transition-all duration-200 ${colors.hover}`}
                            >
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ring-2 ${colors.badge} ${colors.ring}`}>
                                    <BookOpen className={`w-5 h-5 ${colors.icon}`} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge} mb-1.5 inline-block`}>
                                        {subject.code}
                                    </span>
                                    <h3 className="font-semibold text-sm text-theme-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                        {subject.name}
                                    </h3>
                                    <p className="text-xs text-theme-muted mt-0.5">{subject.shortName}</p>
                                </div>

                                {/* View Button */}
                                <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${colors.badge} group-hover:scale-105 shadow-sm`}>
                                    <span>View</span>
                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* ── SEO FAQ Section ── */}
                <section className="mt-16" aria-labelledby="faq-heading">
                    <h2 id="faq-heading" className="text-2xl font-bold text-theme-primary mb-6">
                        Frequently Asked Questions — AKTU CSE 1st Year PYQ
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                q: "What subjects are in AKTU BTech CSE 1st Year?",
                                a: "AKTU BTech 1st Year (CSE) covers Engineering Mathematics I & II, Engineering Physics or Chemistry, Programming for Problem Solving (C Language), Communication Skills, and Engineering Graphics & Design.",
                            },
                            {
                                q: "Are these PYQ papers free to download?",
                                a: "Yes, all AKTU previous year question papers available on AKTU Helper are completely free to download as PDF. No sign-up required.",
                            },
                            {
                                q: "How do PYQ papers help in AKTU exam preparation?",
                                a: "PYQ papers reveal the exam pattern, important topics, frequently repeated questions, marking scheme, and paper difficulty level — making them the most reliable tool for exam preparation.",
                            },
                            {
                                q: "Are AKTU 1st year papers the same for all branches?",
                                a: "Yes, most AKTU BTech 1st year papers (Math, Physics/Chemistry, Communication Skills, etc.) are common across branches. Only the Programming (KCS101) paper may have some branch-specific variants.",
                            },
                            {
                                q: "Which year's PYQ should I focus on most?",
                                a: "Focus on the latest 3 years (2022–2024) for pattern accuracy. Older papers (2019–2021) are great for practising additional variety of questions.",
                            },
                            {
                                q: "Where can I find AKTU PYQ solutions?",
                                a: "AKTU Helper provides solved PYQ PDFs for select subjects. Refer to the 'Solutions' tag next to available papers, or check our Quantum Books section for subject-wise solutions.",
                            },
                        ].map((faq, i) => (
                            <div key={i} className="card-theme rounded-xl p-5 border-l-4 border-blue-500 dark:border-blue-600">
                                <h3 className="font-semibold text-theme-primary text-sm mb-2">{faq.q}</h3>
                                <p className="text-theme-secondary text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Schema.org structured data for SEO ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            "name": "AKTU CSE 1st Year Previous Year Question Papers",
                            "description": "Free download AKTU BTech Computer Science Engineering 1st Year PYQ papers for 2019–2024.",
                            "url": "https://aktuhelper.com/cse_1styr_pyq",
                            "provider": { "@type": "Organization", "name": "AKTU Helper", "url": "https://aktuhelper.com" },
                            "about": {
                                "@type": "Course",
                                "name": "AKTU BTech CSE 1st Year",
                                "provider": { "@type": "Organization", "name": "Dr. A.P.J. Abdul Kalam Technical University" },
                            },
                            "mainEntity": {
                                "@type": "FAQPage",
                                "mainEntity": [
                                    { "@type": "Question", "name": "What subjects are in AKTU BTech CSE 1st Year?", "acceptedAnswer": { "@type": "Answer", "text": "Engineering Mathematics I & II, Physics or Chemistry, Programming for Problem Solving, Communication Skills, and Engineering Graphics." } },
                                    { "@type": "Question", "name": "Are AKTU PYQ papers free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all papers on AKTU Helper are free to download as PDF." } },
                                ],
                            },
                        }),
                    }}
                />
            </div>
        </main>
    );
}