import React from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function Footer({ T, isFormValid, isSubmitting, onCancel, onSubmit }) {
    return (
        <div
            className="aqm-footer"
            style={{ borderTopColor: T.topbarBorder, background: T.footerBg }}
        >
            {/* Cancel button */}
            <button
                type="button"
                className="aqm-cancel-btn"
                style={{ borderColor: T.cancelBorder, color: T.cancelColor }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = T.cancelHoverBorder;
                    e.currentTarget.style.color = T.cancelHoverColor;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = T.cancelBorder;
                    e.currentTarget.style.color = T.cancelColor;
                }}
                onClick={onCancel}
                disabled={isSubmitting}
            >
                Cancel
            </button>

            {/* Send button */}
            <button
                type="button"
                className="aqm-send-btn"
                onClick={onSubmit}
                disabled={!isFormValid || isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={15} className="aqm-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send size={15} />
                        Send Query
                    </>
                )}
            </button>
        </div>
    );
}