import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/auth";

const authRoutes = ["/login", "/register"];
const adminRoutes = ["/new", "/change-role"];
const userRoutes = ["/account", "/update"];

// type Session =
//   | undefined
//   | {
//       message: string;
//       data: {
//         id: any;
//         accessToken: any;
//         role: any;
//       } | null;
//     };

export default async function middleware(req: NextRequest) {
  // const token = (await cookies()).get("token")?.value || "";

  const path = req.nextUrl.pathname;
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
  const isUserRoute = userRoutes.some((route) => path.startsWith(route));

  // const session: Session = await decryptSession(token);
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = !!session?.user.id;

  console.log("user: " + session?.user.name);
  console.log(`isAdmin: ${isAdmin}`);
  console.log(`isLoggedIn: ${isLoggedIn}`);
  console.log(`isAuthRoute: ${isAuthRoute}`);
  console.log(`isAdminRoute: ${isAdminRoute}`);
  console.log(`isUserRoute: ${isUserRoute}`);

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/maps", req.url));
  }
  if (!isLoggedIn && (isUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
