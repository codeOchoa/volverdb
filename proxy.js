import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

const PUBLIC_PATHS = [
    "/login",
    "/api/login",
    "/favicon.ico",
    "/_next",
    "/icons",
    "/public",
];

function isPublicPath(pathname) {
    return PUBLIC_PATHS.some((publicPath) =>
        pathname === publicPath || pathname.startsWith(publicPath)
    );
}

export async function proxy(req) {
    const { pathname } = req.nextUrl;

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    const redirectTo = req.nextUrl.pathname + req.nextUrl.search;
    const isApiRoute = pathname.startsWith("/api");
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, message: "No autenticado." },
                { status: 401 }
            );
        }

        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirectTo", redirectTo);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const payload = await verifyAuthToken(token);

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", String(payload.sub || ""));
        requestHeaders.set("x-user-username", payload.username || "");
        requestHeaders.set("x-user-role", payload.role || "");

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch (err) {
        console.error("❌ Error verificando JWT en middleware:", err);

        if (isApiRoute) {
            return NextResponse.json(
                { success: false, message: "Token inválido o expirado." },
                { status: 401 }
            );
        }

        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirectTo", redirectTo);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        "/api/:path*",
        "/dashboard/:path*",
        "/sales/:path*",
        "/metrics/:path*",
        "/open-cash/:path*",
    ],
};