import React from 'react';

export default function LoadingSpinner({ size = "large", fullPage = false }) {
    const sizeClasses = {
        small: "h-8 w-8",
        medium: "h-10 w-10",
        large: "h-12 w-12"
    };

    const spinner = (
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600`}></div>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-theme-primary">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex justify-center py-12">
            {spinner}
        </div>
    );
}