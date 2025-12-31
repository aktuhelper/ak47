import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen({ message = "Loading..." }) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-zinc-300 font-medium">{message}</p>
            </div>
        </div>
    );
}