import React from 'react';
import { Sparkles } from 'lucide-react';

const TIPS = [
    'Be specific about your problem',
    'Include relevant context or background',
    'Attach supporting documents if needed',
    'Check existing answers before asking',
];

export default function Sidebar({ T, receiverData }) {
    const isDark = T.bg === '#09090b';

    const initials = (receiverData.name || receiverData.username || 'U')
        .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const getPrimaryBadge = () => {
        if (!receiverData) return null;
        if (receiverData.eliteMentor) return { name: 'Elite Mentor', color: '#a855f7' };
        if (receiverData.superMentor) return { name: 'Super Mentor', color: '#f59e0b' };
        if (receiverData.isMentor) return { name: 'Mentor', color: '#10b981' };
        return null;
    };
    const primaryBadge = getPrimaryBadge();

    return (
        <div
            className="aqm-sidebar"
            style={{
                background: isDark ? '#000000' : T.sidebarBg,
                borderRightColor: T.border,
                width: 240,
                minWidth: 240,
                maxWidth: 240,
            }}
        >
            {/* Noise texture */}
            <div className="aqm-sidebar-noise" />

            {/* Ambient orbs */}
            <div className="aqm-orb aqm-orb-1" style={{ background: `radial-gradient(circle,${T.orb1} 0%,transparent 70%)` }} />
            <div className="aqm-orb aqm-orb-2" style={{ background: `radial-gradient(circle,${T.orb2} 0%,transparent 70%)` }} />
            <div className="aqm-orb aqm-orb-3" style={{ background: `radial-gradient(circle,${T.orb3} 0%,transparent 70%)` }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Private Query badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px 5px 8px', borderRadius: 100,
                    background: T.badgeBg, border: `1px solid ${T.badgeBorder}`,
                    color: T.badgeColor, fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.02em', width: 'fit-content', marginBottom: 28,
                }}>
                    <Sparkles size={11} style={{ color: '#6366f1' }} />
                    Private Query
                </div>

                {/* Receiver card */}
                <div
                    className="aqm-receiver-card"
                    style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                >
                    {/* Avatar */}
                    <div
                        className="aqm-avatar"
                        style={{ background: T.avatarBg, border: `2px solid ${T.cardBorder}`, color: T.avatarColor }}
                    >
                        {receiverData.avatar
                            ? <img src={receiverData.avatar} alt="" />
                            : initials
                        }
                        <div className="aqm-avatar-dot" style={{ borderColor: T.avatarBorderColor }} />
                    </div>

                    {/* Name */}
                    <div
                        className="aqm-h"
                        style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: T.headingColor, marginBottom: 3 }}
                    >
                        {receiverData.name || receiverData.username}
                    </div>

                    {/* Username */}
                    <div style={{ fontSize: 12.5, color: T.subColor, marginBottom: 12 }}>
                        @{receiverData.username || receiverData.name?.toLowerCase().replace(' ', '_')}
                    </div>

                    {/* Mentor badge */}
                    {primaryBadge && (
                        <div
                            className="aqm-mentor-badge"
                            style={{
                                background: `${primaryBadge.color}18`,
                                border: `1px solid ${primaryBadge.color}40`,
                                color: primaryBadge.color,
                            }}
                        >
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: primaryBadge.color, display: 'inline-block' }} />
                            {primaryBadge.name}
                        </div>
                    )}
                </div>

                {/* Tips */}
                <div style={{ fontSize: 13, color: T.tipsTitle, fontWeight: 600, marginBottom: 2 }}>
                    Tips for a great query
                </div>
                <ul className="aqm-tips-list">
                    {TIPS.map((tip, i) => (
                        <li key={i} style={{ color: T.tipsItem, borderBottomColor: T.tipsBorder }}>
                            <div className="aqm-tip-dot" style={{ background: T.tipsDot }} />
                            {tip}
                        </li>
                    ))}
                </ul>

                {/* Divider */}
                <div className="aqm-divider" style={{ background: T.divider }} />

                {/* Footer note */}
                <div style={{ fontSize: 11.5, color: T.dimColor, lineHeight: 1.65 }}>
                    Your query will be delivered directly to {receiverData.name?.split(' ')[0] || 'them'} and they'll respond as soon as possible.
                </div>

            </div>
        </div>
    );
}