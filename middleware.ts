import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import decryptSession from "./lib/decrypt-session";

const publicRoutes = ["/login", "/register", "/"];
const protectedRoutes = ["/new", "/update/[id]"];

type Session =
  | undefined
  | {
      message: string;
      data: {
        id: any;
        accessToken: any;
        role: any;
      } | null;
    };

export default async function middleware(req: NextRequest) {
  const token = cookies().get("token")?.value || "";

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session: Session = await decryptSession(token);

  if (
    (isProtectedRoute || req.nextUrl.pathname.startsWith("/update")) &&
    !session?.data?.id
  ) {
    console.log("🚀 ~ middleware ~ session: token doesn't exist");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    (isProtectedRoute || req.nextUrl.pathname.startsWith("/update")) &&
    session?.data?.role !== "ADMIN"
  ) {
    console.log("🚀 ~ middleware ~ session:", session?.data?.role);
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (isPublicRoute && session?.data?.id) {
    return NextResponse.redirect(new URL("/maps", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
