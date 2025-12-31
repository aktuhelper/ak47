import React from 'react';

export default function PageHeader({ title, subtitle, college }) {
    return (
        <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title} {college && `• ${college}`}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
            </p>
        </div>
    );
}