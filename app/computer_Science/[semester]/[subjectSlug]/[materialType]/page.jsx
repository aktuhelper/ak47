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
        document.title = `${subjectName} ${materialType.toUpperCase()} - Sem ${semester}`;
    }, [semester, subjectName, materialType]);

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

                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm mb-3 flex-wrap">
                    <Link
                        href="/computer_Science"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                    >
                        Study Materials
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 dark:text-zinc-400">Semester {semester}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 dark:text-zinc-400">{subjectName}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 dark:text-white font-medium capitalize">{getMaterialDisplayName()}</span>
                </nav>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 hover:gap-3 transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 mb-4">
                    <div className="flex gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MaterialIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                                {subjectName}{getMaterialDisplayName() ? ` - ${getMaterialDisplayName()}` : ''}
                            </h1>
                            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded">
                                    {subjectCode}
                                </span>
                                <span className="px-2 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 rounded">
                                    {getMaterialDisplayName()}
                                </span>
                                <span className="px-2 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 rounded">
                                    Sem {semester}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 mb-4">

                    {/* Syllabus Material */}
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
                                                Official AKTU Syllabus
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
                                                Semester {semester} - {subjectName}
                                            </p>
                                            <a
                                                href={syllabusLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Syllabus
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-lg p-3 text-sm text-blue-900 dark:text-blue-200">
                                        <strong>Official Document:</strong> This syllabus is directly from AKTU's official website and contains all course details, units, and outcomes.
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <AlertCircle className="w-8 h-8 text-gray-400 dark:text-zinc-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Not Available
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                                        Syllabus for this semester is not available yet
                                    </p>
                                    <Link
                                        href="/computer_Science"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Materials
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Books Material */}
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
                                                Quantum Series
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
                                                {subjectName} ({subjectCode})
                                            </p>
                                            <a
                                                href={bookData.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Book
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-sm text-amber-900 dark:text-amber-200">
                                        <p>The PDF notes and study materials shared on this website, including content from sources like Quantum Series, educational websites, and Telegram channels, are intended for <strong>educational purposes only</strong>. We do not claim ownership of any materials unless explicitly mentioned. All rights belong to the original creators or publishers. Please support the original authors by purchasing their books or materials if you find them helpful.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <AlertCircle className="w-8 h-8 text-gray-400 dark:text-zinc-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        Not Available
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                                        This book is not available yet
                                    </p>
                                    <Link
                                        href="/computer_Science"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Materials
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Other Materials */}
                    {materialType !== 'books' && materialType !== 'syllabus' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <MaterialIcon className="w-8 h-8 text-gray-400 dark:text-zinc-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {getMaterialDisplayName()}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                                {subjectName} ({subjectCode})
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

                {/* Related Materials */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Other Materials
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['syllabus', 'pyq', 'books', 'notes'].map((type) => {
                            const icons = {
                                syllabus: FileText,
                                pyq: FileQuestion,
                                books: BookMarked,
                                notes: BookOpen
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
                                    <p className="text-xs font-medium capitalize">{type}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}