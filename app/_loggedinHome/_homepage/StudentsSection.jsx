import React from 'react';
import SectionHeader from './SectionHeader';
import CardGrid from './CardGrid';
import SeniorCard from './SeniorCard';

const StudentsSection = ({
    title,
    description,
    viewAllLink,
    students,
    currentUserId,
    emptyMessage = "No students found"
}) => {
    return (
        <section>
            <SectionHeader
                title={title}
                description={description}
                viewAllLink={viewAllLink}
                showViewAll={students && students.length > 0}
            />

            {students && students.length > 0 ? (
                <CardGrid>
                    {students.map((student) => (
                        <SeniorCard
                            key={student.id}
                            senior={student}
                            currentUserId={currentUserId}
                        />
                    ))}
                </CardGrid>
            ) : (
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-gray-400 dark:text-zinc-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {emptyMessage}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Check back later or explore other sections
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default StudentsSection;