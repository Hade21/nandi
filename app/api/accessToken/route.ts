import { jwtDecode, JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const baseUrl = process.env.URL_SERVER;

export async function GET() {
  const tokenCookies = cookies().get("token");
  const parsedTokenCookies = JSON.parse(tokenCookies?.value || "{}");
  const { accessToken, refreshToken, id } = parsedTokenCookies;
  if (!accessToken || !refreshToken || !id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { exp } = jwtDecode<JwtPayload>(accessToken);
  const isExpired = Date.now() >= exp! * 1000;

  if (isExpired) {
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      console.log(res);

      if (!res.ok) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      } else if (res.ok) {
        const { body } = await res.json();
        cookies().set(
          "token",
          JSON.stringify({
            id,
            refreshToken,
            accessToken: body.data.token.accessToken,
          }),
          {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
          }
        );

        return NextResponse.json(
          {
            message: "Success",
            data: { id, accessToken: body.data.token.accessToken },
          },
          { status: 200 }
        );
      }
    } catch (error) {
      return NextResponse.json(error);
    }
  } else {
    return NextResponse.json(
      { message: "Success", data: { id, accessToken } },
      { status: 200 }
    );
  }
}
