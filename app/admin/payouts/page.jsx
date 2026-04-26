"use client";
import { useState, useEffect } from "react";
import {
    IndianRupee, CheckCircle, RefreshCw, LogOut,
    Copy, Clock, Wallet, ShieldCheck,ShieldAlert
} from "lucide-react";

export default function AdminPayoutsPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [markingId, setMarkingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    useEffect(() => {
        fetch("/api/admin/auth/check")
            .then(res => { if (res.ok) setAuthed(true); })
            .catch(() => { });
    }, []);
    useEffect(() => {
        if (authed) loadTransactions();
    }, [authed]);
    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            setAuthed(true);
            setAuthError("");
        } else {
            setAuthError("Incorrect password. Try again.");
        }
    };
    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        setAuthed(false);
    };
    const loadTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/transactions");
            if (!res.ok) throw new Error("Unauthorized or server error");
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch (err) {
            console.error(err);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };
    const handleMarkPaid = async (txnId) => {
        setMarkingId(txnId);
        try {
            const res = await fetch("/api/admin/mark-paid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: txnId }),
            });
            if (res.ok) {
                setTransactions((prev) => prev.filter((t) => t.documentId !== txnId));
            }
        } catch (err) {
            alert("Failed to mark as paid.");
        } finally {
            setMarkingId(null);
        }
    };
    const copyUPI = (upi, id) => {
        navigator.clipboard.writeText(upi);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };
    const totalPending = transactions.reduce((sum, t) => sum + (t.amount_paise ?? 0), 0);
    // ── Login ──────────────────────────────────────────────────────────────────
    if (!authed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="w-full max-w-sm px-4">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-4">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h1 className="text-white text-xl font-bold tracking-tight">Admin Portal</h1>
                        <p className="text-zinc-500 text-sm mt-1">Sign in to manage payouts</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-3">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Admin password"
                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                autoFocus
                            />
                            {authError && (
                                <p className="text-red-400 text-xs mt-2 px-1">{authError}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        );
    }
    // ── Main ───────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Top nav */}
            <div className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                            <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-semibold text-white">Payout Panel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadTransactions}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all disabled:opacity-40"
                        >
                            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <a href="/admin/refunds">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all">
                                <ShieldAlert className="w-3 h-3" />
                                Refunds
                            </button>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
                        >
                            <LogOut className="w-3 h-3" />
                            Logout
                        </button>
                        
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                {/* Stat strip */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5">
                        <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Pending Payouts
                        </p>
                        <p className="text-2xl font-bold text-amber-400 flex items-center gap-0.5">
                            <IndianRupee className="w-5 h-5 opacity-80" />
                            {(totalPending / 100).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5">
                        <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Wallet className="w-3 h-3" /> Transactions
                        </p>
                        <p className="text-2xl font-bold text-white">
                            {transactions.length}
                            <span className="text-sm font-normal text-zinc-500 ml-1.5">awaiting</span>
                        </p>
                    </div>
                </div>
                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <RefreshCw className="w-5 h-5 animate-spin text-zinc-600" />
                        <p className="text-sm text-zinc-600">Loading transactions…</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-green-900/20 border border-green-800/30 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm font-medium text-zinc-400">All caught up</p>
                        <p className="text-xs text-zinc-600">No pending payouts right now</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/70">
                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_160px_120px] gap-4 px-4 py-2.5 bg-zinc-900/60">
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Mentor / Query</p>
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest hidden sm:block">UPI</p>
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-right">Amount</p>
                        </div>
                        {transactions.map((txn) => {
                            const upi = txn.upiId || "—";
                            const name = txn.mentorName || "Unknown";
                            const queryTitle = txn.queryTitle || "Query";
                            const isRejected = txn.type === "refund";
                            return (
                                <div
                                    key={txn.documentId}
                                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_160px_120px] gap-4 items-center px-4 py-3.5 bg-zinc-950 hover:bg-zinc-900/60 transition-colors"
                                >
                                    {/* Mentor + query */}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-white truncate">{name}</span>
                                            {isRejected && (
                                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-950/60 text-red-400 border border-red-900/50 rounded-md">
                                                    Refund
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate mt-0.5">{queryTitle}</p>
                                        {/* UPI on mobile */}
                                        <div className="flex items-center gap-1.5 mt-1.5 sm:hidden">
                                            <span className="text-xs font-mono text-indigo-400 truncate">{upi}</span>
                                            <button
                                                onClick={() => copyUPI(upi, txn.documentId)}
                                                disabled={!txn.upiId}
                                                className="text-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                                            >
                                                {copiedId === txn.documentId
                                                    ? <CheckCircle className="w-3 h-3 text-green-400" />
                                                    : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>
                                    {/* UPI on desktop */}
                                    <div className="items-center gap-1.5 hidden sm:flex min-w-0">
                                        <span className="text-xs font-mono text-indigo-400 truncate">{upi}</span>
                                        <button
                                            onClick={() => copyUPI(upi, txn.documentId)}
                                            disabled={!txn.upiId}
                                            className="text-zinc-600 hover:text-zinc-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                                        >
                                            {copiedId === txn.documentId
                                                ? <CheckCircle className="w-3 h-3 text-green-400" />
                                                : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                    {/* Amount + action */}
                                    <div className="flex items-center justify-end gap-2.5 flex-shrink-0">
                                        <span className="text-sm font-bold text-amber-400 flex items-center gap-0.5 whitespace-nowrap">
                                            <IndianRupee className="w-3.5 h-3.5" />
                                            {((txn.amount_paise ?? 0) / 100).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => handleMarkPaid(txn.documentId)}
                                            disabled={markingId === txn.documentId}
                                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            {markingId === txn.documentId
                                                ? <RefreshCw className="w-3 h-3 animate-spin" />
                                                : <CheckCircle className="w-3 h-3" />}
                                            Paid
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}