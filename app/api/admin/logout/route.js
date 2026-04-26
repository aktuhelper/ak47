import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_auth", "", {
        maxAge: 0,          // immediately expires
        path: "/",
        httpOnly: true,
        sameSite: "strict",
    });

    return response;
}