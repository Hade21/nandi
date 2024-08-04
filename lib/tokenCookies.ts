export const SetTokenCookies = ({
  accessToken,
  refreshToken,
  id,
}: {
  accessToken: string;
  refreshToken: string;
  id: string;
}) => {
  return fetch("/api/storeToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken, refreshToken, id }),
  });
};
