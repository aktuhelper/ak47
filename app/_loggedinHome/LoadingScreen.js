import React from 'react';
import { Shield } from 'lucide-react';

const LoadingScreen = ({ message = "Verifying access..." }) => {
    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center z-50">
            {/* Main content */}
            <div className="relative text-center space-y-8">
                {/* Animated icon with rotating ring */}
                <div className="relative inline-block">
                    {/* Single elegant rotating ring */}
                    <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-500 animate-spin"></div>

                    {/* Icon container */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-4 shadow-lg">
                            <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Text content */}
                <div className="space-y-3">
                    <h2 className="text-slate-900 dark:text-white font-semibold text-xl">
                        {message}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Please wait a moment...
                    </p>

                    {/* Animated dots */}
                    <div className="flex justify-center space-x-2 pt-4">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;