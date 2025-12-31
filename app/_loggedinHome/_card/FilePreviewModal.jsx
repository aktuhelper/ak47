"use client";
import React from "react";
import { Image, FileText, Download, X } from "lucide-react";

export const FilePreviewModal = ({ file, isOpen, onClose }) => {
    if (!isOpen || !file) return null;

    const isImage = file.type === "image";

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {isImage ? (
                            <Image className="w-4 h-4 text-blue-500" />
                        ) : (
                            <FileText className="w-4 h-4 text-orange-500" />
                        )}
                        {file.name}
                    </h3>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/30 min-h-[300px]">
                    {isImage ? (
                        <img
                            src={file.url}
                            alt={file.name}
                            className="max-h-[70vh] w-auto object-contain rounded-lg"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
                                <FileText className="w-10 h-10 text-orange-500" />
                            </div>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg inline-flex items-center gap-2 transition-colors">
                                <Download className="w-4 h-4" /> Download File
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};