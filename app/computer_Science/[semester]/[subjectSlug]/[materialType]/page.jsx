"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft, Download, FileText, BookOpen, BookMarked, FileQuestion, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { BOOK_LINKS } from '@/app/_utils/bookLinks';

export default function MaterialDetailPage() {
    const params = useParams();
    const router = useRouter();

    const { semester, subjectSlug, materialType } = params;
    const subjectCode = subjectSlug?.split('-').pop() || '';
    const subjectName = subjectSlug
        ?.split('-')
        .slice(0, -1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || '';

    const bookData = materialType === 'books' ? BOOK_LINKS[subjectCode] : null;
    const isBookAvailable = bookData && bookData.link;

    // Syllabus links for all semesters
    const syllabusLinks = {
        1: "https://aktu.ac.in/pdf/syllabus/syllabus2223/Syllabus_BTech_First_Yr_Common_other_than_AG_&_BT_effective_from_2022_23_R.pdf",
        2: "https://aktu.ac.in/pdf/syllabus/syllabus2223/Syllabus_BTech_First_Yr_Common_other_than_AG_&_BT_effective_from_2022_23_R.pdf",
        3: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2324/B.Tech_2nd_Yr_CSE_v3.pdf",
        4: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2324/B.Tech_2nd_Yr_CSE_v3.pdf",
        5: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2425/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%203rd%20Year%202024-25.pdf",
        6: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2425/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%203rd%20Year%202024-25.pdf",
        7: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2526/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%204th%20Year%202025-26.pdf",
        8: "https://fms.aktu.ac.in/Resources/aktu/pdf/syllabus/Syllabus2526/B.Tech.%20CS_CE%20and%20CSE%20Syllabus%20%204th%20Year%202025-26.pdf",
    };

    const syllabusLink = syllabusLinks[semester];
    const isSyllabusAvailable = materialType === 'syllabus' && syllabusLink;

    useEffect(() => {
        // SEO-optimized page title
        const materialNames = {
            syllabus: 'Syllabus PDF',
            pyq: 'Previous Year Questions Papers',
            books: 'Quantum Book PDF',
            notes: 'Notes PDF'
        };
        const materialName = materialNames[materialType] || materialType;
        document.title = `${subjectName} ${materialName} - AKTU BTech CSE Semester ${semester} | Free Download`;

        // Add meta description for SEO
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content',
                `Download ${subjectName} (${subjectCode}) ${materialName} for AKTU BTech Computer Science Semester ${semester}. Free PDF download with complete study material, previous year questions, and exam preparation resources.`
            );
        }
    }, [semester, subjectName, materialType, subjectCode]);

    const getMaterialIcon = () => {
        const icons = {
            syllabus: FileText,
            pyq: FileQuestion,
            books: BookMarked,
            notes: BookOpen
        };
        return icons[materialType] || FileText;
    };

    const getMaterialDisplayName = () => {
        const names = {
            syllabus: 'Syllabus',
            pyq: 'Previous Year Questions',
            books: 'Quantum Books',
            notes: 'Study Notes'
        };
        return names[materialType] || materialType;
    };

    const MaterialIcon = getMaterialIcon();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4 py-6">

                {/* Breadcrumb Navigation - SEO Enhanced */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm mb-3 flex-wrap">
                    <Link
                        href="/computer_Science"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                    >
                        AKTU CSE Study Materials
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 dark:text-zinc-400">BTech Semester {semester}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 dark:text-zinc-400">{subjectName} ({subjectCode})</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 dark:text-white font-medium capitalize">{getMaterialDisplayName()}</span>
                </nav>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 hover:gap-3 transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Materials
                </button>

                {/* Header - SEO Enhanced */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 mb-4">
                    <div className="flex gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MaterialIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                                {subjectName} {getMaterialDisplayName()} - AKTU CSE
                            </h1>
                            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded">
                                    {subjectCode} - AKTU
                                </span>
                                <span className="px-2 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 rounded">
                                    {getMaterialDisplayName()}
                                </span>
                                <span className="px-2 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 rounded">
                                    BTech Semester {semester}
                                </span>
                                <span className="px-2 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded">
                                    Computer Science
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 mb-4">

                    {/* Syllabus Material - SEO Enhanced */}
                    {materialType === 'syllabus' && (
                        <div>
                            {isSyllabusAvailable ? (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                Official AKTU {subjectName} Syllabus PDF
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
                                                BTech Computer Science Semester {semester} - {subjectName} ({subjectCode}) Complete Syllabus
                                            </p>
                                            <a
                                                href={syllabusLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download AKTU Syllabus PDF
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-lg p-3 sm:p-4">
                                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                            📘 About This AKTU Syllabus
                                        </h4>
                                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                                            This official {subjectName} ({subjectCode}) syllabus PDF from Dr. A.P.J. Abdul Kalam Technical University (AKTU) contains complete course details for BTech Computer Science Engineering Semester {semester}. The syllabus includes all units, course outcomes, learning objectives, and recommended textbooks.
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-400">
                                            <strong>Source:</strong> Official AKTU website - Latest curriculum as per AKTU examination guidelines
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <AlertCircle className="w-8 h-8 text-gray-400 dark:text-zinc-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        AKTU Syllabus Not Available
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                                        {subjectName} ({subjectCode}) syllabus for semester {semester} is currently unavailable
                                    </p>
                                    <Link
                                        href="/computer_Science"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Browse Other Materials
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Books Material - SEO Enhanced */}
                    {materialType === 'books' && (
                        <div>
                            {isBookAvailable ? (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <BookMarked className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                {subjectName} Quantum Book PDF - AKTU
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
                                                Quantum Series for {subjectName} ({subjectCode}) - BTech CSE Semester {semester}
                                            </p>
                                            <a
                                                href={bookData.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Quantum Book PDF
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-lg p-3 sm:p-4">
                                        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                                            📚 About Quantum Series Books for AKTU
                                        </h4>
                                        <p className="text-sm text-amber-800 dark:text-amber-300 mb-2">
                                            The Quantum book for {subjectName} ({subjectCode}) is specifically designed for AKTU BTech Computer Science students. It contains comprehensive study material, solved previous year question papers, important questions with detailed answers, short notes for quick revision, and complete coverage of all syllabus units as per AKTU examination pattern.
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-400">
                                            <strong>Best For:</strong> AKTU exam preparation, last-minute revision, understanding important topics, and solving previous year questions for Semester {semester}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <AlertCircle className="w-8 h-8 text-gray-400 dark:text-zinc-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Quantum Book Not Available
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                                        {subjectName} ({subjectCode}) Quantum book PDF is currently unavailable for Semester {semester}
                                    </p>
                                    <Link
                                        href="/computer_Science"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Browse Other Study Materials
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PYQ Material - SEO Enhanced with List Format */}
                    {materialType === 'pyq' && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileQuestion className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {subjectName} Previous Year Question Papers (PYQ)
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">
                                        AKTU BTech CSE {subjectName} ({subjectCode}) - Semester {semester} 
                                    </p>
                                </div>
                            </div>

                            {/* PYQ List */}
                            <div className="space-y-3">
                                {/* PYQ Item 1 */}
                                <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                                AKTU {subjectName} Question Paper 2023-24
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-2">
                                                {subjectCode} | BTech CSE Semester {semester}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => alert(`Download ${subjectName} PYQ 2023-24`)}
                                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Download
                                        </button>
                                    </div>
                                </div>

                                {/* PYQ Item 2 */}
                                <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                                AKTU {subjectName} Question Paper 2022-23
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-2">
                                                {subjectCode} | BTech CSE Semester {semester}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => alert(`Download ${subjectName} PYQ 2022-23`)}
                                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Download
                                        </button>
                                    </div>
                                </div>

                                {/* PYQ Item 3 */}
                                <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                                AKTU {subjectName} Question Paper 2021-22
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-2">
                                                {subjectCode} | BTech CSE Semester {semester}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => alert(`Download ${subjectName} PYQ 2021-22`)}
                                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* PYQ Benefits Section */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
                                    <FileQuestion className="w-4 h-4" />
                                    Why Practice AKTU Previous Year Questions?
                                </h4>
                                <ul className="text-sm text-gray-800 dark:text-gray-300 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-600 dark:text-gray-400 mt-0.5">•</span>
                                        <span><strong>Understand Exam Pattern:</strong> Get familiar with AKTU question paper format, marking scheme, and difficulty level for {subjectName} ({subjectCode})</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-600 dark:text-gray-400 mt-0.5">•</span>
                                        <span><strong>Identify Important Topics:</strong> Discover frequently asked questions and high-weightage units in Semester {semester}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-600 dark:text-gray-400 mt-0.5">•</span>
                                        <span><strong>Time Management:</strong> Practice solving papers within 3 hours to improve speed and accuracy for AKTU exams</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gray-600 dark:text-gray-400 mt-0.5">•</span>
                                        <span><strong>Boost Confidence:</strong> Solve actual AKTU papers with solutions to build confidence and reduce exam anxiety</span>
                                    </li>
                                </ul>
                                <p className="text-xs text-gray-700 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <strong>Pro Tip:</strong> Solve these PYQ papers in exam conditions (3 hours, no help) and then review solutions to identify your weak areas. Focus on topics that appear repeatedly across multiple years for maximum marks in AKTU exams.
                                </p>
                            </div>
                        </div>
                    )}
                    {/* Notes Material - SEO Enhanced */}
                    {materialType === 'notes' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <MaterialIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {subjectName} Handwritten Notes PDF
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">
                                AKTU BTech CSE {subjectName} ({subjectCode}) - Semester {semester}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-4">
                                Complete handwritten notes for all units - Perfect for AKTU exam revision
                            </p>
                            <button
                                onClick={() => alert(`Download ${materialType} for ${subjectName}`)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4" />
                                Download Study Notes PDF
                            </button>
                        </div>
                    )}

                    {/* Generic Material (fallback) */}
                    {materialType !== 'books' && materialType !== 'syllabus' && materialType !== 'pyq' && materialType !== 'notes' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <MaterialIcon className="w-8 h-8 text-gray-400 dark:text-zinc-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {getMaterialDisplayName()}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                                {subjectName} ({subjectCode}) - AKTU Semester {semester}
                            </p>
                            <button
                                onClick={() => alert(`Download ${materialType} for ${subjectName}`)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4" />
                                Download {getMaterialDisplayName()}
                            </button>
                        </div>
                    )}
                </div>

                {/* Related Materials - SEO Enhanced */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Other {subjectName} Study Materials for Semester {semester}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['syllabus', 'pyq', 'books', 'notes'].map((type) => {
                            const icons = {
                                syllabus: FileText,
                                pyq: FileQuestion,
                                books: BookMarked,
                                notes: BookOpen
                            };
                            const labels = {
                                syllabus: 'Syllabus',
                                pyq: 'PYQ Papers',
                                books: 'Quantum',
                                notes: 'Notes'
                            };
                            const Icon = icons[type];
                            const isActive = type === materialType;

                            return (
                                <Link
                                    key={type}
                                    href={`/computer_Science/${semester}/${subjectSlug}/${type}`}
                                    className={`p-3 rounded-lg text-center transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mx-auto mb-1" />
                                    <p className="text-xs font-medium">{labels[type]}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* SEO Content Section */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-900 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                        About {subjectName} ({subjectCode}) - AKTU BTech CSE Semester {semester}
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 space-y-2">
                        <p>
                            Access comprehensive study materials for {subjectName} ({subjectCode}), a core subject in AKTU BTech Computer Science Engineering Semester {semester}. Our collection includes official AKTU syllabus PDFs, previous year question papers with solutions, Quantum series books designed for AKTU examination pattern, and handwritten notes covering all important topics.
                        </p>
                        <p>
                            All study materials are available for free download in PDF format. Students can use these resources for regular study, exam preparation, quick revision, and understanding complex concepts in {subjectName}. The materials are regularly updated to match the latest AKTU curriculum and examination guidelines.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}