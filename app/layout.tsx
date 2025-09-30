import FramerMotionPresent from "@/components/FramerMotionPresent";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/utils/QueryProvider";
import SessionProvider from "@/utils/SessionProvider";
import StoreProvider from "@/utils/StoreProvider";
import ThemeProvider from "@/utils/ThemeProvider";
import type { Metadata } from "next";
import { Inter, Rubik_Moonrocks } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const rubik_moonrocks = Rubik_Moonrocks({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rubik-moonrocks",
});

export const metadata: Metadata = {
  title: "Nandi",
  description: "Find Anything",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${rubik_moonrocks.variable}`}>
        <NextTopLoader />
        <ThemeProvider attribute="class" defaultTheme="system">
          <QueryProvider>
            <StoreProvider>
              <SessionProvider>
                <FramerMotionPresent>{children}</FramerMotionPresent>
              </SessionProvider>
            </StoreProvider>
          </QueryProvider>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
