import React from 'react';

export default function SectionHeader({
    userTypeFilter,
    totalCount,
    selectedCourse,
    selectedBranch,
    selectedYear
}) {
    const getTitle = () => {
        if (userTypeFilter === "mentors") return "Top Junior Mentors";
        if (userTypeFilter === "active") return "Currently Active Juniors";
        return "All Juniors";
    };

    const getMetadata = () => {
        const parts = [];

        if (totalCount > 0) {
            parts.push(`${totalCount} juniors found`);
        }

        parts.push(`Browsing ${selectedCourse}`);

        if (selectedBranch) {
            parts.push(selectedBranch);
        }

        if (selectedYear !== "All") {
            parts.push(selectedYear);
        }

        return parts.join(' • ');
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {getTitle()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {getMetadata()}
            </p>
        </div>
    );
}