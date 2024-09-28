import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { Inter as FontSans } from "next/font/google";
import { ny } from "@/lib/utils";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { NavigationMenuDemo } from "@/components/Nav";
import SessionProvider from "./SessionProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The Mighty Oak Store",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={ny(
          "min-h-screen bg-slate-200 geistSans antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider>
          <Navbar />

          {/* <NavigationMenuDemo /> */}
          <main className="p-4 max-w-7xl m-auto min-w-[300px]">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
