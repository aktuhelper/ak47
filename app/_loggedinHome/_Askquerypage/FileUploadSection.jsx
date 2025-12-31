import React, { useState } from 'react';
import { Paperclip, X } from 'lucide-react';

const FileUploadSection = ({ files, setFiles }) => {
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = (file) => {
        const maxSize = 2 * 1024 * 1024;
        const validTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!validTypes.includes(file.type)) {
            alert(`${file.name} is not allowed. Only images (JPG, PNG, GIF, WebP), PDF, and DOCX files are accepted.`);
            return false;
        }
        if (file.size > maxSize) {
            alert(`${file.name} is too large. Maximum file size is 2MB.`);
            return false;
        }
        return true;
    };

    const handleFileUpload = (e) => {
        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(validateFile);
        setFiles([...files, ...validFiles.slice(0, 5 - files.length)]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(e.dataTransfer.files);
        const validFiles = newFiles.filter(validateFile);
        setFiles([...files, ...validFiles.slice(0, 5 - files.length)]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4">
            <label className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Attachments ({files.length}/5)
            </label>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded p-3 sm:p-4 transition-colors ${isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf,.docx"
                />
                <div className="text-center">
                    <Paperclip className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Drop files or click</p>
                </div>
            </div>
            {files.length > 0 && (
                <div className="space-y-1 mt-2 max-h-24 overflow-y-auto">
                    {files.map((file, index) => {
                        const isImage = file.type.startsWith('image/');
                        const fileURL = isImage ? URL.createObjectURL(file) : null;

                        return (
                            <div key={index} className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-zinc-950 rounded text-xs">
                                {isImage ? (
                                    <img src={fileURL} alt={file.name} className="w-8 h-8 object-cover rounded" />
                                ) : (
                                    <Paperclip className="w-3 h-3 text-gray-500" />
                                )}
                                <span className="flex-1 truncate text-gray-900 dark:text-white">{file.name}</span>
                                <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-600">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FileUploadSection;