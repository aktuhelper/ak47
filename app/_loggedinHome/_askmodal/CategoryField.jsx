import React from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { CATEGORIES, CATEGORY_META } from './constant';

export default function CategoryField({ T, category, setCategory, errors, setErrors }) {
    return (
        <div className="aqm-field">

            {/* Section label */}
            <div className="aqm-section-label" style={{ color: T.sectionLabelColor }}>
                <MessageSquare size={11} />
                Category
                <div style={{ flex: 1, height: 1, background: T.sectionLabelLine }} />
            </div>

            {/* Pills grid */}
            <div className="aqm-cat-grid">
                {CATEGORIES.map(cat => {
                    const sel = category === cat;
                    return (
                        <button
                            key={cat}
                            type="button"
                            className="aqm-cat-pill"
                            style={{
                                background: sel ? T.pillSelBg : T.pillBg,
                                borderColor: sel ? T.pillSelBorder : T.pillBorder,
                            }}
                            onClick={() => {
                                setCategory(cat);
                                setErrors({ ...errors, category: null });
                            }}
                            onMouseEnter={e => {
                                if (!sel) {
                                    e.currentTarget.style.background = T.pillHoverBg;
                                    e.currentTarget.style.borderColor = T.pillHoverBorder;
                                }
                            }}
                            onMouseLeave={e => {
                                if (!sel) {
                                    e.currentTarget.style.background = T.pillBg;
                                    e.currentTarget.style.borderColor = T.pillBorder;
                                }
                            }}
                        >
                            <span style={{ fontSize: 15 }}>
                                {CATEGORY_META[cat]?.emoji}
                            </span>
                            <span style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: sel ? T.pillSelName : T.pillNameColor,
                                textTransform: 'capitalize',
                            }}>
                                {cat}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Error */}
            {errors.category && (
                <div className="aqm-error-msg">
                    <AlertCircle size={12} />
                    {errors.category}
                </div>
            )}

        </div>
    );
}