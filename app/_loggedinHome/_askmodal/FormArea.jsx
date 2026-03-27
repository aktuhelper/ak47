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
    // deadline-based pricing props
    deadline,         // { label, hours, pricePaise, urgent } | null
    setDeadline,      // setter
    // legacy fixed-price fallback (used when receiverData.query_price > 0 and no deadline tiers)
    amountPaise,
    paymentAgreed,
    setPaymentAgreed,
}) {
    const charCount = queryText.length;
    const titleCharCount = queryTitle.length;

    // Effective amount: deadline tier wins over legacy fixed price
    const effectiveAmountPaise = deadline ? deadline.pricePaise : (amountPaise ?? 0);
    const amountRupees = effectiveAmountPaise / 100;
    const platformFee = Math.round(amountRupees * PLATFORM_FEE_PERCENT / 100);
    const answererPayout = amountRupees - platformFee;

    const isPaidQuery = effectiveAmountPaise > 0;
    const answerDeadline = deadline ? deadline.label : '48 hours';
    const acceptDeadline = '24 hours';

    // ── shared input style helpers ──
    const inputStyle = (errKey) => ({
        background: errors[errKey] ? T.inputErrorBg : T.inputBg,
        borderColor: errors[errKey] ? T.inputErrorBorder : T.inputBorder,
        color: T.textColor,
        caretColor: '#6366f1',
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
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.labelColor }}>
                        Response deadline <span style={{ color: '#f87171' }}>*</span>
                    </span>
                    {deadline && (
                        <span style={{
                            fontSize: 11,
                            color: '#6366f1',
                            fontWeight: 600,
                        }}>
                            ₹{amountRupees.toFixed(0)} selected
                        </span>
                    )}
                </div>

                {/* Tier cards grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                }}>
                    {DEADLINE_TIERS.map((tier) => {
                        const isSelected = deadline?.hours === tier.hours;
                        return (
                            <div
                                key={tier.hours}
                                onClick={() => {
                                    setDeadline(tier);
                                    setErrors({ ...errors, deadline: null });
                                }}
                                style={{
                                    border: isSelected
                                        ? '2px solid #6366f1'
                                        : `1px solid ${errors.deadline ? T.inputErrorBorder : T.inputBorder}`,
                                    background: isSelected
                                        ? 'rgba(99,102,241,0.08)'
                                        : T.inputBg,
                                    borderRadius: 10,
                                    padding: '10px 8px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'border-color 0.15s, background 0.15s',
                                    userSelect: 'none',
                                }}
                            >
                                {/* Time label */}
                                <div style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: isSelected ? '#6366f1' : T.textColor,
                                    marginBottom: 3,
                                }}>
                                    {tier.label}
                                </div>

                                {/* Price */}
                                <div style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: isSelected ? '#6366f1' : T.textColor,
                                    marginBottom: 4,
                                }}>
                                    ₹{(tier.pricePaise / 100).toFixed(0)}
                                </div>

                                {/* Urgency badge */}
                                {tier.urgent ? (
                                    <span style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: '#f87171',
                                        background: 'rgba(248,113,113,0.1)',
                                        borderRadius: 4,
                                        padding: '2px 6px',
                                        display: 'inline-block',
                                    }}>
                                        Urgent
                                    </span>
                                ) : (
                                    <span style={{
                                        fontSize: 10,
                                        color: T.charCountColor,
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
                    color: T.charCountColor,
                }}>
                    <Clock size={11} color={T.charCountColor} style={{ flexShrink: 0 }} />
                    Shorter deadlines are priced higher — mentor is compensated for urgency
                </div>

                {errors.deadline && (
                    <div className="aqm-error-msg" style={{ marginTop: 6 }}>
                        <AlertCircle size={12} />
                        {errors.deadline}
                    </div>
                )}
            </div>

            {/* ── Payment Summary Card (shown once deadline is selected) ── */}
            {isPaidQuery && (
                <div style={{
                    background: T.cardBg ?? T.inputBg,
                    border: `1px solid ${T.inputBorder}`,
                    borderRadius: 12,
                    padding: '14px 16px',
                    marginBottom: 18,
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <IndianRupee size={14} color="#6366f1" />
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.labelColor }}>
                            Payment Summary
                        </span>
                        <span style={{
                            marginLeft: 'auto',
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#6366f1',
                            background: 'rgba(99,102,241,0.12)',
                            borderRadius: 6,
                            padding: '2px 8px',
                        }}>
                            Razorpay Protected
                        </span>
                    </div>

                    {/* Amount rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: T.charCountColor }}>You pay</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: T.textColor }}>
                                ₹{amountRupees.toFixed(2)}
                            </span>
                        </div>

                        <div style={{ borderTop: `1px dashed ${T.inputBorder}` }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: T.charCountColor }}>Mentor receives (if answered)</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>
                                ₹{answererPayout.toFixed(2)}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: T.charCountColor }}>
                                Platform fee ({PLATFORM_FEE_PERCENT}%)
                            </span>
                            <span style={{ fontSize: 12, color: T.charCountColor }}>
                                ₹{platformFee.toFixed(2)}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: T.charCountColor }}>Refund if unanswered</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>
                                ₹{answererPayout.toFixed(2)} back to you
                            </span>
                        </div>

                    </div>
                </div>
            )}

            {/* ── Deadline info row (shown once deadline is selected) ── */}
            {isPaidQuery && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>

                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: T.inputBg,
                        border: `1px solid ${T.inputBorder}`,
                        borderRadius: 10,
                        padding: '10px 12px',
                    }}>
                        <Clock size={14} color="#6366f1" style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 10, color: T.charCountColor, marginBottom: 2 }}>
                                Mentor must answer within
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: T.textColor }}>
                                {answerDeadline}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: T.inputBg,
                        border: `1px solid ${T.inputBorder}`,
                        borderRadius: 10,
                        padding: '10px 12px',
                    }}>
                        <ShieldCheck size={14} color="#34d399" style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 10, color: T.charCountColor, marginBottom: 2 }}>
                                Auto-accepted after
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: T.textColor }}>
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
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.labelColor }}>
                        Title <span style={{ color: '#f87171' }}>*</span>
                    </span>
                    <span style={{ fontSize: 11, color: titleCharCount > 100 ? '#f87171' : T.charCountColor }}>
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
                    <div className="aqm-error-msg">
                        <AlertCircle size={12} />
                        {errors.queryTitle}
                    </div>
                )}
            </div>

            {/* ── Query text ── */}
            <div className="aqm-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.labelColor }}>
                        Your Query <span style={{ color: '#f87171' }}>*</span>
                    </span>
                    <span style={{ fontSize: 11, color: charCount > 1000 ? '#f87171' : T.charCountColor }}>
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
                    <div className="aqm-error-msg">
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
                background: 'rgba(99,102,241,0.07)',
                borderRadius: 9,
                border: '1px solid rgba(99,102,241,0.18)',
            }}>
                <Lock size={12} color="#6366f1" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: T.charCountColor, lineHeight: 1.5 }}>
                    This is a <strong style={{ color: T.labelColor }}>private query</strong> — only you and the mentor can see it.
                </span>
            </div>

            {/* ── Payment agreement checkbox (shown once deadline/price is chosen) ── */}
            {isPaidQuery && (
                <div style={{ marginTop: 14 }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        cursor: 'pointer',
                    }}>
                        <input
                            type="checkbox"
                            checked={paymentAgreed}
                            onChange={e => {
                                setPaymentAgreed(e.target.checked);
                                setErrors({ ...errors, paymentAgreed: null });
                            }}
                            style={{
                                marginTop: 3,
                                accentColor: '#6366f1',
                                width: 15,
                                height: 15,
                                flexShrink: 0,
                                cursor: 'pointer',
                            }}
                        />
                        <span style={{ fontSize: 12, color: T.charCountColor, lineHeight: 1.6 }}>
                            I understand that{' '}
                            <strong style={{ color: T.labelColor }}>₹{amountRupees.toFixed(2)}</strong> will
                            be held in Razorpay. If the mentor answers within{' '}
                            <strong style={{ color: T.labelColor }}>{answerDeadline}</strong>, they receive{' '}
                            <strong style={{ color: '#34d399' }}>₹{answererPayout.toFixed(2)}</strong>.
                            If they don't answer,{' '}
                            <strong style={{ color: '#f59e0b' }}>₹{answererPayout.toFixed(2)}</strong> is
                            refunded to me. Platform retains {PLATFORM_FEE_PERCENT}% in both cases.
                        </span>
                    </label>
                    {errors.paymentAgreed && (
                        <div className="aqm-error-msg" style={{ marginTop: 6 }}>
                            <AlertCircle size={12} />
                            {errors.paymentAgreed}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}