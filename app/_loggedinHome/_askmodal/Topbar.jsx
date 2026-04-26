import React from 'react';
import { X, Sun, Moon } from 'lucide-react';

export default function Topbar({ T, isDark, onToggleTheme, onClose, isSubmitting }) {
    return (
        <div
            className="aqm-topbar"
            style={{ borderBottomColor: T.topbarBorder, padding: '8px 14px' }}
        >
            {/* Title & subtitle */}
            <div>
                <div
                    className="aqm-h"
                    style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: T.headingColor }}
                >
                    Ask a Query
                </div>
                <div style={{ fontSize: 11, color: T.subColor, marginTop: 1 }}>
                    Fill in the details below to send your question
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 6 }}>

                {/* Theme toggle */}
                <button
                    className="aqm-icon-btn"
                    style={{ background: T.iconBtnBg, borderColor: T.iconBtnBorder, color: T.iconBtnColor, width: 28, height: 28 }}
                    onClick={onToggleTheme}
                    title={isDark ? 'Switch to light' : 'Switch to dark'}
                >
                    {isDark ? <Sun size={13} /> : <Moon size={13} />}
                </button>

                {/* Close button */}
                <button
                    className="aqm-icon-btn"
                    style={{ background: T.iconBtnBg, borderColor: T.iconBtnBorder, color: T.iconBtnColor, width: 28, height: 28 }}
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    <X size={14} />
                </button>

            </div>
        </div>
    );
}