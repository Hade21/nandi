export const SetTokenCookies = ({
  accessToken,
  refreshToken,
  id,
  role,
}: {
  accessToken: string;
  refreshToken: string;
  id: string;
  role: string;
}) => {
  return fetch("/api/storeToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken, refreshToken, id, role }),
  });
};

export const GetTokenCookies = async () => {
  const res = await fetch("/api/accessToken", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const RemoveTokenCookies = async () => {
  const res = await fetch("/api/removeToken", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};
