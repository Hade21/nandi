import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accessToken, refreshToken, id } = await request.json();

  cookies().set("token", JSON.stringify({ accessToken, refreshToken, id }), {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60,
    sameSite: "strict",
  });

  return NextResponse.json({ message: "success" }, { status: 200 });
}
