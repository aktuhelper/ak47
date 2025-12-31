import React from 'react';
import UserTypeFilter from './UserTypeFilter';
import SearchBar from './SearchBar';
import CourseTabs from './CourseTabs';
import BranchTabs from './BranchTabs';
import YearTabs from './YearTabs';
import PageHeader from './PageHeader';

export default function FiltersContainer({
    // Page Header props
    pageTitle,
    pageSubtitle,
    college,

    // User Type Filter props
    userTypeFilter,
    onUserTypeChange,

    // Search props
    searchQuery,
    onSearchChange,

    // Course props
    courses,
    selectedCourse,
    onCourseChange,

    // Branch props
    branches,
    selectedBranch,
    onBranchChange,
    showBranchFilter,

    // Year props
    years,
    selectedYear,
    onYearChange
}) {
    return (
        <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Page Header */}
                <PageHeader
                    title={pageTitle}
                    subtitle={pageSubtitle}
                    college={college}
                />

                {/* User Type Filter Row */}
                <UserTypeFilter
                    userTypeFilter={userTypeFilter}
                    onFilterChange={onUserTypeChange}
                />

                {/* Search Bar */}
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                />

                {/* Course Tabs */}
                <CourseTabs
                    courses={courses}
                    selectedCourse={selectedCourse}
                    onCourseChange={onCourseChange}
                />

                {/* Branch Tabs (Conditional) */}
                {showBranchFilter && (
                    <BranchTabs
                        branches={branches}
                        selectedBranch={selectedBranch}
                        onBranchChange={onBranchChange}
                    />
                )}

                {/* Year Tabs */}
                <YearTabs
                    years={years}
                    selectedYear={selectedYear}
                    onYearChange={onYearChange}
                />
            </div>
        </div>
    );
}