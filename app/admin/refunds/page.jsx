// app/admin/refunds/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
    IndianRupee, RefreshCw, CheckCircle, XCircle,
    Clock, AlertTriangle, Eye, Copy, RotateCcw,
    ArrowLeft, Search, ShieldAlert, Wallet
} from "lucide-react";

const PAGE_SIZE = 10;

// ── helpers ────────────────────────────────────────────────────────────────
function fmt(paise) {
    return (paise / 100).toFixed(2);
}
function timeAgo(iso) {
    if (!iso) return "—";
    const d = Date.now() - new Date(iso);
    if (d < 60000) return "just now";
    if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
    if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
    return `${Math.floor(d / 86400000)}d ago`;
}
function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "2-digit",
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
}

// ── sub-components ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        completed: { label: "Completed", cls: "bg-green-950/60 text-green-400 border-green-900/50" },
        failed: { label: "Failed", cls: "bg-red-950/60 text-red-400 border-red-900/50" },
        pending: { label: "Pending", cls: "bg-amber-950/60 text-amber-400 border-amber-900/50" },
        review: { label: "Review", cls: "bg-orange-950/60 text-orange-400 border-orange-900/50" },
    };
    const { label, cls } = map[status] || map.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${cls}`}>
            {label}
        </span>
    );
}

function QueryTypeBadge({ type }) {
    const map = {
        reject: { label: "Rejected", cls: "bg-red-950/40 text-red-400 border-red-900/40" },
        expire: { label: "Expired", cls: "bg-orange-950/40 text-orange-400 border-orange-900/40" },
        manual: { label: "Manual", cls: "bg-indigo-950/40 text-indigo-400 border-indigo-900/40" },
    };
    const { label, cls } = map[type] || map.manual;
    return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded border ${cls}`}>
            {label}
        </span>
    );
}

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <button onClick={copy} className="text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0">
            {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        </button>
    );
}

// ── detail modal ───────────────────────────────────────────────────────────
function RefundModal({ txn, onClose, onRetry, onResolve, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full sm:max-w-md bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">

                {/* head */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 flex-shrink-0">
                    <div>
                        <p className="text-sm font-bold">Refund Details</p>
                        <p className="text-xs text-zinc-500 mt-0.5 font-mono truncate max-w-[220px]">{txn.id}</p>
                    </div>
                    <button onClick={onClose}
                        className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                        <XCircle className="w-4 h-4" />
                    </button>
                </div>

                {/* body — scrollable */}
                <div className="px-5 py-4 space-y-1 overflow-y-auto">
                    {[
                        ["User", txn.userName],
                        ["Email", txn.userEmail],
                        ["Query", txn.queryTitle],
                        ["Reason", <QueryTypeBadge type={txn.queryType} />],
                        ["Amount", <span className="text-amber-400 font-mono font-bold">₹{fmt(txn.amount)}</span>],
                        ["Status", <StatusBadge status={txn.status} />],
                        ["Initiated", fmtDate(txn.createdAt)],
                        ["Settled", fmtDate(txn.settledAt)],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-start justify-between gap-4 py-2 border-b border-zinc-900">
                            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">{k}</span>
                            <span className="text-xs font-medium text-right break-all font-mono">{v}</span>
                        </div>
                    ))}

                    {/* Payment ID */}
                    <div className="flex items-start justify-between gap-4 py-2 border-b border-zinc-900">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Payment ID</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-mono text-indigo-400 break-all">
                                {txn.razorpayPaymentId || "—"}
                            </span>
                            {txn.razorpayPaymentId && <CopyButton text={txn.razorpayPaymentId} />}
                        </div>
                    </div>

                    {/* Refund ID */}
                    <div className="flex items-start justify-between gap-4 py-2 border-b border-zinc-900">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex-shrink-0">Refund ID</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-mono text-green-400 break-all">
                                {txn.razorpayRefundId || <span className="text-zinc-600">Not generated</span>}
                            </span>
                            {txn.razorpayRefundId && <CopyButton text={txn.razorpayRefundId} />}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="py-2">
                        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Note</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">{txn.note || "—"}</p>
                    </div>
                </div>

                {/* actions */}
                {(txn.status === "failed" || txn.status === "review") && (
                    <div className="px-5 py-4 border-t border-zinc-800 flex gap-3 flex-shrink-0">
                        {txn.status === "failed" && (
                            <button
                                onClick={() => onRetry(txn.id)}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-red-950/60 hover:bg-red-950 text-red-400 border border-red-900/50 rounded-xl transition-colors disabled:opacity-40"
                            >
                                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                                Retry via Razorpay
                            </button>
                        )}
                        {txn.status === "review" && (
                            <button
                                onClick={() => onResolve(txn.id)}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-green-950/60 hover:bg-green-950 text-green-400 border border-green-900/50 rounded-xl transition-colors disabled:opacity-40"
                            >
                                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                Mark Resolved
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── mobile card row ────────────────────────────────────────────────────────
function MobileRow({ txn, onAction, actionLoading, onView }) {
    return (
        <div className="px-4 py-3.5 bg-zinc-950 space-y-2.5">
            {/* top: name + badges */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold truncate">{txn.userName}</span>
                        <QueryTypeBadge type={txn.queryType} />
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{txn.queryTitle}</p>
                    <p className="text-[11px] text-zinc-600 font-mono mt-0.5">{txn.userEmail}</p>
                </div>
                <StatusBadge status={txn.status} />
            </div>

            {/* middle: amount + IDs */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-0.5 text-amber-400 font-bold font-mono text-sm">
                    <IndianRupee className="w-3.5 h-3.5 opacity-80" />
                    {fmt(txn.amount)}
                </div>
                {txn.razorpayPaymentId && (
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[11px] text-zinc-600">pay:</span>
                        <span className="text-[11px] font-mono text-indigo-400 truncate max-w-[110px]">
                            {txn.razorpayPaymentId}
                        </span>
                        <CopyButton text={txn.razorpayPaymentId} />
                    </div>
                )}
                {txn.razorpayRefundId && (
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[11px] text-zinc-600">rfnd:</span>
                        <span className="text-[11px] font-mono text-green-400 truncate max-w-[110px]">
                            {txn.razorpayRefundId}
                        </span>
                        <CopyButton text={txn.razorpayRefundId} />
                    </div>
                )}
            </div>

            {/* bottom: actions + time */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-zinc-600">{timeAgo(txn.createdAt)}</span>
                <div className="flex items-center gap-2">
                    {txn.status === "failed" && (
                        <button onClick={() => onAction(txn.id, "retry")} disabled={actionLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-red-950/60 hover:bg-red-950 text-red-400 border border-red-900/50 rounded-lg transition-colors disabled:opacity-40">
                            <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                    )}
                    {txn.status === "review" && (
                        <button onClick={() => onAction(txn.id, "resolve")} disabled={actionLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-green-950/60 hover:bg-green-950 text-green-400 border border-green-900/50 rounded-lg transition-colors disabled:opacity-40">
                            <CheckCircle className="w-3 h-3" /> Resolve
                        </button>
                    )}
                    <button onClick={() => onView(txn)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors">
                        <Eye className="w-3 h-3" /> View
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── main page ──────────────────────────────────────────────────────────────
export default function AdminRefundsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/refunds");
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch {
            showToast("Failed to load refunds", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── filter + search + paginate ─────────────────────────────────────────
    const filtered = transactions.filter(t => {
        const fMatch = filter === "all" || t.status === filter;
        const s = search.toLowerCase();
        const sMatch = !s ||
            t.userName.toLowerCase().includes(s) ||
            t.queryTitle.toLowerCase().includes(s) ||
            (t.razorpayPaymentId || "").toLowerCase().includes(s) ||
            (t.razorpayRefundId || "").toLowerCase().includes(s);
        return fMatch && sMatch;
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── stats ──────────────────────────────────────────────────────────────
    const stats = {
        total: transactions.reduce((s, t) => s + t.amount, 0),
        completed: transactions.filter(t => t.status === "completed").length,
        failed: transactions.filter(t => t.status === "failed").length,
        needsAction: transactions.filter(t => t.status === "failed" || t.status === "review").length,
        failedAmt: transactions.filter(t => t.status === "failed").reduce((s, t) => s + t.amount, 0),
    };

    // ── actions ────────────────────────────────────────────────────────────
    const handleAction = async (txnId, action) => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/admin/refunds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: txnId, action }),
            });
            if (!res.ok) throw new Error("Failed");
            setTransactions(prev =>
                prev.map(t => t.id === txnId ? { ...t, status: "completed", settledAt: new Date().toISOString() } : t)
            );
            setModal(null);
            showToast(action === "retry" ? "Refund retried successfully" : "Marked as resolved");
        } catch {
            showToast("Action failed. Try again.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const filterCounts = {
        all: transactions.length,
        completed: transactions.filter(t => t.status === "completed").length,
        failed: transactions.filter(t => t.status === "failed").length,
        pending: transactions.filter(t => t.status === "pending").length,
        review: transactions.filter(t => t.status === "review").length,
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">

            {/* NAV */}
            <div className="sticky top-0 z-10 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-950/40 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        <span className="text-sm font-semibold">Refund Panel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={load} disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all disabled:opacity-40">
                            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                        <a href="/admin/payouts">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all">
                                <ArrowLeft className="w-3 h-3" />
                                <span className="hidden sm:inline">Payouts</span>
                            </button>
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

                {/* ALERT */}
                {stats.needsAction > 0 && (
                    <div className="flex items-start gap-3 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3 mb-4 sm:mb-5 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-red-300 font-medium text-xs sm:text-sm">
                            {stats.needsAction} refund{stats.needsAction > 1 ? "s" : ""} need attention —
                            <span className="text-red-400"> {stats.failed} failed</span>,
                            <span className="text-orange-400"> {filterCounts.review} under review</span>.
                            Tap a row to investigate.
                        </span>
                    </div>
                )}

                {/* STATS — 2 cols on mobile, 4 on sm+ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {[
                        { label: "Total Refunded", value: `₹${fmt(stats.total)}`, sub: `${transactions.length} txns`, color: "text-amber-400", dot: "bg-amber-400" },
                        { label: "Completed", value: stats.completed, sub: "Processed", color: "text-green-400", dot: "bg-green-400" },
                        { label: "Failed", value: stats.failed, sub: `₹${fmt(stats.failedAmt)} at risk`, color: "text-red-400", dot: "bg-red-400" },
                        { label: "Needs Action", value: stats.needsAction, sub: "Pending + review", color: "text-orange-400", dot: "bg-orange-400" },
                    ].map(({ label, value, sub, color, dot }) => (
                        <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5">
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                                <span className="truncate">{label}</span>
                            </p>
                            <p className={`text-lg sm:text-xl font-bold font-mono ${color}`}>{value}</p>
                            <p className="text-[11px] text-zinc-600 mt-0.5 truncate">{sub}</p>
                        </div>
                    ))}
                </div>

                {/* FILTERS + SEARCH */}
                {/* On mobile: search on top, filters scroll horizontally below */}
                <div className="mb-4 space-y-2">
                    {/* Search — full width on mobile */}
                    <div className="relative w-full sm:w-48 sm:ml-auto">
                        <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search name, ID…"
                            className="w-full pl-7 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 focus:border-indigo-500/50 rounded-lg text-white placeholder:text-zinc-600 outline-none transition-colors"
                        />
                    </div>

                    {/* Filter pills — horizontal scroll on mobile */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {Object.entries(filterCounts).map(([key, count]) => (
                            <button key={key} onClick={() => { setFilter(key); setPage(1); }}
                                className={`flex-shrink-0 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all
                                    ${filter === key
                                        ? key === "all" ? "bg-indigo-950/60 text-indigo-400 border-indigo-900/50"
                                            : key === "completed" ? "bg-green-950/60 text-green-400 border-green-900/50"
                                                : key === "failed" ? "bg-red-950/60 text-red-400 border-red-900/50"
                                                    : key === "pending" ? "bg-amber-950/60 text-amber-400 border-amber-900/50"
                                                        : "bg-orange-950/60 text-orange-400 border-orange-900/50"
                                        : "bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300"
                                    }`}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLE */}
                <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/70">

                    {/* Desktop header — hidden on mobile */}
                    <div className="hidden sm:grid grid-cols-[1.8fr_1.2fr_1.2fr_0.8fr_90px_130px] gap-4 px-4 py-2.5 bg-zinc-900/60">
                        {["User / Query", "Payment ID", "Refund ID", "Amount", "Status", "Actions"].map(h => (
                            <p key={h} className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{h}</p>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <RefreshCw className="w-5 h-5 animate-spin text-zinc-600" />
                            <p className="text-sm text-zinc-600">Loading refunds…</p>
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-green-950/30 border border-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-sm font-medium text-zinc-400">No refunds found</p>
                            <p className="text-xs text-zinc-600">Try adjusting your filters</p>
                        </div>
                    ) : rows.map(txn => (
                        <div key={txn.id}>
                            {/* Mobile card */}
                            <div className="sm:hidden">
                                <MobileRow
                                    txn={txn}
                                    onAction={handleAction}
                                    actionLoading={actionLoading}
                                    onView={setModal}
                                />
                            </div>

                            {/* Desktop row */}
                            <div className="hidden sm:grid grid-cols-[1.8fr_1.2fr_1.2fr_0.8fr_90px_130px] gap-4 items-center px-4 py-3.5 bg-zinc-950 hover:bg-zinc-900/50 transition-colors">

                                {/* User + query */}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-semibold truncate">{txn.userName}</span>
                                        <QueryTypeBadge type={txn.queryType} />
                                    </div>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{txn.queryTitle}</p>
                                    <p className="text-[11px] text-zinc-600 font-mono mt-0.5">{txn.userEmail}</p>
                                </div>

                                {/* Payment ID */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-xs font-mono text-indigo-400 truncate">
                                        {txn.razorpayPaymentId ? txn.razorpayPaymentId.slice(0, 16) + "…" : "—"}
                                    </span>
                                    {txn.razorpayPaymentId && <CopyButton text={txn.razorpayPaymentId} />}
                                </div>

                                {/* Refund ID */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-xs font-mono text-green-400 truncate">
                                        {txn.razorpayRefundId
                                            ? txn.razorpayRefundId.slice(0, 16) + "…"
                                            : <span className="text-zinc-600">—</span>}
                                    </span>
                                    {txn.razorpayRefundId && <CopyButton text={txn.razorpayRefundId} />}
                                </div>

                                {/* Amount */}
                                <div className="flex items-center gap-0.5 text-amber-400 font-bold font-mono text-sm">
                                    <IndianRupee className="w-3.5 h-3.5 opacity-80" />
                                    {fmt(txn.amount)}
                                </div>

                                {/* Status */}
                                <div><StatusBadge status={txn.status} /></div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {txn.status === "failed" && (
                                        <button onClick={() => handleAction(txn.id, "retry")}
                                            disabled={actionLoading}
                                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-red-950/60 hover:bg-red-950 text-red-400 border border-red-900/50 rounded-lg transition-colors disabled:opacity-40">
                                            <RotateCcw className="w-3 h-3" /> Retry
                                        </button>
                                    )}
                                    {txn.status === "review" && (
                                        <button onClick={() => handleAction(txn.id, "resolve")}
                                            disabled={actionLoading}
                                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-green-950/60 hover:bg-green-950 text-green-400 border border-green-900/50 rounded-lg transition-colors disabled:opacity-40">
                                            <CheckCircle className="w-3 h-3" /> Resolve
                                        </button>
                                    )}
                                    <button onClick={() => setModal(txn)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors">
                                        <Eye className="w-3 h-3" /> View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/40">
                            <span className="text-xs text-zinc-500">
                                {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                                    className="px-3 py-1.5 text-xs font-medium bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    ← Prev
                                </button>
                                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                                    className="px-3 py-1.5 text-xs font-medium bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {modal && (
                <RefundModal
                    txn={modal}
                    onClose={() => setModal(null)}
                    onRetry={id => handleAction(id, "retry")}
                    onResolve={id => handleAction(id, "resolve")}
                    loading={actionLoading}
                />
            )}

            {/* TOAST */}
            {toast && (
                <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl max-w-[calc(100vw-2rem)]
                    ${toast.type === "error"
                        ? "bg-red-950/90 border-red-900/50 text-red-300"
                        : "bg-zinc-900 border-zinc-700 text-white"}`}>
                    {toast.type === "error"
                        ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                    <span className="truncate">{toast.msg}</span>
                </div>
            )}
        </div>
    );
}