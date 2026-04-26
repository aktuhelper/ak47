// app/api/admin/refunds/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKENI;

export async function GET() {
    const cookieStore = await cookies();
    if (cookieStore.get("admin_auth")?.value !== "1") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = `${STRAPI_URL}/api/transactions?` +
        `filters[type][$eq]=refund` +
        `&populate[0]=toUser` +
        `&populate[1]=personal_query` +
        `&pagination[pageSize]=100` +
        `&sort[0]=createdAt:desc` +
        `&publicationState=preview`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        cache: "no-store",
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    const data = await res.json();

    const transactions = (data.data || []).map((t) => ({
        id: t.documentId,
        documentId: t.documentId,
        amount: t.amount_paise ?? 0,
        status: t.statuss ?? "pending",
        type: t.type,
        note: t.note || "",
        createdAt: t.createdAt,
        settledAt: t.statuss === "completed" ? t.updatedAt : null,

        // User who was refunded
        userName: t.toUser?.name || "Unknown User",
        userEmail: t.toUser?.email || "",
        userDocumentId: t.toUser?.documentId || null,

        // Query details
        queryTitle: t.personal_query?.title || "Query",
        queryDocumentId: t.personal_query?.documentId || null,
        queryType: deriveQueryType(t.note || ""),

        // ── Razorpay IDs ──────────────────────────────────────────────────
        // Read from dedicated Strapi fields first (added in schema fix).
        // Fall back to extracting from the note string for older records
        // that were created before the dedicated columns existed.
        razorpayPaymentId: t.razorpay_payment_id || extractPaymentId(t.note || ""),
        razorpayRefundId: t.razorpay_refund_id || extractRefundId(t.note || ""),
    }));

    return NextResponse.json({ transactions });
}

// ── POST — update refund status (retry / resolve) ──────────────────────────
export async function POST(req) {
    const cookieStore = await cookies();
    if (cookieStore.get("admin_auth")?.value !== "1") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactionId, action } = await req.json();

    if (!transactionId || !["retry", "resolve"].includes(action)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // ── Fetch the transaction to get payment ID ────────────────────────────
    const txRes = await fetch(
        `${STRAPI_URL}/api/transactions/${transactionId}?populate[0]=toUser&populate[1]=personal_query`,
        { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
    );

    if (!txRes.ok) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const txData = await txRes.json();
    const tx = txData.data;

    // Read payment ID from dedicated field first, fall back to note extraction
    const razorpayPaymentId = tx.razorpay_payment_id || extractPaymentId(tx.note || "");

    if (action === "retry") {
        if (!razorpayPaymentId) {
            return NextResponse.json({ error: "No Razorpay payment ID found" }, { status: 400 });
        }

        const { default: razorpay } = await import("@/lib/razorpay");

        let refundId = null;

        try {
            const rzRefund = await razorpay.payments.refund(razorpayPaymentId, {
                amount: tx.amount_paise,
                notes: { reason: "Admin retry", transactionId },
            });
            refundId = rzRefund.id;
        } catch (err) {
            // If already refunded on Razorpay side, treat as success
            if (!err.error?.description?.includes("already refunded")) {
                return NextResponse.json({ error: err.message }, { status: 500 });
            }
        }

        // ── Mark completed and save the refund ID ─────────────────────────
        await fetch(`${STRAPI_URL}/api/transactions/${transactionId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    statuss: "completed",
                    ...(refundId && { razorpay_refund_id: refundId }),
                    note: tx.note + ` | Retried by admin on ${new Date().toISOString()}${refundId ? ` | refund ID: ${refundId}` : ""}`,
                },
            }),
        });

    } else {
        // ── resolve — just mark completed, no Razorpay call ───────────────
        await fetch(`${STRAPI_URL}/api/transactions/${transactionId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    statuss: "completed",
                    note: tx.note + ` | Manually resolved by admin on ${new Date().toISOString()}`,
                },
            }),
        });
    }

    // ── Also fix the query payment_status if still wrong ──────────────────
    const queryDocumentId = tx.personal_query?.documentId;
    if (queryDocumentId) {
        await fetch(`${STRAPI_URL}/api/personal-queries/${queryDocumentId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: { payment_status: "refunded" } }),
        });
    }

    return NextResponse.json({ success: true });
}

function extractPaymentId(note) {
    const match = note.match(/pay_[A-Za-z0-9]+/);
    return match ? match[0] : null;
}

function extractRefundId(note) {
    const match = note.match(/rfnd_[A-Za-z0-9]+/);
    return match ? match[0] : null;
}

function deriveQueryType(note) {
    const n = note.toLowerCase();
    if (n.includes("rejected") || n.includes("reject")) return "reject";
    if (n.includes("expired") || n.includes("expire") || n.includes("time")) return "expire";
    return "manual";
}