import { jwtDecode, JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_URL_SERVER;

export default async function decryptSession(token: string) {
  const parsedTokenCookies = JSON.parse(token || "{}");
  const { accessToken, refreshToken, id, role } = parsedTokenCookies;
  if (!accessToken || !refreshToken || !id) {
    return { message: "Failed to decrypt session", data: null };
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
        return { message: "Unauthorized, token expired", data: null };
      } else if (res.ok) {
        const { body } = await res.json();
        cookies().set(
          "token",
          JSON.stringify({
            id,
            refreshToken,
            accessToken: body.data.token.accessToken,
            role: body.data.role,
          }),
          {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
          }
        );

        return {
          message: "Success",
          data: {
            id,
            accessToken: body.data.token.accessToken,
            role: body.data.role,
          },
        };
      }
    } catch (error) {
      return { message: "Token expired", data: null };
    }
  } else {
    return { message: "Success", data: { id, accessToken, role } };
  }
}
