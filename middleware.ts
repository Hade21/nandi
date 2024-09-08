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
  console.log("🚀 ~ middleware ~ token:", token);

  const path = req.nextUrl.pathname;
  console.log("🚀 ~ middleware ~ path:", path);
  const isProtectedRoute = protectedRoutes.includes(path);
  console.log("🚀 ~ middleware ~ isProtectedRoute:", isProtectedRoute, path);
  const isPublicRoute = publicRoutes.includes(path);
  console.log("🚀 ~ middleware ~ isPublicRoute:", isPublicRoute);

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
    console.log("🚀 ~ middleware ~ session:", session);
    return NextResponse.redirect(new URL("/maps", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
