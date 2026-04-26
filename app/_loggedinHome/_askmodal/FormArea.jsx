import React from 'react';
import { AlertCircle, Clock, ShieldCheck, IndianRupee, Lock } from 'lucide-react';
import CategoryField from './CategoryField';
import AttachmentField from './AttachmentField';

const PLATFORM_FEE_PERCENT = 20;

export const DEADLINE_TIERS = [
    { label: 'Free', hours: 72, pricePaise: 0, urgent: false },
    { label: '1 hour', hours: 1, pricePaise: 5000, urgent: true },
    { label: '2 hours', hours: 2, pricePaise: 3000, urgent: false },
    { label: '4 hours', hours: 4, pricePaise: 2000, urgent: false },
    { label: '8 hours', hours: 8, pricePaise: 1500, urgent: false },
    { label: '24 hours', hours: 24, pricePaise: 1000, urgent: false },
];

export default function FormArea({
    T,
    category, setCategory,
    queryTitle, setQueryTitle,
    queryText, setQueryText,
    attachment, setAttachment,
    attachmentPreview, setAttachmentPreview,
    errors, setErrors,
    deadline,
    setDeadline,
    onDeadlineChange,
    amountPaise,
    paymentAgreed,
    setPaymentAgreed,
}) {
    const isDark = T.bg === '#09090b';

    const charCount = queryText.length;
    const titleCharCount = queryTitle.length;

    const effectiveAmountPaise = deadline ? deadline.pricePaise : (amountPaise ?? 0);
    const amountRupees = Math.floor(effectiveAmountPaise / 100);
    const platformFee = Math.floor(amountRupees * PLATFORM_FEE_PERCENT / 100);
    const answererPayout = amountRupees - platformFee;

    const isPaidQuery = effectiveAmountPaise > 0;
    const answerDeadline = deadline ? deadline.label : '48 hours';
    const acceptDeadline = '24 hours';

    // ── High-contrast text scale ──
    const primaryText = isDark ? '#ffffff' : '#0f0f0f';
    const secondaryText = isDark ? 'rgba(255,255,255,0.75)' : '#374151';
    const tertiaryText = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
    const mutedText = isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af';

    // ── Semantic color aliases derived from T ──
    const accentColor = T.pillSelBorder;
    const accentBg = T.pillSelBg;
    const accentSoft = T.uploadIconBg;
    const accentBorder = T.uploadIconBorder;
    const accentMuted = T.uploadIconColor;

    const successColor = '#34d399';
    const warningColor = '#f59e0b';
    const urgentColor = '#f87171';
    const urgentBg = 'rgba(248,113,113,0.1)';

    // ── Shared input style helpers ──
    const inputStyle = (errKey) => ({
        background: errors[errKey] ? T.inputErrorBg : T.inputBg,
        borderColor: errors[errKey] ? T.inputErrorBorder : T.inputBorder,
        color: primaryText,
        caretColor: accentColor,
    });

    const inputFocus = (e) => {
        e.target.style.background = T.inputFocusBg;
        e.target.style.borderColor = T.inputFocusBorder;
        e.target.style.boxShadow = T.inputFocusShadow;
    };

    const inputBlur = (e, errKey) => {
        e.target.style.background = errors[errKey] ? T.inputErrorBg : T.inputBg;
        e.target.style.borderColor = errors[errKey] ? T.inputErrorBorder : T.inputBorder;
        e.target.style.boxShadow = 'none';
    };

    return (
        <div
            className="aqm-form-scroll"
            style={{
                background: T.formAreaBg,
                scrollbarColor: `${T.scrollThumb} transparent`,
            }}
        >

            {/* ── Deadline Pricing Selector ── */}
            <div className="aqm-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: secondaryText }}>
                        Response deadline <span style={{ color: urgentColor }}>*</span>
                    </span>
                    {deadline && (
                        <span style={{ fontSize: 11, color: accentColor, fontWeight: 600 }}>
                            ₹{amountRupees} selected
                        </span>
                    )}
                </div>

                {/* Tier cards grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {DEADLINE_TIERS.map((tier) => {
                        const isSelected = deadline?.hours === tier.hours;
                        return (
                            <div
                                key={tier.hours}
                                onClick={() => {
                                    const handler = onDeadlineChange || setDeadline;
                                    handler(tier);
                                    setErrors({ ...errors, deadline: null });
                                }}
                                style={{
                                    border: isSelected
                                        ? `2px solid ${accentColor}`
                                        : `1px solid ${errors.deadline ? T.inputErrorBorder : T.inputBorder}`,
                                    background: isSelected ? accentBg : T.inputBg,
                                    borderRadius: 10,
                                    padding: '10px 8px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'border-color 0.15s, background 0.15s',
                                    userSelect: 'none',
                                }}
                            >
                                <div style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: isSelected ? accentColor : primaryText,
                                    marginBottom: 3,
                                }}>
                                    {tier.label}
                                </div>

                                <div style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: isSelected ? accentColor : primaryText,
                                    marginBottom: 4,
                                }}>
                                    ₹{Math.floor(tier.pricePaise / 100)}
                                </div>

                                {tier.urgent ? (
                                    <span style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: urgentColor,
                                        background: urgentBg,
                                        borderRadius: 4,
                                        padding: '2px 6px',
                                        display: 'inline-block',
                                    }}>
                                        Urgent
                                    </span>
                                ) : (
                                    <span style={{
                                        fontSize: 10,
                                        color: mutedText,
                                        display: 'inline-block',
                                    }}>
                                        Standard
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Helper note */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 8,
                    fontSize: 11,
                    color: tertiaryText,
                }}>
                    <Clock size={11} color={tertiaryText} style={{ flexShrink: 0 }} />
                    Shorter deadlines are priced higher — mentor is compensated for urgency
                </div>

                {errors.deadline && (
                    <div className="aqm-error-msg" style={{ marginTop: 6, color: T.inputErrorBorder }}>
                        <AlertCircle size={12} />
                        {errors.deadline}
                    </div>
                )}
            </div>

            {/* ── Payment Summary Card ── */}
            {isPaidQuery && (
                <div style={{
                    background: T.cardBg ?? T.inputBg,
                    border: `1px solid ${T.cardBorder ?? T.inputBorder}`,
                    borderRadius: 12,
                    padding: '14px 16px',
                    marginBottom: 18,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <IndianRupee size={14} color={accentMuted} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: secondaryText }}>
                            Payment Summary
                        </span>
                        <span style={{
                            marginLeft: 'auto',
                            fontSize: 11,
                            fontWeight: 600,
                            color: accentColor,
                            background: accentSoft,
                            borderRadius: 6,
                            padding: '2px 8px',
                            border: `1px solid ${accentBorder}`,
                        }}>
                            Razorpay Protected
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: tertiaryText }}>You pay</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: primaryText }}>
                                ₹{amountRupees}
                            </span>
                        </div>

                        <div style={{ borderTop: `1px dashed ${T.divider}` }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: tertiaryText }}>Mentor receives (if answered)</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: successColor }}>
                                ₹{answererPayout}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: tertiaryText }}>
                                Platform fee ({PLATFORM_FEE_PERCENT}%)
                            </span>
                            <span style={{ fontSize: 12, color: mutedText }}>
                                ₹{platformFee}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: tertiaryText }}>Refund if unanswered</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: warningColor }}>
                                ₹{answererPayout} back to you
                            </span>
                        </div>

                    </div>
                </div>
            )}

            {/* ── Deadline info row ── */}
            {isPaidQuery && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>

                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                        background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                        borderRadius: 10, padding: '10px 12px',
                    }}>
                        <Clock size={14} color={accentMuted} style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 10, color: tertiaryText, marginBottom: 2 }}>
                                Mentor must answer within
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: primaryText }}>
                                {answerDeadline}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                        background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                        borderRadius: 10, padding: '10px 12px',
                    }}>
                        <ShieldCheck size={14} color={successColor} style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 10, color: tertiaryText, marginBottom: 2 }}>
                                Auto-accepted after
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: primaryText }}>
                                {acceptDeadline} of answer
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* ── Category ── */}
            <CategoryField
                T={T}
                category={category}
                setCategory={setCategory}
                errors={errors}
                setErrors={setErrors}
            />

            {/* ── Title ── */}
            <div className="aqm-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: secondaryText }}>
                        Title <span style={{ color: urgentColor }}>*</span>
                    </span>
                    <span style={{ fontSize: 11, color: titleCharCount > 100 ? urgentColor : mutedText }}>
                        {titleCharCount}/100
                    </span>
                </div>
                <input
                    type="text"
                    value={queryTitle}
                    onChange={e => {
                        setQueryTitle(e.target.value);
                        setErrors({ ...errors, queryTitle: null });
                    }}
                    placeholder="Give your query a clear, descriptive title"
                    className="aqm-input"
                    style={inputStyle('queryTitle')}
                    onFocus={inputFocus}
                    onBlur={e => inputBlur(e, 'queryTitle')}
                />
                {errors.queryTitle && (
                    <div className="aqm-error-msg" style={{ color: T.inputErrorBorder }}>
                        <AlertCircle size={12} />
                        {errors.queryTitle}
                    </div>
                )}
            </div>

            {/* ── Query text ── */}
            <div className="aqm-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: secondaryText }}>
                        Your Query <span style={{ color: urgentColor }}>*</span>
                    </span>
                    <span style={{ fontSize: 11, color: charCount > 1000 ? urgentColor : mutedText }}>
                        {charCount}/1000
                    </span>
                </div>
                <textarea
                    value={queryText}
                    rows={6}
                    onChange={e => {
                        setQueryText(e.target.value);
                        setErrors({ ...errors, queryText: null });
                    }}
                    placeholder="Describe your question in detail. Include context, what you've tried, and what outcome you're looking for..."
                    className="aqm-textarea"
                    style={inputStyle('queryText')}
                    onFocus={inputFocus}
                    onBlur={e => inputBlur(e, 'queryText')}
                />
                {errors.queryText && (
                    <div className="aqm-error-msg" style={{ color: T.inputErrorBorder }}>
                        <AlertCircle size={12} />
                        {errors.queryText}
                    </div>
                )}
            </div>

            {/* ── Attachment ── */}
            <AttachmentField
                T={T}
                attachment={attachment}
                attachmentPreview={attachmentPreview}
                setAttachment={setAttachment}
                setAttachmentPreview={setAttachmentPreview}
                errors={errors}
                setErrors={setErrors}
            />

            {/* ── Private query badge ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                marginTop: 4,
                padding: '9px 12px',
                background: accentSoft,
                borderRadius: 9,
                border: `1px solid ${accentBorder}`,
            }}>
                <Lock size={12} color={accentMuted} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: tertiaryText, lineHeight: 1.5 }}>
                    This is a <strong style={{ color: secondaryText }}>private query</strong> — only you and the mentor can see it.
                </span>
            </div>

            {/* ── Payment agreement checkbox ── */}
            {isPaidQuery && (
                <div style={{ marginTop: 14 }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={paymentAgreed}
                            onChange={e => {
                                setPaymentAgreed(e.target.checked);
                                setErrors({ ...errors, paymentAgreed: null });
                            }}
                            style={{
                                marginTop: 3,
                                accentColor: accentColor,
                                width: 15,
                                height: 15,
                                flexShrink: 0,
                                cursor: 'pointer',
                            }}
                        />
                        <span style={{ fontSize: 12, color: tertiaryText, lineHeight: 1.6 }}>
                            I understand that{' '}
                            <strong style={{ color: secondaryText }}>₹{amountRupees}</strong> will
                            be held in Razorpay. If the mentor answers within{' '}
                            <strong style={{ color: secondaryText }}>{answerDeadline}</strong>, they receive{' '}
                            <strong style={{ color: successColor }}>₹{answererPayout}</strong>.
                            If they don't answer,{' '}
                            <strong style={{ color: warningColor }}>₹{answererPayout}</strong> is
                            refunded to me in 5-7 Business Days via razorpay. Platform retains {PLATFORM_FEE_PERCENT}% in both cases.
                        </span>
                    </label>
                    {errors.paymentAgreed && (
                        <div className="aqm-error-msg" style={{ marginTop: 6, color: T.inputErrorBorder }}>
                            <AlertCircle size={12} />
                            {errors.paymentAgreed}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}