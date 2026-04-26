import { useEffect } from 'react';

const PLATFORM_FEE_PERCENT = 20;

function SectionTitle({ children }) {
    return (
        <div style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '18px 0 8px',
        }}>
            {children}
        </div>
    );
}

function TermRow({ children }) {
    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13, color: '#555', lineHeight: 1.65 }}>
            <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#ccc', marginTop: 8, flexShrink: 0,
            }} />
            <div>{children}</div>
        </div>
    );
}

function SplitCard({ label, amount, percent, color }) {
    return (
        <div style={{
            background: '#f8f8f6',
            borderRadius: 8,
            padding: '10px 12px',
            textAlign: 'center',
            flex: 1,
        }}>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: color || '#111' }}>₹{amount}</div>
            <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{percent}%</div>
        </div>
    );
}

function OutcomeBlock({ badge, badgeColor, badgeBg, splits }) {
    return (
        <div style={{
            background: '#fafaf8',
            border: '0.5px solid #e8e8e4',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 8,
        }}>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 6,
                background: badgeBg,
                color: badgeColor,
                marginBottom: 10,
            }}>
                {badge}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                {splits.map((s, i) => (
                    <SplitCard key={i} {...s} />
                ))}
            </div>
        </div>
    );
}

export default function PaymentTermsModal({
    isOpen,
    onClose,
    amountRupees = 500,
    answerDeadline = '48 hours',
}) {
    const platformFee = Math.round(amountRupees * PLATFORM_FEE_PERCENT / 100);
    const mentorAccept = amountRupees - platformFee;
    const mentorReject = Math.round(amountRupees * 10 / 100);
    const refundReject = amountRupees - platformFee - mentorReject;
    const refundMiss = amountRupees - platformFee;

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, padding: 16,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: 14,
                    width: '100%',
                    maxWidth: 520,
                    maxHeight: '88vh',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '0.5px solid #e0e0db',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                }}
            >
                {/* ── Header ── */}
                <div style={{
                    padding: '18px 20px 14px',
                    borderBottom: '0.5px solid #ebebeb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexShrink: 0,
                }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 500, color: '#111' }}>
                            Payment terms &amp; conditions
                        </div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                            Read carefully before proceeding with payment
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: '0.5px solid #d0d0cc',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 12,
                            color: '#666',
                            padding: '5px 14px',
                            flexShrink: 0,
                            marginLeft: 12,
                        }}
                    >
                        Close
                    </button>
                </div>

                {/* ── Body ── */}
                <div style={{ overflowY: 'auto', padding: '4px 20px 20px' }}>

                    <SectionTitle>Escrow &amp; payment hold</SectionTitle>
                    <TermRow>
                        Your payment of <strong>₹{amountRupees}</strong> is securely held in escrow by Razorpay
                        and is not released to the mentor at the time of booking.
                    </TermRow>
                    <TermRow>
                        A <strong>non-refundable platform fee of {PLATFORM_FEE_PERCENT}% (₹{platformFee})</strong> is
                        retained by the platform in all cases — acceptance, rejection, or non-response.
                    </TermRow>

                    <SectionTitle>Payment split by outcome</SectionTitle>

                    <OutcomeBlock
                        badge="You accept the answer"
                        badgeBg="#EAF3DE"
                        badgeColor="#3B6D11"
                        splits={[
                            { label: 'Mentor', amount: mentorAccept, percent: 80, color: '#3B6D11' },
                            { label: 'Platform', amount: platformFee, percent: 20, color: '#555' },
                            { label: 'Refund', amount: 0, percent: 0, color: '#ccc' },
                        ]}
                    />

                    <OutcomeBlock
                        badge="You reject the answer"
                        badgeBg="#FAEEDA"
                        badgeColor="#854F0B"
                        splits={[
                            { label: 'Mentor', amount: mentorReject, percent: 10, color: '#854F0B' },
                            { label: 'Platform', amount: platformFee, percent: 20, color: '#555' },
                            { label: 'Refund', amount: refundReject, percent: 70, color: '#3B6D11' },
                        ]}
                    />

                    <OutcomeBlock
                        badge="Mentor doesn't respond in time"
                        badgeBg="#FAECE7"
                        badgeColor="#993C1D"
                        splits={[
                            { label: 'Mentor', amount: 0, percent: 0, color: '#ccc' },
                            { label: 'Platform', amount: platformFee, percent: 20, color: '#555' },
                            { label: 'Refund', amount: refundMiss, percent: 80, color: '#3B6D11' },
                        ]}
                    />

                    <SectionTitle>Auto-acceptance policy</SectionTitle>
                    <TermRow>
                        If you neither accept nor reject an answer within <strong>{answerDeadline}</strong> of
                        receiving it, the answer is <strong>automatically accepted</strong> and the mentor
                        receives their 80% payout.
                    </TermRow>
                    <TermRow>
                        You will receive email reminders before auto-acceptance is triggered. It is your
                        sole responsibility to review the answer within the deadline.
                    </TermRow>

                    <SectionTitle>Refund policy</SectionTitle>
                    <TermRow>
                        Refunds are processed via Razorpay and typically reflect within{' '}
                        <strong>5–7 business days</strong> depending on your bank or payment method.
                    </TermRow>
                    <TermRow>
                        The platform fee is <strong>non-refundable</strong> under all circumstances —
                        including disputes, cancellations, or unsatisfactory answers.
                    </TermRow>
                    <TermRow>
                        Refunds are <strong>not available</strong> once auto-acceptance has been triggered.
                    </TermRow>

                    <SectionTitle>Dispute &amp; liability</SectionTitle>
                    <TermRow>
                        The platform acts solely as a facilitator. We do not guarantee the quality,
                        accuracy, or completeness of any answer provided by mentors.
                    </TermRow>
                    <TermRow>
                        Disputes must be raised within <strong>24 hours</strong> of receiving the answer
                        by contacting support — <strong>before</strong> accepting or rejecting.
                    </TermRow>
                    <TermRow>
                        Your accept or reject decision is <strong>final and cannot be reversed</strong>.
                        Once submitted, no further claims can be made on that query.
                    </TermRow>

                    {/* Legal notice */}
                    <div style={{
                        background: '#FAEEDA',
                        borderRadius: 8,
                        padding: '11px 14px',
                        fontSize: 12,
                        color: '#854F0B',
                        lineHeight: 1.65,
                        marginTop: 14,
                    }}>
                        By checking the box and submitting payment, you confirm you have read,
                        understood, and agree to these terms. This constitutes a legally binding
                        agreement between you and the platform.
                    </div>
                </div>

                {/* ── Footer ── */}
                <div style={{
                    padding: '13px 20px',
                    borderTop: '0.5px solid #ebebeb',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexShrink: 0,
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: '0.5px solid #d0d0cc',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: 13,
                            color: '#444',
                            padding: '7px 20px',
                        }}
                    >
                        I understand, close
                    </button>
                </div>
            </div>
        </div>
    );
}