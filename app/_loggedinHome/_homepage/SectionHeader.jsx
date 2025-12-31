import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SectionHeader = ({ title, description, viewAllLink, showViewAll = true }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {description}
                </p>
            </div>
            {showViewAll && (
                <Link
                    href={viewAllLink}
                    className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors"
                >
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    );
};

export default SectionHeader;