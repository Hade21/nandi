import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  cookies().delete("token");
  return NextResponse.json({ message: "Token deleted" }, { status: 200 });
}
