import StoreProvider from "@/components/StoreProvider";
import ThemeProvider from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter, Rubik_Moonrocks } from "next/font/google";
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
    <html lang="en">
      <body className={`${inter.className} ${rubik_moonrocks.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
