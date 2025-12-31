import React, { useState } from 'react';

export const MiniBadge = ({ badge }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const Icon = badge.icon;

    return (
        <div className="relative inline-block">
            <div
                className={`w-5 h-5 ${badge.color} rounded-full flex items-center justify-center cursor-pointer border ${badge.borderColor} shadow-sm hover:scale-110 transition-transform`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <Icon className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>

            {showTooltip && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl whitespace-normal">
                    <div className="font-bold">{badge.name}</div>
                    <div className="text-gray-300 text-[10px]">{badge.subtitle}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
};