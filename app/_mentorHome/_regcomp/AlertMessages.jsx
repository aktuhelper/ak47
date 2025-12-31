import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ErrorAlert({ message }) {
    if (!message) return null;

    return (
        <div className="mx-5 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">{message}</p>
        </div>
    );
}

export function SuccessAlert({ message }) {
    if (!message) return null;

    return (
        <div className="mx-5 mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">{message}</p>
        </div>
    );
}