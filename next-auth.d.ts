import "next-auth";
import { DefaultSession } from "next-auth";

interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

declare module "next-auth" {
  interface User {
    data: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      profilePict: string;
      role: "ADMIN" | "USER";
      token: AuthToken;
    };
  }
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profilePict: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePict: string;
    role: "ADMIN" | "USER";
  }
}
