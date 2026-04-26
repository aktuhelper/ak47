import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    const cookieStore = await cookies(); // ← await added in both files

    if (cookieStore.get("admin_auth")?.value !== "1") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactionId } = await req.json();

    const res = await fetch(
        `${process.env.STRAPI_URL}/api/transactions/${transactionId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKENI}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: { statuss: "completed" } }),
        }
    );

    if (!res.ok) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}