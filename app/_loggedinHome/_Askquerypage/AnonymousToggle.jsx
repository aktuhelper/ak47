import React from 'react';
import { EyeOff, Send } from 'lucide-react';

const AnonymousToggle = ({
    isAnonymous,
    setIsAnonymous,
    onSubmit,
    title,
    query,
    wordCount,
    maxWords
}) => {
    const isFormValid = title.trim() && query.trim() && wordCount <= maxWords;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
          
            <button
                onClick={onSubmit}
                disabled={!isFormValid}
                className={`w-full py-2.5 cursor-pointer rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors ${isFormValid
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                    }`}
            >
                <Send className="w-4  h-4" />
                Post Query
            </button>
        </div>
    );
};

export default AnonymousToggle;