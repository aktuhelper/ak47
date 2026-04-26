import React from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function Footer({ T, isFormValid, isSubmitting, onCancel, onSubmit, deadline }) {
    const isDark = T.bg === '#09090b';

    const cancelText = isDark ? 'rgba(255,255,255,0.55)' : '#4b5563';
    const cancelHoverText = isDark ? 'rgba(255,255,255,0.85)' : '#111827';

    const isPaid = deadline?.pricePaise > 0;
    const amountLabel = isPaid ? `₹${Math.floor(deadline.pricePaise / 100)}` : null;

    return (
        <div
            className="aqm-footer"
            style={{ borderTopColor: T.topbarBorder, background: T.footerBg }}
        >
            {/* Cancel button */}
            <button
                type="button"
                className="aqm-cancel-btn"
                style={{ borderColor: T.cancelBorder, color: cancelText }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = T.cancelHoverBorder;
                    e.currentTarget.style.color = cancelHoverText;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = T.cancelBorder;
                    e.currentTarget.style.color = cancelText;
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
                        {isPaid ? `Pay ${amountLabel} & Send` : 'Send Query'}
                    </>
                )}
            </button>
        </div>
    );
}