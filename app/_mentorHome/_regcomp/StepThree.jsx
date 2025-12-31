import React from "react";
import { ArrowRight } from "lucide-react";
import InterestSelector from "./InterestSelector";

export default function StepThree({
    selectedInterests,
    onToggleInterest,
    onBack,
    onNext
}) {
    const isValid = selectedInterests.length >= 3;

    return (
        <div className="space-y-3 animate-slideIn">
            <InterestSelector
                selectedInterests={selectedInterests}
                onToggleInterest={onToggleInterest}
            />

            <div className="flex gap-2 pt-2">
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