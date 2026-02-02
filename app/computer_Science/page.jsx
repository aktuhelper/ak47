"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, FileText, Search, Calendar, Star, TrendingUp, CheckCircle, Lightbulb, BookMarked, GraduationCap, Code, ChevronRight } from 'lucide-react';

export default function StudyMaterialsPage() {
    const router = useRouter();
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Hardcoded subject names and codes for SEO
    const hardcodedSubjects = {
        1: [
            { subject: 'Engineering Chemistry', code: 'BAS102', icon: Code },
            { subject: 'Engineering Mathematics-I', code: 'BAS103', icon: BookOpen },
            { subject: 'Fundamentals of Electrical Engineering', code: 'BEE101', icon: Lightbulb },
            { subject: 'Fundamentals of Electronics Engineering', code: 'BEC101', icon: FileText },
        ],
        2: [
            { subject: 'Programming for Problem Solving', code: 'BCS101', icon: BookMarked },
            { subject: 'Fundamentals of Mechanical Engineering', code: 'BME101', icon: BookMarked },
            { subject: 'Environment and Ecology', code: 'BAS104', icon: BookMarked },
            { subject: 'Soft Skills', code: 'BAS105', icon: BookMarked },
        ],
        3: [
            { subject: 'Math IV', code: 'BAS303', icon: Code },
            { subject: 'UHV(Universal Human Value and Professional Ethics)', code: 'BVE301', icon: BookOpen },
            { subject: 'Technical Communication', code: 'BAS301', icon: FileText },
            { subject: 'Data Structure', code: 'BCS301', icon: BookMarked },
        ],
        4: [
            { subject: 'COA(Computer Organization and Architecture)', code: 'BCS302', icon: Code },
            { subject: 'DSTL', code: 'BCS303', icon: BookOpen },
            { subject: 'Python Programming', code: 'BCC302', icon: FileText },
            { subject: 'Cyber Security', code: 'BCC301', icon: BookMarked },
            { subject: 'TAFL(Theory of Automata and Formal Languages)', code: 'BCS402', icon: Lightbulb },
        ],
        5: [
            { subject: 'DBMS (Database Management System)', code: 'BCS501', icon: Code },
            { subject: 'Web Technology', code: 'BCS502', icon: BookOpen },
            { subject: 'Design and Analysis of Algorithm', code: 'BCS503', icon: FileText },
            { subject: 'Constitution of India', code: 'BNC501', icon: BookMarked },
        ],
        6: [
            { subject: 'Software Engineering', code: 'BCS601', icon: Code },
            { subject: 'Compiler Design', code: 'BCS602', icon: BookOpen },
            { subject: 'Computer Networks', code: 'BCS603', icon: FileText },
            { subject: 'Essence of Indian Traditional Knowledge', code: 'BNC602', icon: BookMarked },
        ],
        7: [
            { subject: 'Artificial Intelligence', code: 'BCS701', icon: Code },
            { subject: 'Cloud Computing', code: 'BCS07', icon: BookOpen },
        ],
        8: [
            { subject: 'Cryptography and Network Security', code: 'BCS072', icon: FileText },
        ]
    };

    useEffect(() => {
        document.title = "Btech Computer Science Study Materials | AKTU Helper";
    }, []);

    const getMaterialsForSubject = (subjectCode) => {
        // Static availability - you can customize this based on your actual data
        return {
            syllabus: { available: true },
            pyq: { available: true },
            books: { available: true },
            notes: { available: true }
        };
    };

    const semesters = [
        { id: 1, name: 'Semester 1', subjects: hardcodedSubjects[1]?.length || 0 },
        { id: 2, name: 'Semester 2', subjects: hardcodedSubjects[2]?.length || 0 },
        { id: 3, name: 'Semester 3', subjects: hardcodedSubjects[3]?.length || 0 },
        { id: 4, name: 'Semester 4', subjects: hardcodedSubjects[4]?.length || 0 },
        { id: 5, name: 'Semester 5', subjects: hardcodedSubjects[5]?.length || 0 },
        { id: 6, name: 'Semester 6', subjects: hardcodedSubjects[6]?.length || 0 },
        { id: 7, name: 'Semester 7', subjects: hardcodedSubjects[7]?.length || 0 },
        { id: 8, name: 'Semester 8', subjects: hardcodedSubjects[8]?.length || 0 }
    ];

    const categories = ['All', 'Syllabus', 'PYQ', 'Books', 'Notes'];

    const currentMaterials = (hardcodedSubjects[selectedSemester] || []).map(subject => ({
        id: subject.code,
        subject: subject.subject,
        code: subject.code,
        icon: subject.icon,
        materials: getMaterialsForSubject(subject.code)
    }));

    const filteredMaterials = currentMaterials.filter(material => {
        const matchesSearch = material.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.code.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedCategory === 'All') return matchesSearch;

        const categoryKey = selectedCategory.toLowerCase();
        return matchesSearch && material.materials[categoryKey]?.available;
    });

    const getMaterialIcon = (type) => {
        const icons = {
            syllabus: FileText,
            pyq: FileText,
            books: BookMarked,
            notes: BookOpen
        };
        return icons[type] || FileText;
    };

    const getMaterialDisplayName = (type) => {
        const names = {
            syllabus: 'Syllabus',
            pyq: 'PYQ',
            books: 'Books',
            notes: 'Notes'
        };
        return names[type] || type;
    };

    const handleMaterialClick = (subjectCode, materialType, subjectName) => {
        // Convert subject name to URL-friendly slug
        const subjectSlug = subjectName
            .toLowerCase()
            .replace(/[()]/g, '') // Remove parentheses
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/&/g, 'and') // Replace & with 'and'
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();

        // Navigate to dedicated material page - UPDATED PATH
        router.push(`/computer_Science/${selectedSemester}/${subjectSlug}-${subjectCode}/${materialType}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-black dark:via-zinc-950 dark:to-black">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse dark:bg-blue-500/10" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse dark:bg-purple-500/10" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <div className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4 sm:mb-6 dark:bg-blue-900/30 dark:border-blue-800">
                            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-400">Computer Science & Engineering</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight px-4">
                            Study Materials Portal For Computer Science Engineering
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
                            Access semester-wise syllabus, notes, PYQs, and Quantum books all in one place
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search subjects or codes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 outline-none transition-all duration-300 bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-500"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative px-4 sm:px-6 pb-12 sm:pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Sidebar - Semester Selection */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 sticky top-6 shadow-lg dark:bg-zinc-900 dark:border-zinc-800">
                                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 dark:text-white">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                    Semesters
                                </h2>
                                <div className="space-y-2">
                                    {semesters.map((sem) => (
                                        <button
                                            key={sem.id}
                                            onClick={() => setSelectedSemester(sem.id)}
                                            className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${selectedSemester === sem.id
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm sm:text-base">{sem.name}</span>
                                                <span className={`text-xs sm:text-sm px-2 py-0.5 rounded-full ${selectedSemester === sem.id
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-400'
                                                    }`}>
                                                    {sem.subjects} subjects
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content - Subject Cards */}
                        <div className="lg:col-span-3">
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    Semester {selectedSemester} - Study Materials
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                                    {filteredMaterials.length} subject{filteredMaterials.length !== 1 ? 's' : ''} found
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredMaterials.map((material, index) => {
                                    const Icon = material.icon;
                                    const materialOrder = ['syllabus', 'pyq', 'books', 'notes'];

                                    return (
                                        <div
                                            key={material.id}
                                            className="relative group"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            <div className="relative bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800">
                                                {/* Subject Header */}
                                                <div className="bg-slate-50 border-b-2 border-slate-100 p-4 dark:bg-zinc-800 dark:border-zinc-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Icon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <h3 className="text-base font-bold text-slate-900 truncate dark:text-white">{material.subject}</h3>
                                                            <p className="text-xs text-slate-600 dark:text-zinc-400">{material.code}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md flex-shrink-0 dark:bg-amber-900/30 dark:border-amber-800">
                                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                                                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Popular</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Materials Grid */}
                                                <div className="p-4 dark:bg-zinc-900">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {materialOrder.map((type) => {
                                                            const data = material.materials[type];
                                                            const MaterialIcon = getMaterialIcon(type);
                                                            const displayName = getMaterialDisplayName(type);

                                                            return (
                                                                <button
                                                                    key={type}
                                                                    disabled={!data?.available}
                                                                    onClick={() => handleMaterialClick(material.code, type, material.subject)}
                                                                    className={`relative p-3 rounded-lg border-2 transition-all duration-300 text-left ${data?.available
                                                                        ? 'border-slate-200 hover:border-blue-400 hover:shadow-md bg-white cursor-pointer transform hover:scale-105 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-blue-500'
                                                                        : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-50 dark:bg-zinc-900 dark:border-zinc-800'
                                                                        }`}
                                                                >
                                                                    <div className="flex flex-col items-center text-center gap-2">
                                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data?.available
                                                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                                            : 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600'
                                                                            }`}>
                                                                            <MaterialIcon className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="w-full">
                                                                            <h4 className="text-xs font-semibold text-slate-900 mb-1 truncate dark:text-white">
                                                                                {displayName}
                                                                            </h4>
                                                                            {data?.available ? (
                                                                                <div className="flex items-center justify-center gap-1 text-xs text-green-600 dark:text-green-400">
                                                                                    <ChevronRight className="w-3 h-3" />
                                                                                    <span>View</span>
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-xs text-slate-400 dark:text-zinc-600">N/A</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredMaterials.length === 0 && (
                                <div className="text-center py-12 sm:py-20">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 dark:bg-zinc-800">
                                        <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-zinc-600" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 dark:text-white">No materials found</h3>
                                    <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Tips Section */}
            <div className="relative px-4 sm:px-6 pb-12 sm:pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-2xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Study Smart, Not Hard!</h3>
                                <p className="text-sm sm:text-base text-white/90 mb-4">
                                    Download materials early, make notes, solve PYQs regularly, and refer to Quantum books for comprehensive preparation.
                                </p>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs sm:text-sm">
                                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Regular Updates</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs sm:text-sm">
                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Quality Content</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs sm:text-sm">
                                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Free Access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer Section */}
            <div className="relative px-4 sm:px-6 pb-12 sm:pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 dark:bg-blue-900/10 dark:border-blue-800">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 dark:text-blue-400">
                                    ⚠️ Disclaimer
                                </h3>
                                <div className="text-sm sm:text-base text-blue-800 dark:text-blue-300 space-y-2">
                                    <p>
                                        The PDF notes and study materials shared on this website, including content from sources like Quantum Series, educational websites, and Telegram channels, are intended for <strong>educational purposes only</strong>. We do not claim ownership of any materials unless explicitly mentioned. All rights belong to the original creators or publishers.
                                    </p>
                                    <p>
                                        If you are the rightful owner of any content published here and wish for it to be removed, please contact us with proper verification. We will promptly take down the content upon receiving your request.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}