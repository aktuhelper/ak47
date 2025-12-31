import React from "react";
import { ArrowRight } from "lucide-react";
import CollegeSelector from "./Collegeselector.jsx";

const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "AI & ML", "Data Science"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Passout"];
const courses = ["B.Tech", "M.Tech", "BCA", "MCA", "MBA", "B.Sc", "M.Sc"];

export default function StepTwo({
    collegeSearch,
    selectedCollege,
    manualCollege,
    selectedCourse,
    selectedBranch,
    selectedYear,
    showCollegeDropdown,
    filteredColleges,
    onCollegeSearchChange,
    onCollegeSelect,
    onManualCollegeChange,
    onCollegeFocus,
    onDropdownToggle,
    onCourseChange,
    onBranchChange,
    onYearChange,
    onBack,
    onNext
}) {
    const isEngineeringCourse = selectedCourse === "B.Tech" || selectedCourse === "M.Tech";

    const isValid =
        selectedCourse &&
        selectedYear &&
        (!isEngineeringCourse || selectedBranch) &&
        (selectedCollege && (selectedCollege !== "Other" || manualCollege));

    return (
        <div className="space-y-3.5 animate-slideIn">
            <CollegeSelector
                collegeSearch={collegeSearch}
                selectedCollege={selectedCollege}
                manualCollege={manualCollege}
                showCollegeDropdown={showCollegeDropdown}
                filteredColleges={filteredColleges}
                onSearchChange={onCollegeSearchChange}
                onCollegeSelect={onCollegeSelect}
                onManualCollegeChange={onManualCollegeChange}
                onFocus={onCollegeFocus}
                onDropdownToggle={onDropdownToggle}
            />

            {/* Course Selector */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                    Course
                </label>
                <select
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-gray-900 dark:text-white text-sm"
                    value={selectedCourse}
                    onChange={(e) => onCourseChange(e.target.value)}
                >
                    <option value="">Select course</option>
                    {courses.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Branch Selector (only for engineering) */}
            {isEngineeringCourse && (
                <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                        Branch
                    </label>
                    <select
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-gray-900 dark:text-white text-sm"
                        value={selectedBranch}
                        onChange={(e) => onBranchChange(e.target.value)}
                    >
                        <option value="">Select branch</option>
                        {branches.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Year Selector */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                    Current Year
                </label>
                <select
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-gray-900 dark:text-white text-sm"
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                >
                    <option value="">Select year</option>
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 pt-3">
                <button
                    onClick={onBack}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
                >
                    Continue <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}