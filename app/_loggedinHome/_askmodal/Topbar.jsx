import React from 'react';
import { X, Sun, Moon } from 'lucide-react';

export default function Topbar({ T, isDark, onToggleTheme, onClose, isSubmitting }) {
    return (
        <div
            className="aqm-topbar"
            style={{ borderBottomColor: T.topbarBorder }}
        >
            {/* Title & subtitle */}
            <div>
                <div
                    className="aqm-h"
                    style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: T.headingColor }}
                >
                    Ask a Query
                </div>
                <div style={{ fontSize: 12.5, color: T.subColor, marginTop: 2 }}>
                    Fill in the details below to send your question
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>

                {/* Theme toggle */}
                <button
                    className="aqm-icon-btn"
                    style={{ background: T.iconBtnBg, borderColor: T.iconBtnBorder, color: T.iconBtnColor }}
                    onClick={onToggleTheme}
                    title={isDark ? 'Switch to light' : 'Switch to dark'}
                >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                {/* Close button */}
                <button
                    className="aqm-icon-btn"
                    style={{ background: T.iconBtnBg, borderColor: T.iconBtnBorder, color: T.iconBtnColor }}
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    <X size={16} />
                </button>

            </div>
        </div>
    );
}