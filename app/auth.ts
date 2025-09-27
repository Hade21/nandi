import { Credentials, InvalidLoginError } from "@/types";
import axios, { isAxiosError } from "axios";
import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 4 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "string" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as Credentials;
        if (!username && !password) return null;
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_URL_SERVER!}/api/v1/auth/login`,
            {
              username,
              password,
            }
          );
          const user = response.data;
          if (response.status === 200 && user) {
            return user;
          }
          return null;
        } catch (error) {
          if (isAxiosError(error)) {
            throw new InvalidLoginError(error.response?.data.message);
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.data.id;
        token.firstName = user.data.firstName;
        token.lastName = user.data.lastName;
        token.profilePict = user.data.profilePict;
        token.role = user.data.role;
        token.accessToken = user.data.token.accessToken;
        token.refreshToken = user.data.token.refreshToken;
        token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.expires = new Date(Number(token.exp)).toDateString();
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.profilePict = token.profilePict as string;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn(message) {
      console.log("User signed in:", message);
    },
  },
  logger: {
    error(code) {
      console.error(`Error: ${code}`);
    },
    warn(code) {
      console.warn(`Warning: ${code}`);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.debug(`Debug: ${code}`, metadata);
      }
    },
  },
});
