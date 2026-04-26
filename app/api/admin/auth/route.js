import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const cookieStore = await cookies(); // ← await added
    cookieStore.set("admin_auth", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 8,
        path: "/",
    });

    return NextResponse.json({ ok: true });
}