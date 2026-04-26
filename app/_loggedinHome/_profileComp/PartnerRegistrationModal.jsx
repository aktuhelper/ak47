import { useState } from "react";
import { X, Smartphone, CheckCircle, Loader2, AlertCircle, IndianRupee, ShieldCheck } from "lucide-react";
import { fetchFromStrapi } from '@/secure/strapi';

export default function PartnerRegistrationModal({ isOpen, onClose, userData, onRegistered }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        upiId: "",
        accountHolderName: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const validateForm = () => {
        if (!form.accountHolderName.trim()) return "Full name is required.";
        if (!form.upiId.trim()) return "UPI ID is required.";
        if (!/^[\w.\-_+]+@[\w]+$/.test(form.upiId)) return "Enter a valid UPI ID (e.g. name@upi).";
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) { setError(validationError); return; }

        setIsSubmitting(true);
        setError("");

        try {
            // 1. Save UPI details to payout-accounts collection
            const res = await fetch('/api/strapi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'payout-accounts',
                    method: 'POST',
                    data: {
                        user_profile: userData?.documentId,
                        accountType: 'upi',
                        accountHolderName: form.accountHolderName,
                        upiId: form.upiId,
                        isVerified: false,
                        isPartner: true,
                    },
                }),
            });

            if (!res.ok) throw new Error('Failed to save payout account');

            // 2. Mark user as partner in user-profiles
            await fetch('/api/strapi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: `user-profiles/${userData?.documentId}`,
                    method: 'PUT',
                    data: { isPartner: true },
                }),
            });

            setStep(3);
            if (onRegistered) onRegistered();

        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error("Partner registration error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleClose = () => {
        setStep(1);
        setForm({ upiId: "", accountHolderName: "" });
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm hidden md:block"
                onClick={handleClose}
            />

            {/* Sheet / Modal container */}
            <div className="
                relative w-full bg-background flex flex-col
                h-full
                md:h-auto md:max-w-lg md:rounded-2xl md:shadow-2xl md:border md:border-border
                md:max-h-[90vh]
                overflow-hidden
            ">

                {/* ── HEADER ── */}
                <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/10 via-purple-500/10 to-background">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-lg">
                            🤝
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-foreground leading-tight">
                                Become a Partner
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Earn money answering paid queries
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* ── SCROLLABLE BODY ── */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">

                    {step !== 3 && (
                        <>
                            {/* Earning Stats Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-center">
                                    <p className="text-xl font-bold text-green-600 dark:text-green-400">80%</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">You earn</p>
                                </div>
                                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                                    <p className="text-xl font-bold text-primary">20%</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Platform fee</p>
                                </div>
                                <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-center">
                                    <IndianRupee className="w-5 h-5 text-purple-500 mx-auto" />
                                    <p className="text-xs text-muted-foreground mt-0.5">Instant pay</p>
                                </div>
                            </div>

                            {/* How it works */}
                            <div className="rounded-xl bg-muted/40 border border-border p-4 space-y-2.5">
                                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">How it works</p>
                                {[
                                    { emoji: "💬", text: "User sends you a paid query with a set amount" },
                                    { emoji: "✍️", text: "You answer within the time limit" },
                                    { emoji: "✅", text: "User accepts → you get 90% instantly" },
                                    { emoji: "❌", text: "User rejects → you still get 20% for effort" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <span className="text-base leading-none mt-0.5">{item.emoji}</span>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* UPI Info Banner */}
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Smartphone className="w-5 h-5 text-blue-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">UPI Payout</p>
                                    <p className="text-xs text-muted-foreground">Instant transfer to your UPI ID</p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">

                                {/* Full Name */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                                        Full Name <span className="text-muted-foreground font-normal">(as per UPI)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="accountHolderName"
                                        value={form.accountHolderName}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-muted/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    />
                                </div>

                                {/* UPI ID */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">UPI ID</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            name="upiId"
                                            value={form.upiId}
                                            onChange={handleChange}
                                            placeholder="yourname@upi"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                                        e.g. yourname@okaxis, yourname@ybl, yourname@paytm
                                    </p>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Security note */}
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                Details are encrypted & secure. Payouts via UPI.
                            </div>
                        </>
                    )}

                    {/* ── SUCCESS ── */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center text-center py-10 px-4 min-h-[60vh] md:min-h-0">
                            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mb-5">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">You're a Partner! 🎉</h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Your UPI payout account has been registered.
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Payouts will go directly to your{" "}
                                <span className="text-foreground font-medium">UPI ID</span>.
                            </p>

                            <div className="w-full grid grid-cols-2 gap-3 mb-6">
                                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-center">
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">80%</p>
                                    <p className="text-xs text-muted-foreground">On acceptance</p>
                                </div>
                                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3 text-center">
                                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">20%</p>
                                    <p className="text-xs text-muted-foreground">Even on rejection</p>
                                </div>
                            </div>

                            <div className="w-full p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                                💡 Users can now send you paid queries. Start earning!
                            </div>
                        </div>
                    )}
                </div>

                {/* ── STICKY FOOTER BUTTON ── */}
                <div className="flex-shrink-0 px-5 py-4 border-t border-border bg-background">
                    <button
                        onClick={step === 3 ? handleClose : handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                        ) : step === 3 ? (
                            "Done ✓"
                        ) : (
                            "🚀 Register as Partner"
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}