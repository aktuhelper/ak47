// app/cse_3rdyr_pyq/page.jsx

import Link from "next/link";
import { FileText, Download, BookOpen, Calendar, ChevronRight, Star, Users, Clock, ArrowRight, GraduationCap, Search } from "lucide-react";

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata = {
    title: "AKTU CSE 3rd Year PYQ | Previous Year Question Papers 2024 | AKTU Helper",
    description:
        "Download AKTU BTech CSE 3rd Year (5th & 6th Semester) Previous Year Question Papers (PYQ) — DBMS, Web Technology, DAA, Constitution of India, Software Engineering, Compiler Design, Computer Networks, and more. Free PDF download for 2024, 2023, 2022 exams.",
    keywords:
        "AKTU CSE 3rd Year PYQ, AKTU BTech Previous Year Papers, DBMS PYQ, Web Technology PYQ, DAA PYQ, Software Engineering PYQ, Compiler Design PYQ, Computer Networks PYQ, Constitution of India PYQ, AKTU 5th semester papers, AKTU 6th semester papers, AKTU 2024 PYQ free download",
    openGraph: {
        title: "AKTU CSE 3rd Year PYQ | Free Previous Year Question Papers",
        description:
            "Get all AKTU BTech CSE 3rd Year Previous Year Question Papers for Semester 5 & 6. Boost your exam prep with PYQs from 2019 to 2024 — DBMS, Web Technology, DAA, Software Engineering, Compiler Design, Computer Networks & more.",
        url: "https://aktuhelper.com/cse_3rdyr_pyq",
        siteName: "AKTU Helper",
        type: "website",
    },
    alternates: {
        canonical: "https://aktuhelper.com/cse_3rdyr_pyq",
    },
};

// ── Static Data ───────────────────────────────────────────────────────────────
const subjects = [
    // Semester 5
    { code: "BCS501", name: "DBMS(Database Management System) PYQ", shortName: "DBMS Quantum", color: "emerald", href: "/computer_Science/5/dbms-database-management-system-BCS501/pyq" },
    { code: "BCS502", name: "Web Technology PYQ", shortName: "Web Tech Quantum", color: "blue", href: "/computer_Science/5/web-technology-BCS502/pyq" },
    { code: "BCS503", name: "Design and Analysis of Algorithm PYQ", shortName: "DAA Quantum", color: "amber", href: "/computer_Science/5/design-and-analysis-of-algorithm-BCS503/pyq" },
    { code: "BNC501", name: "Constitution of India PYQ", shortName: "Constitution Quantum", color: "violet", href: "/computer_Science/5/constitution-of-india-BNC501/pyq" },

    // Semester 6
    { code: "BCS601", name: "Software Engineering PYQ", shortName: "SE Quantum", color: "cyan", href: "/computer_Science/6/software-engineering-BCS601/pyq" },
    { code: "BCS602", name: "Compiler Design PYQ", shortName: "Compiler Design Quantum", color: "rose", href: "/computer_Science/6/compiler-design-BCS602/pyq" },
    { code: "BCS603", name: "Computer Networks PYQ", shortName: "CN Quantum", color: "indigo", href: "/computer_Science/6/computer-networks-BCS603/pyq" },
    { code: "BNC602", name: "Essence of Indian Traditional Knowledge PYQ", shortName: "EITK Quantum", color: "orange", href: "/computer_Science/6/essence-of-indian-traditional-knowledge-BNC602/pyq" },
];


const colorMap = {
    blue: { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", dot: "bg-blue-500", ring: "ring-blue-200 dark:ring-blue-800", icon: "text-blue-500 dark:text-blue-400", hover: "hover:border-blue-300 dark:hover:border-blue-700" },
    indigo: { badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500", ring: "ring-indigo-200 dark:ring-indigo-800", icon: "text-indigo-500 dark:text-indigo-400", hover: "hover:border-indigo-300 dark:hover:border-indigo-700" },
    violet: { badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300", dot: "bg-violet-500", ring: "ring-violet-200 dark:ring-violet-800", icon: "text-violet-500 dark:text-violet-400", hover: "hover:border-violet-300 dark:hover:border-violet-700" },
    cyan: { badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300", dot: "bg-cyan-500", ring: "ring-cyan-200 dark:ring-cyan-800", icon: "text-cyan-500 dark:text-cyan-400", hover: "hover:border-cyan-300 dark:hover:border-cyan-700" },
    emerald: { badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500", ring: "ring-emerald-200 dark:ring-emerald-800", icon: "text-emerald-500 dark:text-emerald-400", hover: "hover:border-emerald-300 dark:hover:border-emerald-700" },
    amber: { badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300", dot: "bg-amber-500", ring: "ring-amber-200 dark:ring-amber-800", icon: "text-amber-500 dark:text-amber-400", hover: "hover:border-amber-300 dark:hover:border-amber-700" },
    rose: { badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300", dot: "bg-rose-500", ring: "ring-rose-200 dark:ring-rose-800", icon: "text-rose-500 dark:text-rose-400", hover: "hover:border-rose-300 dark:hover:border-rose-700" },
    orange: { badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300", dot: "bg-orange-500", ring: "ring-orange-200 dark:ring-orange-800", icon: "text-orange-500 dark:text-orange-400", hover: "hover:border-orange-300 dark:hover:border-orange-700" },
    teal: { badge: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300", dot: "bg-teal-500", ring: "ring-teal-200 dark:ring-teal-800", icon: "text-teal-500 dark:text-teal-400", hover: "hover:border-teal-300 dark:hover:border-teal-700" },
};

// ── Page Component ─────────────────────────────────────────────────────────────
export default function CSE3rdYearPYQ() {
    return (
        <main className="min-h-screen bg-theme-primary">

            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-black dark:to-indigo-950">
                <div
                    className="absolute inset-0 opacity-10 dark:opacity-20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
                            <GraduationCap className="w-4 h-4 text-blue-200" />
                            <span className="text-sm font-medium text-blue-100">AKTU · BTech CSE · 3rd Year (Sem 5 & 6)</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                            AKTU CSE 3rd Year<br />
                            <span className="text-blue-200 dark:text-blue-300">Previous Year Question Papers</span>
                        </h1>

                        <p className="text-lg text-blue-100 dark:text-blue-200 leading-relaxed mb-8 max-w-2xl">
                            Download free AKTU BTech CSE 3rd Year PYQ PDFs for Semester 5 & 6 — DBMS, Web Technology, Design & Analysis of Algorithms, Constitution of India, Software Engineering, Compiler Design, Computer Networks, and more. Papers from <strong className="text-white">2019–2024</strong> with solutions.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <a href="#papers" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-black/20">
                                <Download className="w-4 h-4" />
                                Browse All Papers
                            </a>
                            <a href="#subjects" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm">
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
                            About AKTU BTech CSE 3rd Year PYQ
                        </h2>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            AKTU (Dr. A.P.J. Abdul Kalam Technical University) BTech 3rd Year (Semester 5 & 6) marks a pivotal stage in Computer Science Engineering, where students dive deeper into systems, software, and networks. This year strengthens both theoretical foundations and practical engineering skills.
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            <strong className="text-theme-primary">Semester 5</strong> covers: Database Management System — DBMS (BCS501), Web Technology (BCS502), Design and Analysis of Algorithms — DAA (BCS503), and Constitution of India (BNC501).
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            <strong className="text-theme-primary">Semester 6</strong> covers: Software Engineering (BCS601), Compiler Design (BCS602), Computer Networks (BCS603), and Essence of Indian Traditional Knowledge — EITK (BNC602).
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base">
                            Practising <strong className="text-theme-primary">AKTU Previous Year Question Papers (PYQ)</strong> is one of the most effective exam preparation strategies. These papers reveal the pattern, marking scheme, and frequently repeated topics for each subject. All papers below are <strong className="text-theme-primary">free to download as PDF</strong>.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {["AKTU 2024 PYQ", "5th Semester Papers", "6th Semester Papers", "DBMS PYQ", "Web Technology PYQ", "DAA PYQ", "Software Engineering PYQ", "Compiler Design PYQ", "Computer Networks PYQ", "Free PDF", "CSE Branch"].map((tag) => (
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
                            <Link key={si} href={subject.href} className={`group card-theme card-theme-hover rounded-2xl p-5 flex items-center gap-4 border-2 border-transparent transition-all duration-200 ${colors.hover}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ring-2 ${colors.badge} ${colors.ring}`}>
                                    <BookOpen className={`w-5 h-5 ${colors.icon}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge} mb-1.5 inline-block`}>
                                        {subject.code}
                                    </span>
                                    <h3 className="font-semibold text-sm text-theme-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                        {subject.name}
                                    </h3>
                                    <p className="text-xs text-theme-muted mt-0.5">{subject.shortName}</p>
                                </div>
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
                        Frequently Asked Questions — AKTU CSE 3rd Year PYQ
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                q: "What subjects are in AKTU BTech CSE 3rd Year (Sem 5 & 6)?",
                                a: "Semester 5 includes DBMS (BCS501), Web Technology (BCS502), Design and Analysis of Algorithms — DAA (BCS503), and Constitution of India (BNC501). Semester 6 includes Software Engineering (BCS601), Compiler Design (BCS602), Computer Networks (BCS603), and Essence of Indian Traditional Knowledge — EITK (BNC602).",
                            },
                            {
                                q: "Are these PYQ papers free to download?",
                                a: "Yes, all AKTU previous year question papers on AKTU Helper are completely free to download as PDF. No sign-up required.",
                            },
                            {
                                q: "How do PYQ papers help in AKTU exam preparation?",
                                a: "PYQ papers reveal the exam pattern, important topics, frequently repeated questions, marking scheme, and paper difficulty — making them the most reliable tool for AKTU exam preparation.",
                            },
                            {
                                q: "Is DBMS and Computer Networks important for AKTU CSE 3rd year?",
                                a: "Yes, DBMS (BCS501) and Computer Networks (BCS603) are among the most important and heavily weighted subjects in AKTU CSE 3rd year. They also form the base for higher semester subjects and placement interviews.",
                            },
                            {
                                q: "Which year's PYQ should I focus on most?",
                                a: "Focus on the latest 3 years (2022–2024) for pattern accuracy. Older papers (2019–2021) are great for practising a wider variety of questions.",
                            },
                            {
                                q: "Where can I find AKTU PYQ solutions?",
                                a: "AKTU Helper provides solved PYQ PDFs for select subjects. Refer to the 'Solutions' tag next to available papers, or check our PYQs section for subject-wise solutions.",
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
                            "name": "AKTU CSE 3rd Year Previous Year Question Papers",
                            "description": "Free download AKTU BTech Computer Science Engineering 3rd Year (Sem 5 & 6) PYQ papers for 2019–2024.",
                            "url": "https://aktuhelper.com/cse_3rdyr_pyq",
                            "provider": { "@type": "Organization", "name": "AKTU Helper", "url": "https://aktuhelper.com" },
                            "about": {
                                "@type": "Course",
                                "name": "AKTU BTech CSE 3rd Year (Semester 5 & 6)",
                                "provider": { "@type": "Organization", "name": "Dr. A.P.J. Abdul Kalam Technical University" },
                            },
                            "mainEntity": {
                                "@type": "FAQPage",
                                "mainEntity": [
                                    { "@type": "Question", "name": "What subjects are in AKTU BTech CSE 3rd Year (Sem 5 & 6)?", "acceptedAnswer": { "@type": "Answer", "text": "Semester 5 includes DBMS (BCS501), Web Technology (BCS502), Design and Analysis of Algorithms — DAA (BCS503), and Constitution of India (BNC501). Semester 6 includes Software Engineering (BCS601), Compiler Design (BCS602), Computer Networks (BCS603), and Essence of Indian Traditional Knowledge — EITK (BNC602)." } },
                                    { "@type": "Question", "name": "Are AKTU PYQ papers free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all papers on AKTU Helper are free to download as PDF. No sign-up required." } },
                                ],
                            },
                        }),
                    }}
                />
            </div>
        </main>
    );
}