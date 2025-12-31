import React from "react";
import { X } from "lucide-react";

export default function ModalHeader({ step, onClose }) {
    return (
        <>
            {/* Header Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3.5 relative">
                <button
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                    onClick={onClose}
                >
                    <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-lg font-bold text-white">Join Campus Connect</h2>
                <p className="text-blue-100 text-xs mt-0.5">Step {step} of 4</p>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 dark:bg-zinc-800">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>
        </>
    );
}