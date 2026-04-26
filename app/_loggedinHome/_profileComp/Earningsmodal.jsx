"use client";
import { useState, useEffect, useRef } from "react";
import {
    X, TrendingUp, Clock, CheckCircle2, IndianRupee,
    FileText, RefreshCw, ChevronRight, AlertCircle, Wallet
} from "lucide-react";
import { fetchFromStrapi } from "@/secure/strapi";

const paise = (v) => ((v ?? 0) / 100).toFixed(2);

const fmt = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
};

const TYPE_LABEL = {
    mentor_payout: "Mentor Payout",
    platform_fee: "Platform Fee",
    refund: "Refund",
};

function StatCard({ icon: Icon, label, value, colorClass, loading, isCurrency = true }) {
    return (
        <div className={`flex-1 min-w-0 rounded-xl border px-4 py-3.5 flex flex-col gap-2 ${colorClass}`}>
            <div className="flex items-center gap-1.5 text-xs font-medium opacity-60">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
            </div>
            {loading ? (
                <div className="h-6 w-16 rounded-md bg-current opacity-10 animate-pulse" />
            ) : (
                <div className="text-xl font-bold tracking-tight flex items-center gap-0.5">
                    {isCurrency && <IndianRupee className="w-4 h-4 opacity-70" />}
                    {value}
                </div>
            )}
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-theme-secondary border border-theme flex items-center justify-center">
                <FileText className="w-5 h-5 text-theme-muted" />
            </div>
            <p className="text-sm text-theme-secondary">{text}</p>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-theme last:border-0 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-800 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-2.5 w-1/3 rounded bg-gray-100 dark:bg-zinc-800/60" />
            </div>
            <div className="h-4 w-14 rounded bg-gray-200 dark:bg-zinc-800 flex-shrink-0" />
        </div>
    );
}

function TxnRow({ txn }) {
    const isPaid = txn.statuss === "completed";
    const isPending = txn.statuss === "pending";

    const statusClass = isPaid
        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
        : isPending
            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
            : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700";

    const title =
        txn.personal_query?.data?.attributes?.title ||
        txn.personal_query?.title ||
        TYPE_LABEL[txn.type] ||
        "Transaction";

    return (
        <div className="flex items-start justify-between gap-3 py-3.5 border-b border-theme last:border-0">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-theme-primary truncate">{title}</p>
                <p className="text-xs text-theme-muted mt-0.5">
                    {TYPE_LABEL[txn.type] ?? txn.type} · {fmt(txn.updatedAt)}
                </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{paise(txn.amount_paise)}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusClass}`}>
                    {txn.statuss ?? "—"}
                </span>
            </div>
        </div>
    );
}

const TABS = [
    { id: "overview", label: "Overview" },
    { id: "history", label: "History" },
];

export default function EarningsModal({ isOpen, onClose, userData }) {
    const [tab, setTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [queries, setQueries] = useState([]);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isOpen && userData?.documentId) fetchData();
        if (isOpen) setTab("overview");
    }, [isOpen, userData?.documentId]);

    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const id = userData.documentId;
            const [txnRes, qRes] = await Promise.all([
                fetchFromStrapi(
                    `transactions?filters[toUser][documentId][$eq]=${id}&populate[personal_query][fields][0]=title&sort=createdAt:desc&pagination[limit]=100`
                ),
                fetchFromStrapi(
                    `personal-queries?filters[toUser][documentId][$eq]=${id}&sort=createdAt:desc&pagination[limit]=100`
                ),
            ]);
            setTransactions(txnRes?.data ?? []);
            setQueries(qRes?.data ?? []);
        } catch (err) {
            console.error(err);
            setError("Failed to load earnings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const completedTxns = transactions.filter((t) => t.statuss === "completed" && t.type === "mentor_payout");
    const pendingTxns = transactions.filter((t) => t.statuss === "pending" && t.type === "mentor_payout");
    const totalEarned = completedTxns.reduce((s, t) => s + (t.amount_paise ?? 0), 0);
    const pendingAmount = pendingTxns.reduce((s, t) => s + (t.amount_paise ?? 0), 0);
    const answeredQueries = queries.filter((q) => q.answered_at != null);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        >
            <div className="absolute inset-0 sm:inset-3 bg-white dark:bg-zinc-950 sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl border-0 sm:border border-theme">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-theme flex-shrink-0 bg-white dark:bg-zinc-950">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-theme-primary tracking-tight">Your Earnings</h2>
                            <p className="text-[11px] text-theme-muted">Partner dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="p-2 rounded-lg text-theme-secondary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-theme-secondary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">

                    {/* Left Sidebar — Summary */}
                    <div className="sm:w-64 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-theme flex flex-col bg-gray-50/50 dark:bg-zinc-900/30 overflow-y-auto">
                        <div className="px-4 py-4">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-theme-muted mb-2.5">
                                Summary
                            </p>
                            <div className="rounded-xl border border-theme overflow-hidden divide-y divide-theme">
                                {[
                                    { label: "Total Payouts", value: `₹${paise(totalEarned)}`, cls: "text-emerald-600 dark:text-emerald-400 font-bold" },
                                    { label: "Pending Payouts", value: `₹${paise(pendingAmount)}`, cls: "text-amber-600 dark:text-amber-400 font-bold" },
                                    { label: "Queries Answered", value: answeredQueries.length, cls: "text-theme-primary font-bold" },
                                    { label: "Total Transactions", value: transactions.length, cls: "text-theme-primary font-bold" },
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-zinc-900/60">
                                        <span className="text-xs text-theme-secondary">{row.label}</span>
                                        <span className={`text-xs ${row.cls}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950">

                        {/* Error */}
                        {error && (
                            <div className="mx-5 mt-4 flex items-center gap-2.5 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 rounded-xl px-4 py-3">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Stat Cards — above tabs */}
                        <div className="flex gap-3 px-5 py-4 border-b border-theme flex-shrink-0">
                            <StatCard
                                icon={TrendingUp}
                                label="Total Earned"
                                value={paise(totalEarned)}
                                colorClass="border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                                loading={loading}
                            />
                            <StatCard
                                icon={Clock}
                                label="Pending"
                                value={paise(pendingAmount)}
                                colorClass="border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300"
                                loading={loading}
                            />
                            <StatCard
                                icon={CheckCircle2}
                                label="Answered"
                                value={answeredQueries.length}
                                colorClass="border-blue-200 dark:border-indigo-800/40 bg-blue-50 dark:bg-indigo-950/20 text-blue-700 dark:text-indigo-300"
                                loading={loading}
                                isCurrency={false}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex px-5 border-b border-theme flex-shrink-0">
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all ${tab === t.id
                                            ? "border-blue-500 dark:border-indigo-500 text-blue-600 dark:text-indigo-400"
                                            : "border-transparent text-theme-muted hover:text-theme-secondary"
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="overflow-y-auto flex-1 px-5 py-5">

                            {/* Overview */}
                            {tab === "overview" && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-theme-muted">
                                            Recent Transactions
                                        </p>
                                        {transactions.length > 5 && (
                                            <button
                                                onClick={() => setTab("history")}
                                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-indigo-400 hover:underline font-medium"
                                            >
                                                View all
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    {loading ? (
                                        <div>{[1, 2, 3].map((i) => <SkeletonRow key={i} />)}</div>
                                    ) : transactions.length === 0 ? (
                                        <EmptyState text="No transactions yet" />
                                    ) : (
                                        <div>
                                            {transactions.slice(0, 5).map((txn) => (
                                                <TxnRow key={txn.documentId ?? txn.id} txn={txn} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* History */}
                            {tab === "history" && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-theme-muted">
                                            Payout History
                                        </p>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-theme-secondary border border-theme">
                                            {transactions.length}
                                        </span>
                                    </div>
                                    {loading ? (
                                        <div>{[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}</div>
                                    ) : transactions.length === 0 ? (
                                        <EmptyState text="No payout history yet" />
                                    ) : (
                                        transactions.map((txn) => (
                                            <TxnRow key={txn.documentId ?? txn.id} txn={txn} />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}