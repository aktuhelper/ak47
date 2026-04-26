import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
    const cookieStore = await cookies();

    if (cookieStore.get("admin_auth")?.value !== "1") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = `${process.env.STRAPI_URL}/api/transactions?filters[statuss][$eq]=pending&populate[0]=toUser&populate[1]=personal_query&pagination[pageSize]=100&publicationState=preview`;

    console.log('[transactions] fetching:', url);

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKENI}` },
        cache: "no-store",
    });

    const data = await res.json();

    

    // Step 1: map transactions without UPI
    const mapped = (data.data || []).map((t) => ({
        documentId: t.documentId,
        amount_paise: t.amount_paise,
        type: t.type,
        statuss: t.statuss,
        mentorName: t.toUser?.name || "Unknown",
        mentorDocumentId: t.toUser?.documentId || null,
        upiId: "",   // filled in below
        queryTitle: t.personal_query?.title || "Query",
    }));

    // Step 2: fetch payout accounts for each unique mentor
    const uniqueMentorIds = [...new Set(mapped.map(t => t.mentorDocumentId).filter(Boolean))];

    await Promise.all(uniqueMentorIds.map(async (mentorId) => {
        const payoutRes = await fetch(
            `${process.env.STRAPI_URL}/api/payout-accounts?filters[user_profile][documentId][$eq]=${mentorId}`,
            { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKENI}` } }
        );
        const payoutData = await payoutRes.json();
        const upiId = payoutData?.data?.[0]?.upiId || "";

        // Fill UPI into all transactions for this mentor
        mapped.forEach(t => {
            if (t.mentorDocumentId === mentorId) t.upiId = upiId;
        });
    }));

    return NextResponse.json({ transactions: mapped });
   
   
}