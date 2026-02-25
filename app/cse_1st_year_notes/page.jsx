// app/notes/cse/1st-year/page.jsx

import Link from "next/link";
import { BookOpen, Download, GraduationCap, ChevronRight, NotebookPen } from "lucide-react";

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata = {
    title: "AKTU CSE 1st Year Notes | Free PDF Download 2024 | AKTU Helper",
    description:
        "Download AKTU BTech CSE 1st Year Notes for all subjects — Engineering Mathematics, Physics, Chemistry, C Programming, Communication Skills, and Engineering Graphics. Free unit-wise PDF notes.",
    keywords:
        "AKTU CSE 1st Year Notes, AKTU BTech Notes PDF, Computer Science Engineering notes, AKTU 2024 notes, AKTU first year study notes, Engineering Mathematics notes, AKTU exam notes free download",
    openGraph: {
        title: "AKTU CSE 1st Year Notes | Free PDF Download",
        description:
            "Get all AKTU BTech CSE 1st Year Notes for every subject. Unit-wise handwritten and typed notes for Engineering Mathematics, Physics, C Programming, and more.",
        url: "https://aktuhelper.com/cse_1st_year_notes",
        siteName: "AKTU Helper",
        type: "website",
    },
    alternates: {
        canonical: "https://aktuhelper.com/cse_1st_year_notes",
    },
};

// ── Static Data ───────────────────────────────────────────────────────────────
const subjects = [
    { code: "BAS102", name: "Engineering Chemistry Notes", shortName: "Chemistry Notes", color: "emerald", href: "#" },
    { code: "BAS103", name: "Engineering Mathematics – I Notes", shortName: "Math I Notes", color: "blue", href: "/computer_Science/1/engineering-mathematics-i-BAS103/Notes" },
    { code: "BEE101", name: "Fundamentals of Electrical Engineering Notes", shortName: "Electrical Engg. Notes", color: "amber", href: "#" },
    { code: "BEC101", name: "Fundamentals of Electronics Engineering Notes", shortName: "Electronics Engg. Notes", color: "violet", href: "#" },
    { code: "BCS101", name: "Programming for Problem Solving Notes", shortName: "PPS / C Lang Notes", color: "cyan", href: "#" },
    { code: "BME101", name: "Fundamentals of Mechanical Engineering Notes", shortName: "Mechanical Engg. Notes", color: "rose", href: "#" },
    { code: "BAS104", name: "Environment and Ecology Notes", shortName: "Env. & Ecology Notes", color: "indigo", href: "#" },
    { code: "BAS105", name: "Soft Skills Notes", shortName: "Soft Skills Notes", color: "orange", href: "#" },
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
};

// ── Page Component ─────────────────────────────────────────────────────────────
export default function CSE1stYearNotes() {
    return (
        <main className="min-h-screen bg-theme-primary">

            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 dark:from-orange-900 dark:via-black dark:to-amber-950">
                {/* Decorative grid */}
                <div
                    className="absolute inset-0 opacity-10 dark:opacity-20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Glow orbs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                    <div className="max-w-3xl">
                        {/* Label pill */}
                        <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
                            <GraduationCap className="w-4 h-4 text-orange-200" />
                            <span className="text-sm font-medium text-orange-100">AKTU · BTech CSE · 1st Year</span>
                        </div>

                        {/* H1 — SEO primary heading */}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                            AKTU CSE 1st Year<br />
                            <span className="text-orange-200 dark:text-orange-300">Notes (Unit-wise PDF)</span>
                        </h1>

                        {/* Meta description */}
                        <p className="text-lg text-orange-100 dark:text-orange-200 leading-relaxed mb-8 max-w-2xl">
                            Download free AKTU BTech Computer Science & Engineering 1st Year Notes for all subjects — from Engineering Mathematics to C Programming. Handwritten & typed unit-wise notes for <strong className="text-white">thorough concept building & exam prep</strong>.
                        </p>

                        {/* CTA row */}
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#notes"
                                className="inline-flex items-center gap-2 bg-white text-orange-700 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-all shadow-lg shadow-black/20"
                            >
                                <Download className="w-4 h-4" />
                                Browse All Notes
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

            {/* ── Disclaimer Section ── */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex gap-3 items-start">
                        <span className="text-amber-500 dark:text-amber-400 text-lg leading-tight mt-0.5 shrink-0">⚠️</span>
                        <div>
                            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-1">Disclaimer</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                                The PDF notes and study materials shared on this website, including content from sources like Quantum Series, educational websites, and Telegram channels, are intended for <strong className="text-amber-800 dark:text-amber-300">educational purposes only</strong>. We do not claim ownership of any materials unless explicitly mentioned. All rights belong to the original creators or publishers.{" "}
                                If you are the rightful owner of any content published here and wish for it to be removed, please contact us with proper verification. We will promptly take down the content upon receiving your request.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* SEO Intro Block */}
                <div className="card-theme p-6 sm:p-8 rounded-2xl mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                    <div className="relative">
                        <h2 className="text-xl font-bold text-theme-primary mb-3">
                            About AKTU BTech CSE 1st Year Notes
                        </h2>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            AKTU BTech 1st Year Notes are unit-wise study materials covering the complete syllabus for all common subjects — Engineering Mathematics I & II, Engineering Physics, Engineering Chemistry, Programming for Problem Solving (C Language), Communication Skills, and Engineering Graphics & Design. These notes are prepared by toppers, faculty, and trusted educational sources strictly aligned with the latest AKTU syllabus.
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base">
                            Whether you prefer handwritten notes or clean typed PDFs, <strong className="text-theme-primary">AKTU Notes</strong> help you understand concepts deeply and revise efficiently. All notes are <strong className="text-theme-primary">free to download as PDF</strong> — no sign-up needed.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {["AKTU Notes 2024", "1st Year Study Material", "CSE Branch", "Free PDF", "Unit-wise Notes", "Handwritten Notes"].map((tag) => (
                                <span key={tag} className="badge-theme text-xs">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Subject Cards ── */}
                <div id="subjects" className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-theme-primary">
                        Subjects & Notes
                    </h2>
                    <span className="text-sm text-theme-muted">{subjects.length} subjects · Latest Syllabus</span>
                </div>

                <div id="notes" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                    <NotebookPen className={`w-5 h-5 ${colors.icon}`} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge} mb-1.5 inline-block`}>
                                        {subject.code}
                                    </span>
                                    <h3 className="font-semibold text-sm text-theme-primary group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
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
                        Frequently Asked Questions — AKTU CSE 1st Year Notes
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                q: "What subjects are covered in AKTU BTech CSE 1st Year Notes?",
                                a: "Notes are available for Engineering Mathematics I & II, Engineering Physics, Engineering Chemistry, Programming for Problem Solving (C Language), Communication Skills, and Engineering Graphics & Design — covering the complete AKTU 1st Year syllabus.",
                            },
                            {
                                q: "Are AKTU 1st Year Notes free to download?",
                                a: "Yes, all AKTU Notes available on AKTU Helper are completely free to download as PDF. No sign-up or registration is required.",
                            },
                            {
                                q: "Are these notes handwritten or typed?",
                                a: "AKTU Helper provides both handwritten and typed PDF notes depending on the subject. Handwritten notes are great for visual learners, while typed notes offer cleaner formatting for quick reading.",
                            },
                            {
                                q: "Are AKTU 1st Year Notes the same for all branches?",
                                a: "Yes, most 1st Year subjects — including Mathematics, Physics/Chemistry, Communication Skills, and Engineering Graphics — are common across all AKTU BTech branches. The notes for these subjects apply to all branches.",
                            },
                            {
                                q: "How should I use these notes for exam preparation?",
                                a: "Use unit-wise notes to build strong conceptual clarity, then combine them with Quantum Books for short-answer revision and Notes practice for understanding exam patterns. This three-pronged approach is the most effective strategy for AKTU exams.",
                            },
                            {
                                q: "What is the difference between Notes and Quantum Books?",
                                a: "Notes provide detailed, topic-wise explanations and derivations for deep understanding. Quantum Books are concise question-answer guides designed for last-minute revision. Notes are best for learning concepts; Quantum Books are best for exam revision.",
                            },
                        ].map((faq, i) => (
                            <div key={i} className="card-theme rounded-xl p-5 border-l-4 border-orange-500 dark:border-orange-600">
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
                            "name": "AKTU CSE 1st Year Notes",
                            "description": "Free download AKTU BTech Computer Science Engineering 1st Year Notes (unit-wise PDF) for all subjects.",
                            "url": "https://aktuhelper.com/notes/cse/1st-year",
                            "provider": { "@type": "Organization", "name": "AKTU Helper", "url": "https://aktuhelper.com" },
                            "about": {
                                "@type": "Course",
                                "name": "AKTU BTech CSE 1st Year",
                                "provider": { "@type": "Organization", "name": "Dr. A.P.J. Abdul Kalam Technical University" },
                            },
                            "mainEntity": {
                                "@type": "FAQPage",
                                "mainEntity": [
                                    { "@type": "Question", "name": "What subjects are covered in AKTU BTech CSE 1st Year Notes?", "acceptedAnswer": { "@type": "Answer", "text": "Engineering Mathematics I & II, Engineering Physics, Engineering Chemistry, Programming for Problem Solving, Communication Skills, and Engineering Graphics & Design." } },
                                    { "@type": "Question", "name": "Are AKTU 1st Year Notes free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all Notes on AKTU Helper are free to download as PDF with no sign-up required." } },
                                    { "@type": "Question", "name": "What is the difference between Notes and Quantum Books?", "acceptedAnswer": { "@type": "Answer", "text": "Notes provide detailed topic-wise explanations for deep understanding, while Quantum Books are concise Q&A guides for last-minute exam revision." } },
                                ],
                            },
                        }),
                    }}
                />
            </div>
        </main>
    );
}