// app/cse_4thyr_quantumbooks/page.jsx

import Link from "next/link";
import { BookOpen, Download, GraduationCap, ChevronRight, BookMarked } from "lucide-react";

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata = {
    title: "AKTU CSE 4th Year Quantum Books | Semester 7 & 8 Quantum Books 2024 | AKTU Helper",
    description:
        "Download AKTU BTech CSE 4th Year Quantum Books for Semester 7 & 8 — Artificial Intelligence, Cloud Computing, Cryptography and Network Security, and more. Free PDF download of Quantum Notes for 2024 exams.",
    keywords:
        "AKTU CSE 4th Year Quantum Books, AKTU Quantum Notes, Artificial Intelligence Quantum Book, Cloud Computing Quantum Notes, Cryptography and Network Security Quantum Book, AKTU 7th semester Quantum Books, AKTU 8th semester Quantum Books, AKTU 2024 Quantum Notes free download",
    openGraph: {
        title: "AKTU CSE 4th Year Quantum Books | Free Semester 7 & 8 Notes",
        description:
            "Get all AKTU BTech CSE 4th Year Quantum Books for Semester 7 & 8. Boost your exam prep with Quantum Notes — Artificial Intelligence, Cloud Computing, Cryptography & Network Security & more.",
        url: "https://aktuhelper.com/cse_4th_yr_quantums",
        siteName: "AKTU Helper",
        type: "website",
    },
    alternates: {
        canonical: "https://aktuhelper.com/cse_4th_yr_quantums",
    },
};

// ── Static Data ───────────────────────────────────────────────────────────────
const subjects = [
    // Semester 7
    { code: "BCS701", name: "Artificial Intelligence Quantum Book", shortName: "AI Quantum", color: "emerald", href: "/computer_Science/7/artificial-intelligence-BCS701/books" },
    { code: "BCS07", name: "Cloud Computing Quantum Book", shortName: "Cloud Computing Quantum", color: "blue", href: "/computer_Science/7/cloud-computing-BCS07/books" },

    // Semester 8
    { code: "BCS072", name: "Cryptography and Network Security Quantum Book", shortName: "CNS Quantum", color: "amber", href: "/computer_Science/8/cryptography-and-network-security-BCS072/books" },
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
export default function CSE4thYearQuantumBooks() {
    return (
        <main className="min-h-screen bg-theme-primary">

            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-900 dark:via-black dark:to-teal-950">
                {/* Decorative grid */}
                <div
                    className="absolute inset-0 opacity-10 dark:opacity-20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Glow orbs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                    <div className="max-w-3xl">
                        {/* Label pill */}
                        <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
                            <GraduationCap className="w-4 h-4 text-emerald-200" />
                            <span className="text-sm font-medium text-emerald-100">AKTU · BTech CSE · 4th Year (Sem 7 & 8)</span>
                        </div>

                        {/* H1 */}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                            AKTU CSE 4th Year<br />
                            <span className="text-emerald-200 dark:text-emerald-300">Quantum Books (Short Books)</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-emerald-100 dark:text-emerald-200 leading-relaxed mb-8 max-w-2xl">
                            Download free AKTU BTech CSE 4th Year Quantum Books for Semester 7 & 8 — Artificial Intelligence, Cloud Computing, Cryptography and Network Security, and more. Unit-wise short-answer series for <strong className="text-white">fast revision & exam prep</strong>.
                        </p>

                        {/* CTA row */}
                        <div className="flex flex-wrap gap-3">
                            <a href="#books" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-lg shadow-black/20">
                                <Download className="w-4 h-4" />
                                Browse All Books
                            </a>
                            <a href="#subjects" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm">
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
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                    <div className="relative">
                        <h2 className="text-xl font-bold text-theme-primary mb-3">
                            About AKTU BTech CSE 4th Year Quantum Books
                        </h2>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            Quantum Books (also called Short Books or Quantum Series) are the most popular exam-preparation resource for AKTU BTech students. They provide unit-wise short-answer questions, important long-answer questions, and solved problems strictly aligned with the AKTU syllabus. The 4th Year Quantum Books cover all core CSE subjects across Semester 7 and Semester 8.
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            <strong className="text-theme-primary">Semester 7</strong> Quantum Books available for: Artificial Intelligence (BCS701) and Cloud Computing (BCS07).
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base mb-4">
                            <strong className="text-theme-primary">Semester 8</strong> Quantum Books available for: Cryptography and Network Security (BCS072).
                        </p>
                        <p className="text-theme-secondary leading-relaxed text-sm sm:text-base">
                            Whether you're revising the night before the exam or building a strong conceptual foundation, <strong className="text-theme-primary">AKTU Quantum Books</strong> are your go-to resource. All quantum PDFs below are <strong className="text-theme-primary">free to download</strong> — no sign-up needed.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {["AKTU Quantum 2024", "7th Semester Notes", "8th Semester Notes", "AI Quantum", "Cloud Computing Quantum", "Cryptography Quantum", "Network Security Quantum", "Free PDF", "CSE Branch"].map((tag) => (
                                <span key={tag} className="badge-theme text-xs">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Subject Cards ── */}
                <div id="subjects" className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-theme-primary">
                        Subjects & Quantum Books
                    </h2>
                    <span className="text-sm text-theme-muted">{subjects.length} subjects · Latest Edition</span>
                </div>

                <div id="books" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject, si) => {
                        const colors = colorMap[subject.color];
                        return (
                            <Link key={si} href={subject.href} className={`group card-theme card-theme-hover rounded-2xl p-5 flex items-center gap-4 border-2 border-transparent transition-all duration-200 ${colors.hover}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ring-2 ${colors.badge} ${colors.ring}`}>
                                    <BookMarked className={`w-5 h-5 ${colors.icon}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge} mb-1.5 inline-block`}>
                                        {subject.code}
                                    </span>
                                    <h3 className="font-semibold text-sm text-theme-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
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
                        Frequently Asked Questions — AKTU CSE 4th Year Quantum Books
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                q: "What are AKTU Quantum Books?",
                                a: "AKTU Quantum Books (also known as Short Books or Quantum Series) are concise study guides written specifically for AKTU BTech students. They contain unit-wise short-answer questions, important long-answer questions, and solved examples aligned with the official AKTU syllabus.",
                            },
                            {
                                q: "Are AKTU Quantum Books free to download?",
                                a: "Yes, all AKTU Quantum Books available on AKTU Helper are completely free to download as PDF. No sign-up or registration is required.",
                            },
                            {
                                q: "Which subjects have Quantum Books for AKTU CSE 4th Year (Sem 7 & 8)?",
                                a: "Semester 7 includes Artificial Intelligence (BCS701) and Cloud Computing (BCS07). Semester 8 includes Cryptography and Network Security (BCS072).",
                            },
                            {
                                q: "Are Quantum Books enough to pass AKTU exams?",
                                a: "Quantum Books are excellent for last-minute revision and covering exam-important topics. For a deeper understanding, it is recommended to combine them with standard textbooks and previous year question papers (PYQ).",
                            },
                            {
                                q: "How should I use Quantum Books for exam preparation?",
                                a: "Use Quantum Books for rapid last-minute revision of important questions and key concepts. Combine them with PYQ practice for a well-rounded preparation strategy. Quantum Books are especially useful for understanding the short-answer format expected in AKTU exams.",
                            },
                            {
                                q: "What is the difference between Quantum Books and PYQ papers?",
                                a: "Quantum Books are curated study guides with predicted and important questions for each unit, while PYQ (Previous Year Question Papers) are actual past exam papers. Both together form the most effective AKTU exam preparation strategy.",
                            },
                        ].map((faq, i) => (
                            <div key={i} className="card-theme rounded-xl p-5 border-l-4 border-emerald-500 dark:border-emerald-600">
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
                            "name": "AKTU CSE 4th Year Quantum Books — Semester 7 & 8",
                            "description": "Free download AKTU BTech Computer Science Engineering 4th Year Quantum Books for Semester 7 & 8, updated for 2024 exams.",
                            "url": "https://aktuhelper.com/cse_4thyr_quantumbooks",
                            "provider": { "@type": "Organization", "name": "AKTU Helper", "url": "https://aktuhelper.com" },
                            "about": {
                                "@type": "Course",
                                "name": "AKTU BTech CSE 4th Year (Semester 7 & 8)",
                                "provider": { "@type": "Organization", "name": "Dr. A.P.J. Abdul Kalam Technical University" },
                            },
                            "mainEntity": {
                                "@type": "FAQPage",
                                "mainEntity": [
                                    { "@type": "Question", "name": "What are AKTU Quantum Books?", "acceptedAnswer": { "@type": "Answer", "text": "AKTU Quantum Books are concise unit-wise study guides with short-answer questions and solved examples aligned with the AKTU syllabus." } },
                                    { "@type": "Question", "name": "Are AKTU Quantum Books free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all Quantum Books on AKTU Helper are free to download as PDF with no sign-up required." } },
                                    { "@type": "Question", "name": "Which subjects have Quantum Books for AKTU CSE 4th Year?", "acceptedAnswer": { "@type": "Answer", "text": "Semester 7: Artificial Intelligence, Cloud Computing. Semester 8: Cryptography and Network Security." } },
                                ],
                            },
                        }),
                    }}
                />
            </div>
        </main>
    );
}