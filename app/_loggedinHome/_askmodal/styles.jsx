export const getStyles = () => `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

    .aqm * { box-sizing:border-box; }
    .aqm   { font-family:'DM Sans',sans-serif; }
    .aqm-h { font-family:'Syne',sans-serif; }

    .aqm-overlay {
        position:fixed; inset:0; z-index:9998;
        backdrop-filter:blur(18px);
        opacity:0; transition:opacity 0.4s ease;
    }
    .aqm-overlay.open { opacity:1; }

    .aqm-shell { position:fixed; inset:0; z-index:9999; display:flex; }

    .aqm-panel {
        display:flex; width:100%; height:100%;
        opacity:0; transform:scale(0.97) translateY(14px);
        transition:opacity 0.45s cubic-bezier(0.16,1,0.3,1),
                   transform 0.45s cubic-bezier(0.16,1,0.3,1);
        overflow:hidden;
    }
    .aqm-panel.open { opacity:1; transform:scale(1) translateY(0); }

    /* ── Sidebar ── */
    .aqm-sidebar {
        width:360px; flex-shrink:0;
        padding:48px 36px;
        display:flex; flex-direction:column;
        position:relative; overflow:hidden;
        border-right-width:1px; border-right-style:solid;
        transition:background 0.35s, border-color 0.35s;
    }
    .aqm-sidebar-noise {
        position:absolute; inset:0; pointer-events:none; opacity:0.5;
        background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    }
    .aqm-orb { position:absolute; border-radius:50%; filter:blur(72px); pointer-events:none; }
    .aqm-orb-1 { width:300px;height:300px; top:-60px;  left:-60px; }
    .aqm-orb-2 { width:220px;height:220px; bottom:80px; right:-30px; }
    .aqm-orb-3 { width:160px;height:160px; bottom:-30px; left:30px; }

    /* ── Right panel ── */
    .aqm-right {
        flex:1; display:flex; flex-direction:column; overflow:hidden;
        transition:background 0.35s;
    }
    .aqm-topbar {
        display:flex; align-items:center; justify-content:space-between;
        padding:22px 40px; flex-shrink:0;
        border-bottom-width:1px; border-bottom-style:solid;
        transition:border-color 0.35s;
    }
    .aqm-form-scroll {
        flex:1; overflow-y:auto; padding:32px 40px;
        scrollbar-width:thin;
    }
    .aqm-form-scroll::-webkit-scrollbar { width:4px; }
    .aqm-form-scroll::-webkit-scrollbar-track { background:transparent; }

    /* ── Category pills ── */
    .aqm-cat-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .aqm-cat-pill {
        padding:11px 14px; border-radius:13px; cursor:pointer; outline:none;
        display:flex; align-items:center; gap:8px;
        border-width:1.5px; border-style:solid;
        transition:background 0.18s, border-color 0.18s, box-shadow 0.18s;
    }
    .aqm-cat-pill:hover { box-shadow:0 2px 8px rgba(99,102,241,0.12); }

    /* ── Inputs ── */
    .aqm-input, .aqm-textarea {
        width:100%; border-radius:13px; padding:13px 15px;
        font-size:14px; font-family:'DM Sans',sans-serif;
        outline:none; resize:none; appearance:none;
        border-width:1.5px; border-style:solid;
        transition:background 0.2s, border-color 0.2s, box-shadow 0.2s;
    }

    /* ── Upload zone ── */
    .aqm-upload-zone {
        border-radius:15px; padding:26px;
        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;
        cursor:pointer; border-width:1.5px; border-style:dashed;
        transition:background 0.2s, border-color 0.2s;
    }

    /* ── Buttons ── */
    .aqm-icon-btn {
        width:38px; height:38px; border-radius:11px;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        border-width:1px; border-style:solid; outline:none;
        transition:all 0.2s ease;
    }
    .aqm-icon-btn:hover { filter:brightness(0.92); }

    .aqm-cancel-btn {
        padding:12px 26px; border-radius:13px; background:transparent;
        font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif;
        cursor:pointer; outline:none;
        border-width:1.5px; border-style:solid; transition:all 0.2s;
    }

    .aqm-send-btn {
        flex:1; padding:13px 30px; border-radius:13px; border:none;
        background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 55%,#7c3aed 100%);
        color:#fff; font-size:14px; font-weight:700;
        font-family:'Syne',sans-serif; letter-spacing:0.03em;
        cursor:pointer; outline:none; position:relative; overflow:hidden;
        display:flex; align-items:center; justify-content:center; gap:8px;
        box-shadow:0 6px 28px rgba(99,102,241,0.28), inset 0 1px 0 rgba(255,255,255,0.18);
        transition:transform 0.2s, box-shadow 0.2s;
    }
    .aqm-send-btn::after {
        content:''; position:absolute; inset:0;
        background:linear-gradient(135deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.08) 100%);
        opacity:0; transition:opacity 0.2s;
    }
    .aqm-send-btn:hover::after { opacity:1; }
    .aqm-send-btn:hover { transform:translateY(-1px); box-shadow:0 10px 36px rgba(99,102,241,0.38), inset 0 1px 0 rgba(255,255,255,0.18); }
    .aqm-send-btn:active  { transform:translateY(0); }
    .aqm-send-btn:disabled { opacity:0.42; cursor:not-allowed; transform:none; box-shadow:none; }

    .aqm-footer {
        padding:18px 40px; flex-shrink:0;
        display:flex; align-items:center; gap:10px;
        border-top-width:1px; border-top-style:solid;
        transition:background 0.35s, border-color 0.35s;
    }

    /* ── Misc ── */
    .aqm-error-msg { display:flex; align-items:center; gap:5px; margin-top:6px; font-size:11.5px; color:#f87171; }
    .aqm-field { margin-bottom:22px; animation:aqmFU 0.35s ease both; }
    .aqm-field:nth-child(1){animation-delay:.04s}
    .aqm-field:nth-child(2){animation-delay:.09s}
    .aqm-field:nth-child(3){animation-delay:.14s}
    .aqm-field:nth-child(4){animation-delay:.19s}
    .aqm-section-label {
        font-size:10.5px; font-weight:600; letter-spacing:0.09em; text-transform:uppercase;
        margin-bottom:14px; display:flex; align-items:center; gap:7px;
    }
    .aqm-divider { height:1px; margin:24px 0; }
    .aqm-receiver-card { border-radius:18px; padding:22px; margin-bottom:36px; }
    .aqm-avatar {
        width:68px; height:68px; border-radius:18px;
        display:flex; align-items:center; justify-content:center;
        font-family:'Syne',sans-serif; font-weight:700; font-size:22px;
        position:relative; overflow:hidden; margin-bottom:14px;
    }
    .aqm-avatar img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
    .aqm-avatar-dot {
        position:absolute; bottom:-2px; right:-2px;
        width:15px; height:15px; background:#22c55e;
        border-radius:50%; border-width:2px; border-style:solid;
    }
    .aqm-mentor-badge {
        display:inline-flex; align-items:center; gap:5px;
        padding:4px 10px; border-radius:100px;
        font-size:10.5px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;
    }
    .aqm-tips-list { list-style:none; padding:0; margin:14px 0 0; }
    .aqm-tips-list li {
        display:flex; align-items:flex-start; gap:9px; padding:7px 0;
        font-size:12px; line-height:1.5;
        border-bottom-width:1px; border-bottom-style:solid;
    }
    .aqm-tips-list li:last-child { border-bottom:none; }
    .aqm-tip-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; margin-top:5px; }
    .aqm-file-preview {
        border-radius:14px; overflow:hidden; position:relative;
        border-width:1.5px; border-style:solid;
    }
    .aqm-file-remove {
        position:absolute; top:9px; right:9px;
        width:27px; height:27px; border-radius:8px;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        border-width:1px; border-style:solid; color:#f87171; outline:none;
        transition:filter 0.2s;
    }
    .aqm-file-remove:hover { filter:brightness(1.15); }

    @keyframes spin { to { transform:rotate(360deg); } }
    .aqm-spin { animation:spin 1s linear infinite; }
    @keyframes aqmFU {
        from { opacity:0; transform:translateY(10px); }
        to   { opacity:1; transform:translateY(0); }
    }

    @media (max-width:768px) {
        .aqm-sidebar { display:none; }
        .aqm-topbar,.aqm-form-scroll,.aqm-footer { padding-left:20px; padding-right:20px; }
    }
`;