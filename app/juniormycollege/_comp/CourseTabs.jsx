import React from 'react';

export default function CourseTabs({ courses, selectedCourse, onCourseChange }) {
    return (
        <div className="flex overflow-x-auto pb-2 mb-2 gap-2 no-scrollbar border-b border-gray-100 dark:border-zinc-800/50">
            {courses.map((course) => (
                <button
                    key={course}
                    onClick={() => onCourseChange(course)}
                    className={`whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${selectedCourse === course
                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                            : "text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                        }`}
                >
                    {course}
                </button>
            ))}
        </div>
    );
}