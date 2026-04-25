import { NextResponse } from "next/server";

export function middleware(req) {
    // ✅ Read token safely
    const token = req.cookies.get("token")?.value;

    const { pathname } = req.nextUrl;

    // 🔓 Public routes (no auth required)
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    // 🔒 Protected routes
    if (!token) {
        // Debug log (optional)
        NextResponse.redirect("/login");
    }
}